import axios from 'axios';

let url = '/api/v1/trainsessions';

export default {
    setTrainSession: (value) => axios.post(`${url}`, value),
    getTrainSessionById: (id) => axios.get(`${url}/${id}`),
    getTrainSessionQuestion: (id, number) => axios.get(`${url}/${id}/questions?number=${number}`),
    createAnswers: (sessionId, value) => axios.post(`${url}/${sessionId}/answers`, value),
    completeTrainSession: (sessionId) => axios.delete(`${url}/${sessionId}`),
    getTrainSessionResult: (sessionId) => axios.get(`${url}/${sessionId}/resume`)
};
