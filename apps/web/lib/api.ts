const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type FetchOptions = RequestInit & {
  next?: { revalidate?: number };
};

export async function gatewayFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(payload));
  }

  return payload as T;
}

export async function createContactRequest(input: {
  fullName: string;
  organization: string;
  email: string;
  requestType: string;
  message: string;
}) {
  return gatewayFetch("/api/contact-requests", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getOfficeDashboard() {
  return gatewayFetch("/api/office/dashboard", { cache: "no-store" });
}

export async function getOfficeMessages() {
  return gatewayFetch("/api/office/messages", { cache: "no-store" });
}

export async function getSeoPages() {
  return gatewayFetch("/api/seo-pages", { next: { revalidate: 300 } });
}
