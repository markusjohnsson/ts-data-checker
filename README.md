# ts-data-checker
Type checks JSON at runtime. Uses TypeScript language service to validate JSON strings using TypeScript types. I.e. it is TypeScript compiler running at runtime to validate your values.

```
npm install ts-data-checker
```

## Check JSON (strings) at runtime

```ts
// example1.ts
import { checker } from "ts-data-checker";
import { assertTrue, assertFalse } from "./assert";

export type BasicType = {
    foo: number;
    bar: string;
};

// cf. `import { BasicType } from "./example1";`
const { checkJson } = checker("BasicType", "./example1"); 

assertTrue(checkJson(`{ "foo": 1, "bar": "test" }`));
assertFalse(checkJson(`{ "foo": true, "bar": "test" }`)); // foo is not a number, checkJson returns false

```

***Note:*** since `ts-data-checker` uses incremental compilation, subsequent calls to `checkJson` will be faster than the first call.

## Use as express middleware

Type check POST payloads against TypeScript types in express middleware:

```ts
import express from "express";
import { BlogPost, Comment } from "./model";
import { checkerMiddleware } from "./checkerMiddleware";

const app = express();

app.post(
    '/create',
    express.raw({ type: "application/json" }),
    checkerMiddleware("BlogPost", "./model"),

    (req, res) => {
        // safe assignment since body is parsed and type checked
        const post: BlogPost = req.body;

        console.log("Creating blog post", post.title);

        return res.json({ success: true }).end();
    });

app.post(
    '/comment',
    express.raw({ type: "application/json" }),
    checkerMiddleware("Comment", "./model"),

    (req, res) => {
        // safe assignment since body is parsed and type checked
        const comment: Comment = req.body;

        console.log("Saving comment from", comment.email);

        return res.json({ success: true }).end();
    });

app.listen(3000);

// model.ts

export type BlogPost = {
    title: string;
    body: string;
    tags: string[];
};

export type Comment = {
    email: string;
    text: string;
};

// checkerMiddleware.ts

import { checker } from "ts-data-checker";
import express from "express";

export function checkerMiddleware(typeName: string, module: string) {

    const { checkJson } = checker(typeName, module);

    return function checkerMiddlewareFn(
        req: express.Request, 
        res: express.Response, 
        next: express.NextFunction) {
        
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

```

## Or, check values

```ts
// example2.ts
import { checker } from "ts-data-checker";
import { assertTrue, assertFalse } from "./assert";

export type BasicType = {
    foo: number;
    bar: string;
};

// cf. `import { BasicType } from "./example2";`
const { checkValue } = checker("BasicType", "./example2"); 

assertTrue(checkValue({ foo: 1, bar: "test" }));
assertFalse(checkValue({ foo: true, bar: "test" })); // foo is not a number, checkValue returns false
```

***Note:*** since `ts-data-checker` uses incremental compilation, subsequent calls to `checkValue` will be faster than the first call.

`checkValue` converts to JSON for you, so if you already have a JSON string, use `checkJson` instead. 

## What else?

Check the examples dir for other working examples.

## Caveats

- **Source code:** The data model sources need to be available at runtime. Declarations should be enough though. 
- **Performance:** Performance will probably never be as good as custom coded type guards. 
- **Limitations:** Might break for large structures.

## Is this a good idea? 

I don't know. Is it? I think this functionality is the missing piece for typescript, to be able to check that untrusted data conforms to a certain model before use. I'm not sure running the full TS compiler at runtime is a good idea. Let's find out, or tell me why if it is not. 
