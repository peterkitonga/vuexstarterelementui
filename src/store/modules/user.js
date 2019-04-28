import {
    GET_AUTH_TOKEN, GET_ALL_USERS,
    SET_ALL_USERS, INIT_FETCH_ALL_USERS, INIT_FETCH_PAGINATED_USERS,
    INIT_STORE_USER, INIT_UPDATE_USER, INIT_UPDATE_USER_ROLE, INIT_UPDATE_USER_ACTIVE_STATUS, INIT_DELETE_USER
} from '../types'
import HTTP from '../../http'

const state = {
    all_users: []
};

const getters = {
    [GET_ALL_USERS]: state => {
        return state.all_users;
    }
};

const mutations = {
    [SET_ALL_USERS]: (state, payload) => {
        state.all_users = payload.data;
    },
};

const actions = {
    [INIT_FETCH_ALL_USERS]: ({getters, commit}, payload) => {
        return new Promise((resolve, reject) => {
            HTTP.get('users', {
                headers: {
                    Authorization: getters[GET_AUTH_TOKEN]
                },
                params: {
                    page: payload.page,
                    limit: payload.limit
                }
            }).then(response => {
                commit(SET_ALL_USERS, response.data);
                resolve(response.data);
            }).catch(error => {
                reject(error.response);
            });
        });
    },
    [INIT_FETCH_PAGINATED_USERS]: ({getters, commit}, payload) => {
        return new Promise((resolve, reject) => {
            HTTP.get('users', {
                headers: {
                    Authorization: getters[GET_AUTH_TOKEN]
                },
                params: {
                    page: payload.page,
                    limit: payload.limit
                }
            }).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error.response);
            });
        });
    },
    [INIT_STORE_USER]: function ({getters, commit}, payload) {
        return new Promise((resolve, reject) => {
            HTTP.post('users/store', payload, {
                headers: {
                    Authorization: getters[GET_AUTH_TOKEN]
                }
            }).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error.response);
            });
        })
    },
    [INIT_UPDATE_USER]: function ({getters, commit}, payload) {
        return new Promise((resolve, reject) => {
            HTTP.put(`users/update/${payload.user_id}`, payload, {
                headers: {
                    Authorization: getters[GET_AUTH_TOKEN]
                }
            }).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error.response);
            });
        })
    },
    [INIT_UPDATE_USER_ROLE]: function ({getters, commit}, payload) {
        return new Promise((resolve, reject) => {
            HTTP.put(`users/role/update/${payload.user_id}`, payload, {
                headers: {
                    Authorization: getters[GET_AUTH_TOKEN]
                }
            }).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error.response);
            });
        })
    },
    [INIT_UPDATE_USER_ACTIVE_STATUS]: function ({getters, commit}, payload) {
        return new Promise((resolve, reject) => {
            HTTP.get(`users/${payload.action}/${payload.user_id}`, {
                headers: {
                    Authorization: getters[GET_AUTH_TOKEN]
                }
            }).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error.response);
            });
        })
    },
    [INIT_DELETE_USER]: function ({getters, commit}, id) {
        return new Promise((resolve, reject) => {
            HTTP.delete(`users/delete/${id}`, {
                headers: {
                    Authorization: getters[GET_AUTH_TOKEN]
                }
            }).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error.response);
            });
        })
    }
};

export default {
    state,
    getters,
    mutations,
    actions
}