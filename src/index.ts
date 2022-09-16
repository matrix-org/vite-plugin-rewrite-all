import {ViteDevServer} from "vite";
import history from "connect-history-api-fallback";
import {Request, Response} from "express-serve-static-core";

export default function redirectAll(options: history.Options) {
    return {
        name: "rewrite-all",
        configureServer(server:ViteDevServer) {
            const { rewrites, ...rest } = options;

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
