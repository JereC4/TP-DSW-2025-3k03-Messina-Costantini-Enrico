export async function getHealth() {
  const res = await fetch("http://localhost:3001/api/health");
  if (!res.ok) throw new Error("API error");
  return res.json();
}
