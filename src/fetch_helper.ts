/**
 * Checks if the given HTTP status code indicates a server error.
 *
 * @param {number} status - The HTTP status code to check.
 * @returns {boolean} - Returns true if the status code is between 500 and 599, inclusive; otherwise, false.
 */
export function isServerErrorStatus(status: number): boolean {
	return status >= 500 && status < 600;
}

/**
 * Checks if the given HTTP status code indicates a successful response.
 *
 * @param {number} status - The HTTP status code to check.
 * @returns {boolean} - Returns true if the status code is between 200 and 299, inclusive; otherwise, false.
 */
export function isSuccessfulStatus(status: number): boolean {
	return status >= 200 && status < 300;
}

/**
 * Attempts to parse a fetch response as JSON. If that fails, parses it as text.
 * Ensures the result is always a JSON object.
 *
 * @param {Response} response - The fetch response to parse.
 * @returns {Promise<unknown>} The parsed response data.
 */
export const parseResponseToJson = async (
	response: Response,
): Promise<unknown> => {
	const text = await response.text();
	try {
		return JSON.parse(text);
	} catch {
		return { text: text || '' };
	}
};
