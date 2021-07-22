import { StopWatch } from "stopwatch-node";
import { checker } from "../src/main";
import { assertTrue, assertFalse } from "./assert";

export type Num = number;

const sw = new StopWatch();
const { checkValue } = checker("Num", "./tests/literals");
assertTrue(checkValue(1));
assertFalse(checkValue("3"));

console.log("OK");