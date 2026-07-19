export function resolveSessionRole(sessionRole, userRole) {
  return userRole ?? sessionRole;
}
