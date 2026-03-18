export async function requireAuth() {
  const res = await fetch("http://localhost:3000/api/auth/me", { credentials: "include" });
  if (!res.ok) {
    window.location.href = "/login";
  }
}

// call this on any page that should require authentication: 

// import { useEffect } from "react";
// import { requireAuth } from "./utils/auth";

// export default function Dashboard() {
//   useEffect(() => { requireAuth(); }, []);
//   // ... your protected UI ...
// }
