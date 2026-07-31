const ROUTE_BY_PATH = Object.freeze({
  '/': 'landing', '/developers': 'developers', '/join': 'join', '/privacy': 'privacy', '/terms': 'terms',
});

export function normalizePathname(pathname = '/') {
  return String(pathname).replace(/\/+$/, '') || '/';
}

export function resolveSiteRoute(pathname) {
  return ROUTE_BY_PATH[normalizePathname(pathname)] || 'landing';
}
