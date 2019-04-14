import HTTP from "../http"
import {router} from '../router'
import {
    GET_AUTH_TOKEN,
    SET_AUTH_TOKEN,
    SET_AUTH_REFRESH_TOKEN,
    SET_AUTH_OBJECT,
    SET_AUTH_LOGIN_STATUS,
    INIT_LOGIN_AUTH_USER,
    INIT_FETCH_AUTH_USER,
    INIT_REGISTER_AUTH_USER,
    INIT_ACTIVATE_AUTH_USER,
    INIT_SEND_RESET_AUTH_PASSWORD_LINK,
    INIT_RESET_AUTH_PASSWORD,
    INIT_UPDATE_AUTH_USER_PROFILE,
    INIT_UPDATE_AUTH_USER_PASSWORD,
    INIT_LOGOUT_AUTH_USER
} from './types'

export default {
    [INIT_REGISTER_AUTH_USER]: ({dispatch, commit}, payload) => {
        return new Promise((resolve, reject) => {
            HTTP.post('auth/register', payload).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error.response)
            })
        })
    },
    [INIT_ACTIVATE_AUTH_USER]: ({getters, commit}, code) => {
        return new Promise((resolve, reject) => {
            HTTP.get(`auth/activate/${code}`).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error.response)
            })
        })
    },
    [INIT_LOGIN_AUTH_USER]: ({dispatch, commit}, payload) => {
        return new Promise((resolve, reject) => {
            HTTP.post('auth/login', payload).then(response => {
                commit(SET_AUTH_TOKEN, response.data);
                commit(SET_AUTH_REFRESH_TOKEN, response.data);
                // Fetch the logged in user
                dispatch(INIT_FETCH_AUTH_USER).then(authResponse => {
                    commit(SET_AUTH_LOGIN_STATUS, authResponse);

                    // Redirect to dashboard
                    router.push('/home')
                });
                resolve(response.data)
            }).catch(error => {
                reject(error.response)
            })
        })
    },
    [INIT_SEND_RESET_AUTH_PASSWORD_LINK]: ({dispatch, commit}, payload) => {
        return new Promise((resolve, reject) => {
            HTTP.post('auth/email/reset/password/link', payload).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error.response)
            })
        })
    },
    [INIT_RESET_AUTH_PASSWORD]: ({dispatch, commit}, payload) => {
        return new Promise((resolve, reject) => {
            HTTP.post('auth/reset/password', payload).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error.response)
            })
        })
    },
    [INIT_FETCH_AUTH_USER]: ({getters, commit}) => {
        return new Promise((resolve, reject) => {
            HTTP.get('auth/user', {
                headers: {
                    'Authorization': getters[GET_AUTH_TOKEN]
                }
            }).then(response => {
                commit(SET_AUTH_OBJECT, response.data);
                resolve(response.data)
            }).catch(error => {
                reject(error.response)
            })
        })
    },
    [INIT_UPDATE_AUTH_USER_PROFILE]: ({getters, commit}, payload) => {
        return new Promise((resolve, reject) => {
            HTTP.put('auth/user/update',
                {
                    name: payload.name,
                    email: payload.email,
                    image_select: payload.image_select,
                },
                {
                    headers: {
                        'Authorization': getters[GET_AUTH_TOKEN]
                    }
                }
            ).then(response => {
                commit(SET_AUTH_OBJECT, response.data);
                resolve(response.data)
            }).catch(error => {
                reject(error.response)
            })
        })
    },
    [INIT_UPDATE_AUTH_USER_PASSWORD]: ({getters, commit}, payload) => {
        return new Promise((resolve, reject) => {
            HTTP.put('auth/user/password/update',
                {
                    current_password: payload.current_password,
                    password: payload.password,
                    password_confirmation: payload.password_confirmation
                },
                {
                    headers: {
                        'Authorization': getters[GET_AUTH_TOKEN]
                    }
                }
            ).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error.response)
            })
        })
    },
    [INIT_LOGOUT_AUTH_USER]: ({getters, commit}) => {
        return new Promise((resolve, reject) => {
            HTTP.get('auth/logout', {
                headers: {
                    'Authorization': getters[GET_AUTH_TOKEN]
                }
            }).then(response => {
                commit(SET_AUTH_LOGIN_STATUS, {data: {is_logged_in: false}});
                commit(SET_AUTH_REFRESH_TOKEN, {data: {refresh_token: ''}});
                commit(SET_AUTH_TOKEN, {data: {token_type: '', access_token: ''}});
                if (router.currentRoute.name !== 'login') {
                    router.push('/')
                }
                resolve(response.data)
            }).catch(error => {
                reject(error.response)
            })
        })
    }
}
