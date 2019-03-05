import axios from 'axios';

let url = '/api/v1/tags';
export default {
    getTagsByQuery: (query) => axios.get(`${url}?search=${query}&limit=6`),
    getTagsByAliases: (aliases) => axios.get(`${url}?aliases=${aliases}`),
    createTag: (tag) => axios.post(url, tag)
};
