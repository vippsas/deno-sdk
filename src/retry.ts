/**
 * Custom error class for retry failures.
 */
export class RetryError extends Error {
    constructor(message: string, public readonly attempts: number) {
        super(message);
        this.name = "RetryError";
    }
}

/**
 * Retries a given asynchronous function based on specified delays.
 *
 * @template T - The type of the successful response.
 * @param {() => Promise<T>} fn - The function to retry.
 * @param {number[]} delays - An array of delays (in milliseconds) between retries.
 * @returns {Promise<T>} A promise that resolves to the result of the function.
 * @throws {RetryError} If all retry attempts fail.
 */
export async function retry<T>(
    fn: () => Promise<T>,
    delays: number[],
): Promise<T> {
    let attempt = 0;
    while (true) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === delays.length) {
                throw new RetryError(`${error}`, attempt + 1);
            }
            await new Promise((r) => setTimeout(r, delays[attempt]));
            attempt++;
        }
    }
}
