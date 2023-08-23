export const ROLES = {
    KEELA_ADMIN: "KEELA_ADMIN",
    ORGANIZATION_ADMIN: "ORGANIZATION_ADMIN",
    COORDINATOR: "COORDINATOR"
}

export const ROLE_BASED_PAGE = {
    [ROLES.KEELA_ADMIN]: "/keela-admin",
    [ROLES.ORGANIZATION_ADMIN]: "/org-admin",
    [ROLES.COORDINATOR]: "/coordinator"
}