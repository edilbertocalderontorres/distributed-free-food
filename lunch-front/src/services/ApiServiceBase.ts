const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-clientid": "webapp",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Error en ${endpoint}: ${response.statusText}`);
  }
  return response.json();
}
