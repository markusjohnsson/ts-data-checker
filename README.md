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

***Note:*** the first call to checkJson will be slower than subsequent calls.

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

***Note:*** the first call to checkValue will be slower than subsequent calls.

`checkValue` converts to JSON for you, so if you already have a JSON string, use `checkJson` instead. 