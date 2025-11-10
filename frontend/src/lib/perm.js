export function can(user, module, action) {
  return !!(user?.role?.permissions?.modules?.[module]?.[action]);
}

export function hasSystem(user, perm) {
  const sys = user?.role?.permissions?.system || [];
  return Array.isArray(sys) && sys.includes(perm);
}

