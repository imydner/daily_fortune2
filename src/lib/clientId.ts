// Anonymous per-browser identifier so we can show "내 기록" (my history)
// without needing a login. Stored in localStorage, generated once.
const STORAGE_KEY = "fortune_client_id";

export function getClientId(): string {
  if (typeof window === "undefined") return "";

  let id = window.localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
