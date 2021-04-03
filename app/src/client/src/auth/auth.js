export const authenticate = (user, permissions) => {
    sessionStorage.setItem("user", user)
    sessionStorage.setItem("user_permissions", JSON.stringify(permissions))
}

export const deauthenticate = () => {
    sessionStorage.removeItem("user")
    sessionStorage.removeItem("user_permissions")
}

export const isAuthenticated = () => {
    return sessionStorage.getItem("user") != null
}

export const isAllowed = (permission) => {
    if( !isAuthenticated() ) { return false }

    const permissions = JSON.parse(sessionStorage.getItem("user_permissions") || '[]')
    return permissions.includes(permission)
}

export const PERMISSIONS = {
    CAN_EDIT_BATCHED: 'can_edit_batches'
}