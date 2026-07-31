export async function submitWaitlist(payload, options = {}) {
  const fetchImpl = options.fetchImpl ?? fetch;
  const configuredBaseUrl = options.baseUrl
    ?? import.meta.env?.VITE_ROCKY_WALLET_API_BASE_URL
    ?? 'https://api-extension.rocky.exchange/v1';
  const baseUrl = String(configuredBaseUrl).replace(/\/+$/, '');
  const response = await fetchImpl(`${baseUrl}/waitlist`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let result = {};
  try {
    result = await response.json();
  } catch {
    // The status code still provides a reliable failure signal for non-JSON responses.
  }

  if (!response.ok) {
    throw new Error(result.error || 'Unable to join the waitlist. Please try again.');
  }
  return result;
}
