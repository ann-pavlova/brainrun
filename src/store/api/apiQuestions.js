import axios from 'axios';

let url = '/api/v1/questions';

export default {
    getQuesions: (query) => axios.get(`${url}${query}`),
    deleteQuestion: (id) => axios.delete(`${url}/${id}`),
    addQuestion: (question) => axios.post(url, question),
    editQuestion: (id, question) => axios.put(`${url}/${id}`, question),
    getQuestion: (id) => axios.get(`${url}/${id}`),
    getQuestionForVerify: () => axios.get(`${url}/forvalidation`),
    getQuestionForVerifyById: (id) => axios.get(`${url}/forvalidation/${id}`),
    setQuestionVerify: (id, data) => axios.patch(`${url}/${id}`, data)
};
