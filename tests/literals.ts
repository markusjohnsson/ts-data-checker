import { checker } from "../src/main";
import { assertTrue, assertFalse } from "./assert";

export type Num = number;

const { checkValue } = checker("Num", "./tests/literals");
assertTrue(checkValue(1));
assertFalse(checkValue("3"));

console.log("OK");