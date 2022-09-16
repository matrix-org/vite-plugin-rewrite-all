import {ViteDevServer} from "vite";
import history from "connect-history-api-fallback";
import {Request, Response} from "express-serve-static-core";
import { Url } from 'url';

interface Options {
    readonly disableDotRule?: true | undefined;
    readonly htmlAcceptHeaders?: ReadonlyArray<string> | undefined;
    readonly index?: string | undefined;
    readonly logger?: typeof console.log | undefined;
    readonly rewrites?: ReadonlyArray<Rewrite> | undefined;
    readonly verbose?: boolean | undefined;
}

interface Context {
    readonly match: RegExpMatchArray;
    readonly parsedUrl: Url;
}
type RewriteTo = (context: Context) => string;

interface Rewrite {
    readonly from: RegExp;
    readonly to: string | RegExp | RewriteTo;
}


export default function redirectAll(options?: Options) {
    return {
        name: "rewrite-all",
        configureServer(server:ViteDevServer) {
            const { rewrites, ...rest } = options || {};

            return () => {
                const handler = history({
                    disableDotRule: true,
                    rewrites: [
                        {from: /\/$/, to: () => "/index.html"},
                        ...(rewrites || [])
                    ],
                    ...rest
                });

                server.middlewares.use((req, res, next) => {
                    handler(req as Request, res as Response, next)
                });
            };
        }
    }
};
