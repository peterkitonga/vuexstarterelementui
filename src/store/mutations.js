import {
    SET_AUTH_LOGIN_STATUS,
    SET_AUTH_OBJECT,
    SET_AUTH_TOKEN,
    SET_AUTH_REFRESH_TOKEN
} from './types'

export default {
    [SET_AUTH_LOGIN_STATUS]: (state, payload) => {
        state.is_logged_in = payload.data.is_logged_in
    },
    [SET_AUTH_OBJECT]: (state, payload) => {
        state.auth_object = payload.data
    },
    [SET_AUTH_TOKEN]: (state, payload) => {
        state.auth_token = payload.data.token_type+' '+payload.data.access_token
    },
    [SET_AUTH_REFRESH_TOKEN]: (state, payload) => {
        state.auth_refresh_token = payload.data.refresh_token
    }
}
