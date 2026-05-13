const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export async function backendRequest<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('Backend is not configured. Set EXPO_PUBLIC_API_BASE_URL when the API is ready.');
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}
