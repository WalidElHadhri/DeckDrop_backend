export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export const TOKEN_KEY = 'deckdrop_token'
export const EMAIL_KEY = 'deckdrop_email'
export const ROLE_KEY = 'deckdrop_role'
export const LASTNAME_KEY = 'deckdrop_lastname'

export function getStoredAuth() {
  return {
    token: localStorage.getItem(TOKEN_KEY) ?? '',
    email: localStorage.getItem(EMAIL_KEY) ?? '',
    role: localStorage.getItem(ROLE_KEY) ?? '',
    lastName: localStorage.getItem(LASTNAME_KEY) ?? '',
  }
}

export function persistAuth(nextAuth) {
  localStorage.setItem(TOKEN_KEY, nextAuth.token)
  localStorage.setItem(EMAIL_KEY, nextAuth.email)
  localStorage.setItem(ROLE_KEY, nextAuth.role)
  localStorage.setItem(LASTNAME_KEY, nextAuth.lastName || '')
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EMAIL_KEY)
  localStorage.removeItem(ROLE_KEY)
  localStorage.removeItem(LASTNAME_KEY)
}

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await response.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { message: text }
    }
  }

  if (!response.ok) {
    const message = data?.message ?? `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return data
}
