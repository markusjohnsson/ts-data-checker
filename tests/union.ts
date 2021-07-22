import { checker } from "../src/main";
import { assertTrue, assertFalse } from "./assert";

export type NumOrStr = number | string;

const { checkValue } = checker("NumOrStr", "./tests/union");
assertTrue(checkValue(1));
assertTrue(checkValue("3"));
assertFalse(checkValue({}));

console.log("OK");