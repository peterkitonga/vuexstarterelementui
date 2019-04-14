import {
    GET_AUTH_LOGIN_STATUS,
    GET_AUTH_OBJECT,
    GET_AUTH_TOKEN,
    GET_AUTH_REFRESH_TOKEN
} from './types'

export default {
    [GET_AUTH_LOGIN_STATUS]: state => {
        return state.is_logged_in
    },
    [GET_AUTH_OBJECT]: state => {
        return state.auth_object;
    },
    [GET_AUTH_TOKEN]: state => {
        return state.auth_token
    },
    [GET_AUTH_REFRESH_TOKEN]: state => {
        return state.auth_refresh_token
    }
}