import { checker } from "../src/main";
import { assertTrue, assertFalse } from "./assert";

export type BasicType = {
    foo: number;
    bar: string;
};

const { checkValue } = checker("BasicType", "./basic", { workingDir: __dirname });

assertTrue(checkValue({ foo: 1, bar: "test" }));
assertFalse(checkValue({ foo: true, bar: "test" }));

console.log("OK");
