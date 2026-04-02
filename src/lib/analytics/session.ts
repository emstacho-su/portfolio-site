const SESSION_KEY = 'portfolio_session_id';

function generateId(): string {
  return crypto.randomUUID();
}

export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return generateId();
  }

  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) {
    return existing;
  }

  const id = generateId();
  sessionStorage.setItem(SESSION_KEY, id);
  return id;
}
