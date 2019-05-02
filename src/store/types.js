/*================================= Getters ===============================================================================*/
// auth
export const GET_AUTH_TOKEN = 'GET_AUTH_TOKEN';
export const GET_AUTH_REFRESH_TOKEN = 'GET_AUTH_REFRESH_TOKEN';
export const GET_AUTH_OBJECT = 'GET_AUTH_OBJECT';
export const GET_AUTH_LOGIN_STATUS = 'GET_AUTH_LOGIN_STATUS';

// user
export const GET_ALL_USERS = 'user/GET_ALL_USERS';

/*================================= Mutations ===============================================================================*/
// miscellaneous
export const SET_SIDEBAR_COLLAPSE_STATUS = 'SET_SIDEBAR_COLLAPSE_STATUS';

// auth
export const SET_AUTH_OBJECT = 'SET_AUTH_OBJECT';
export const SET_AUTH_LOGIN_STATUS = 'SET_AUTH_LOGIN_STATUS';
export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
export const SET_AUTH_REFRESH_TOKEN = 'SET_AUTH_REFRESH_TOKEN';

// user
export const SET_ALL_USERS = 'user/SET_ALL_USERS';

/*================================= Actions ===============================================================================*/
// auth
export const INIT_LOGIN_AUTH_USER = 'INIT_LOGIN_AUTH_USER';
export const INIT_REGISTER_AUTH_USER = 'INIT_REGISTER_AUTH_USER';
export const INIT_ACTIVATE_AUTH_USER = 'INIT_ACTIVATE_AUTH_USER';
export const INIT_SEND_RESET_AUTH_PASSWORD_LINK = 'INIT_SEND_RESET_AUTH_PASSWORD_LINK';
export const INIT_RESET_AUTH_PASSWORD = 'INIT_RESET_AUTH_PASSWORD';
export const INIT_FETCH_AUTH_USER = 'INIT_FETCH_AUTH_USER';
export const INIT_UPDATE_AUTH_USER_PROFILE = 'INIT_UPDATE_AUTH_USER_PROFILE';
export const INIT_UPDATE_AUTH_USER_PASSWORD = 'INIT_UPDATE_AUTH_USER_PASSWORD';
export const INIT_LOGOUT_AUTH_USER = 'INIT_LOGOUT_AUTH_USER';

// user
export const INIT_FETCH_ALL_USERS = 'user/INIT_FETCH_ALL_USERS';
export const INIT_FETCH_PAGINATED_USERS = 'user/INIT_FETCH_PAGINATED_USERS';
export const INIT_FETCH_ALL_USER_ROLES = 'user/INIT_FETCH_ALL_USER_ROLES';
export const INIT_STORE_USER = 'user/INIT_STORE_USER';
export const INIT_UPDATE_USER = 'user/INIT_UPDATE_USER';
export const INIT_UPDATE_USER_ROLE = 'user/INIT_UPDATE_USER_ROLE';
export const INIT_UPDATE_USER_ACTIVE_STATUS = 'user/INIT_UPDATE_USER_ACTIVE_STATUS';
export const INIT_DELETE_USER = 'user/INIT_DELETE_USER';