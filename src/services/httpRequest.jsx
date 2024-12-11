/**
 * Performs Http Request
 * @param {string} url
 * @param {string} method
 * @param {number} currentPage
 * @param {number} limit
 * @returns
 */
export default async function httpRequest(url, method, body = null) {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
