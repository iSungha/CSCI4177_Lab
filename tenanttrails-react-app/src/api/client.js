const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function apiFetch(path, options = {}) {
  const bodyIsFormData = options.body instanceof FormData;

  const response = await fetch(`${API}${path}`, {
    credentials: "include",
    ...options,
    headers: bodyIsFormData
      ? {
          ...(options.headers || {}),
        }
      : {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null
        ? data.error || data.message || "Request failed"
        : data || "Request failed";

    throw new Error(message);
  }

  return data;
}

export function optimizedImage(url, width = 900) {
  if (!url) {
    return "https://placehold.co/900x500?text=TenantTrails";
  }

  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  }

  return url;
}