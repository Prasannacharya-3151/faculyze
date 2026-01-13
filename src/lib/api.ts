// export const API_BASE = "https://unfearingly-heterozygous-brittny.ngrok-free.dev"
export const API_BASE = "https://sv0gotfhtb.execute-api.ap-south-1.amazonaws.com/Prod"
export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body: any = null,
  token: string | null = null
) {

  const headers: any = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(API_BASE + endpoint, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  // 🔥 If backend sends 204 No Content
if (res.status === 204 || res.headers.get("content-length") === "0") {
  return { success: true };
}

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong");

  return data;
}
