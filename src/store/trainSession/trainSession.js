import apiTrainSession from '../api/apiTrainSession';

export default {
    namespaced: true,
    state: {
        id: '',
        number: 0,
        questionsCount: '',
        answerIds: [],
        questionId: ''
    },
    mutations: {
        setValueFromQueryParams(state, queryParams) {
            state.id = queryParams.id;
            state.number = queryParams.number;
        },
        createTrainSession(state, trainSessionValue) {
            state.id = trainSessionValue.id;
            state.questionsCount = trainSessionValue.questionsCount;
        },
        getTrainSessionById(state, trainSessionValue) {
            state.questionsCount = trainSessionValue.questionsCount;
            state.id = trainSessionValue.id;
        },
        setDefaultNumber(state) {
            state.number = 0;
        }
    },
    actions: {
        setValueFromQueryParams({commit}, queryParams) {
            commit('setValueFromQueryParams', queryParams);
        },
        createAnswers({commit, state}, answersValue) {
            return apiTrainSession.createAnswers(state.id, answersValue);
        },
        createTrainSession({commit, dispatch}, trainSessionValue) {
            commit('setDefaultNumber');
            return apiTrainSession.setTrainSession(trainSessionValue).then(response => {
                commit('createTrainSession', response.data);
                return response.data;
            }).catch(error => {
                dispatch('error/setError', error.response.status, {root: true});
            });
        },
        async getPrevQuestion({state, dispatch}) {
            state.number -= 1;
            return dispatch('getQuestion');
        },
        async getNextQuestion({state, dispatch}) {
            state.number += 1;
            return dispatch('getQuestion');
        },
        async getQuestion({commit, state}) {
            let question = await apiTrainSession.getTrainSessionQuestion(state.id, state.number);
            return question.data;
        },
        getTrainSessionById({commit, dispatch}, sessionId) {
            return apiTrainSession.getTrainSessionById(sessionId).then(response => {
                commit('getTrainSessionById', response.data);
            }).catch(error => {
                dispatch('error/setError', error.response.status, {root: true});
            });
        },
        async getTrainSessionResult({state}, id) {
            let result = await apiTrainSession.getTrainSessionResult(id);
            return result.data;
        },
        async completeTrainSession({state}) {
            let result = await apiTrainSession.completeTrainSession(state.id);
            return result.data;
        }
    }
};
