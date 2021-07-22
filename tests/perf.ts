import { StopWatch } from "stopwatch-node";
import { checker } from "../src/main";
import { assertTrue, assertFalse } from "./assert";

export type BasicType = {
    foo: number;
    bar: string;
};

const sw = new StopWatch();
sw.start('create LS');
const { checkValue } = checker("BasicType", "./tests/basic");
sw.stop();

sw.start('1 test warmup');
assertTrue(checkValue({ foo: 1, bar: "test" }));
sw.stop();

sw.start('200 tests');
for (let i = 0; i < 100; i++) {
    assertTrue(checkValue({ foo: 1, bar: "test" }));
    assertFalse(checkValue({ foo: true, bar: "test" }));
}
sw.stop();
sw.prettyPrint();
