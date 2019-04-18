import Vue from 'vue'
import Vuex from 'vuex'

// Auth mutations
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

// Modules
import user from './modules/user'

// Plugins
import * as cookies from 'js-cookie'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        auth_token: '',
        auth_object: {},
        is_logged_in: false,
        auth_refresh_token: '',
        sidebar_collapse: false,
    },
    actions,
    getters,
    mutations,
    modules: {
        user
    },
    plugins: [
        createPersistedState({
            key: 'vuex-starter-'+process.env.NODE_ENV,
            paths: [
                'auth_token',
                'auth_object',
                'is_logged_in',
                'auth_refresh_token',
                'sidebar_collapse',
            ],
            storage: {
                getItem: (key) => {
                    // Retrieve the cookie
                    return cookies.get(key)
                },
                setItem: (key, value) => {
                    // Remove the cookie before setting it
                    cookies.remove(key);

                    // Set the cookie with new values
                    return  cookies.set(key, value, {expires: 30})
                },
                removeItem: (key) => {
                    // Remove the cookie
                    return cookies.remove(key)
                }
            }
        })
    ]
});
