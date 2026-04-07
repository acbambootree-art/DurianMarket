export function isAuthorized(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD;
}
