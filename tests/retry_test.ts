import { assertEquals, assertRejects } from "@std/assert";
import { retry } from "../src/retry.ts";

const delays = [100, 200];

Deno.test("retry should succeed on first attempt", async () => {
    const delays: number[] = [];
    const fn = () => Promise.resolve("success");
    const result = await retry(fn, delays);
    assertEquals(result, "success");
});

Deno.test("retry should succeed on second attempt", async () => {
    let attempt = 1;
    const fn = () => {
        if (attempt === 1) {
            attempt++;
            return Promise.reject(new Error("first attempt failed"));
        }
        return Promise.resolve("success");
    };
    const result = await retry(fn, delays);
    assertEquals(result, "success");
});

Deno.test("retry should succeed on third attempt", async () => {
    let attempt = 1;
    const fn = () => {
        if (attempt < 3) {
            attempt++;
            return Promise.reject(new Error(`attempt ${attempt} failed`));
        }
        return Promise.resolve("success");
    };
    const result = await retry(fn, delays);
    assertEquals(result, "success");
});

Deno.test("retry should fail after all attempts", async () => {
    const fn = () => Promise.reject(new Error("always fails"));
    await assertRejects(() => retry(fn, delays));
});
