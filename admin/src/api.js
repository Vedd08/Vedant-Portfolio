// Central API base URL — strips trailing slash to prevent //api/ double-slash 404s
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');