import {
    GET_ALL_USERS,
    GET_AUTH_TOKEN,
    INIT_FETCH_ALL_USERS,
    INIT_FETCH_PAGINATED_USERS, INIT_UPDATE_USER, SET_ALL_USERS
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
    }
};

export default {
    state,
    getters,
    mutations,
    actions
}