import Vue from 'vue';
import App from './App';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import router from './router';
import store from './store/index';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueMarkdown from 'vue-markdown';
import FileUpload from 'v-file-upload';
import {BASE_URL} from './store/routes';

Vue.use(VueAxios, axios);
Vue.use(FileUpload);
Vue.use(VueMarkdown);
Vue.use(Vuetify);

axios.defaults.baseURL = `${BASE_URL}`;
axios.defaults.headers.common = {
    'Access-Control-Allow-Origin': '*',
    'Accept': 'application/json'
};
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
});
