export function assertTrue(d: boolean) {
    if (d == false) {
        throw new Error("Assertion failed");
    }
}
export function assertFalse(d: boolean) {
    assertTrue(!d);
}
