# ts-data-checker
Type checks JSON at runtime. Uses TypeScript language service to validate JSON string using TypeScript types. I.e. it is TypeScript compiler running at runtime to validate your values.

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

Check the examples dir for an express middleware example.

## Caveats

The data model sources need to be available at runtime. Declarations should be enough though. 

## Is this a good idea? 

I don't know. Is it? I think this functionality is the missing piece for typescript, to be able to check that untrusted data conforms to a certain model before use. I'm not sure running the full TS compiler at runtime is a good idea. Let's find out, or tell me why if it is not. 
