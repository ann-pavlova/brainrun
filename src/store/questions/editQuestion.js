import apiQuestions from '../api/apiQuestions';

export default {
    namespaced: true,
    state: {
        question: {
            id: null,
            value: '',
            valueType: 'markdown',
            level: 100,
            language: 'ru',
            answers: [],
            tags: []
        },
        selectedTags: []
    },
    mutations: {
        setValue(state, valueData) {
            state.question[valueData.param] = valueData.data;
        },
        setSelectedTags(state, valueData) {
            state[valueData.param] = valueData.data;
        },
        setAnswers(state, answers) {
            state.question.answers = answers;
        },
        removeAnswer(state, answerId) {
            let answers = state.question.answers;
            for (let i = 0; i < answers.length; i++) {
                if (answers[i].id === answerId) {
                    answers.splice(i, 1);
                }
            }
        },
        addAnswer(state) {
            const newAnswer = {
                isCorrect: false,
                value: '',
                id: '' + state.question.answers.length + 1,
                orderNumber: state.question.answers.length + 1
            };
            state.question.answers.push(newAnswer);
        },
        resetAnswers(state) {
            state.question.answers = [];
        },
        setQuestionToState(state, question) {
            for (let key in question) {
                if (!state.question.hasOwnProperty(key)) continue;
                state.question[key] = question[key];
            }

            state.selectedTags = [];
            if (question.tags !== undefined) {
                for (let i = 0; i < question.tags.length; i++) {
                    let tag = {};
                    tag.text = question.tags[i].name;
                    tag.alias = question.tags[i].alias;
                    tag.createDate = question.tags[i].createDate;
                    state.selectedTags.push(tag);
                }
            }
        },
        resetQuestionInState(state) {
            state.question.id = null;
            state.question.value = '';
            state.question.valueType = 'markdown';
            state.question.level = 100;
            state.question.language = 'ru';
            state.question.answers = [];
            state.question.tags = [];
            state.selectedTags = [];
        },
        transformSelectedTagsToTags(state) {
            state.question.tags = [];
            for (let i = 0; i < state.selectedTags.length; i++) {
                state.question.tags.push(state.selectedTags[i].alias);
            }
        }
    },
    actions: {
        setValue({commit}, valueData) {
            commit('setValue', valueData);
        },
        setSelectedTags({commit}, valueData) {
            commit('setSelectedTags', valueData);
        },
        setAnswers({commit}, answers) {
            commit('setAnswers', answers);
        },
        removeAnswer({commit}, answerId) {
            commit('removeAnswer', answerId);
        },
        addAnswer({commit}) {
            commit('addAnswer');
        },
        resetAnswers({commit}) {
            commit('resetAnswers');
        },
        async setQuestionToState({commit}, questionId) {
            commit('resetQuestionInState');
            if (questionId !== undefined) {
                let question = await apiQuestions.getQuestion(questionId);
                commit('setQuestionToState', question.data);
            }
        },
        async saveQuestion({commit, state, dispatch}) {
            await commit('transformSelectedTagsToTags');
            if (state.question.id !== null) {
                return apiQuestions.editQuestion(state.question.id, state.question).then(response => {
                    commit('resetQuestionInState');
                    return response.status === 200 || response.status === 201;
                }).catch(error => {
                    dispatch('error/setError', error.response.status, {root: true});
                });
            } else {
                return apiQuestions.addQuestion(state.question).then(response => {
                    return response.status;
                }).catch(error => {
                    dispatch('error/setError', error.response.status, {root: true});
                });
            }
        },
        onClickDeleteQuestion({commit}, questionId) {
            return apiQuestions.deleteQuestion(questionId);
        }
    },
    getters: {
        isAllAnswersCorrect(state) {
            for (let i = 0; i < state.question.answers.length; i++) {
                if (state.question.answers[i].value.length === 0) {
                    return false;
                }
            }
            return true;
        }
    }
};
