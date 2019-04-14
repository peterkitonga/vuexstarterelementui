import {
    GET_AUTH_TOKEN,
    SET_AUTH_TOKEN,
    GET_AUTH_REFRESH_TOKEN,
    SET_AUTH_REFRESH_TOKEN
} from './store/types'
import axios from 'axios'
import {store} from './store'

const baseURL = process.env.VUE_APP_API_URI;

const headers = {
    'Content-Type': 'application/json'
};

const http = axios.create({
    baseURL,
    headers
});

http.interceptors.response.use(function (response) {
    return response
}, function (error) {
    const request = error.config;

    if ((error.response && error.response.status === 401) && !request._retry && this.$route.name !== 'login')
    {
        request._retry = true;

        return Http.post('auth/refresh',
            {
                'refresh': store.getters[GET_AUTH_REFRESH_TOKEN]
            },
            {
                headers: {
                    'Authorization': store.getters[GET_AUTH_TOKEN]
                }
            })
            .then(response => {
                let payload = response.data;

                store.commit(SET_AUTH_TOKEN, payload);
                store.commit(SET_AUTH_REFRESH_TOKEN, payload);

                request.headers['Authorization'] = payload.data.token_type+' '+payload.data.access_token;

                return axios(request)
            })
            .catch(error => {
                return Promise.reject(error.response)
            })
    }

    if (error.response && error.response.status === 403)
    {
        return Promise.reject(error.response)
    }

    return Promise.reject(error)
});

class Http extends http {}

export default Http