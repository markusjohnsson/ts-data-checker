import { checker } from "../../src/main";
import express from "express";

export function checkerMiddleware(typeName: string, module: string) {

    const { checkJson } = checker(typeName, module);

    return function checkerMiddlewareFn(req: express.Request, res: express.Response, next: express.NextFunction) {
        const s = String(req.body);
        if (checkJson(s)) {
            try {
                req.body = JSON.parse(s);
                return next();
            }
            catch {
                return res.status(400).end();
            }
        }
        return res.status(400).end();
    };
}
