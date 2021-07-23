import { checker } from "../src/main";
import { assertTrue, assertFalse } from "./assert";

export type Orientation = "vertical" | "horizontal";

const { checkValue } = checker("Orientation", "./tests/literals");
assertTrue(checkValue("vertical"));
assertFalse(checkValue("sideways"));

console.log("OK");