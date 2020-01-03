import apiQuestions from '../api/apiQuestions';
import router from '../../router';

export default {
    namespaced: true,
    state: {
        templateName: {
            value: ''
        },
        tagAliases: [],
        levelAliases: [],
        lang: 'all',
        status: 'all',
        tags: '',
        levels: '',
        paging: {
            offset: 0,
            limit: 10,
            orderByType: 'date',
            descending: 'desc'
        }
    },
    mutations: {
        saveAliases(state, tags) {
            let tagAlias = [];
            for (let i = 0; i < tags.value.length; i++) {
                tagAlias.push(tags.value[i].alias);
            }
            state[tags.name] = tagAlias;
        },
        updateLimitFromLocalStorage(state, localStorageRowsPerPage) {
            state.paging.limit = localStorageRowsPerPage;
        },
        setLang(state, value) {
            state.lang = value;
        },
        setStatus(state, value) {
            state.status = value;
        },
        setPaging(state, pagination) {
            state.paging.limit = pagination.rowsPerPage;
            state.paging.orderByType = pagination.sortBy;
            state.paging.offset = (pagination.page - 1) * state.paging.limit;
            if (pagination.descending === true) {
                state.paging.descending = 'desc';
            }
            if (pagination.descending === false) {
                state.paging.descending = 'asc';
            }
        }
    },
    actions: {
        saveAliases({commit, dispatch}, tags) {
            commit('saveAliases', tags);
            dispatch('updateQueryParams');
        },
        getQuestions({commit, getters, dispatch}) {
            let query = getters.getUrl;

            return apiQuestions.getQuesions(query).then(response => {
                return {questions: response.data, totalCount: response.headers['x-total-count']};
            }).catch(error => {
                dispatch('error/setError', error.response.status, {root: true});
                return {questions: [], totalCount: 0};
            });
        },
        updateLimitFromLocalStorage({commit}, localStorageRowsPerPage) {
            commit('updateLimitFromLocalStorage', localStorageRowsPerPage);
        },
        setLang({commit, dispatch}, value) {
            commit('setLang', value);
            dispatch('updateQueryParams');
        },
        setStatus({commit, dispatch, state}, value) {
            commit('setStatus', value);
            dispatch('updateQueryParams');
        },
        setPaging({commit, dispatch}, pagination) {
            commit('setPaging', pagination);
            dispatch('updateQueryParams');
        },
        setEmptyTagAliases({commit}) {
            commit('setEmptyTagAliases');
        },
        saveTemplate({commit, state}, templateName) {
            state.templateName.value = templateName;
        },
        updateQueryParams({getters}) {
            router.push({path: router.currentRoute.path, query: getters.getQuery});
        }
    },
    getters: {
        getQuery(state) {
            let query = {
                lang: state.lang,
                status: state.status,
                limit: state.paging.limit,
                offset: state.paging.offset,
                orderby: `${state.paging.orderByType}:${state.paging.descending}`
            };

            if (state.tagAliases.length !== 0) {
                query['tags'] = state.tagAliases.toString();
            }

            if (state.levelAliases.length !== 0) {
                query['levels'] = state.levelAliases.toString();
            }

            return query;
        },
        getUrl(state) {
            let baseQuery = `?offset=${state.paging.offset}&limit=${state.paging.limit}&orderby=${state.paging.orderByType}:${state.paging.descending}`;
            let query = baseQuery;

            if (state.tagAliases.length !== 0) {
                state.tags = state.tagAliases.join(',');
                query = query + `&tags=${state.tags}`;
            }
            if (state.levelAliases.length !== 0) {
                state.levels = state.levelAliases.join(',');
                query = query + `&levels=${state.levels}`;
            }
            if (state.lang !== 'all') {
                query = query + `&lang=${state.lang}`;
            }
            if (state.status !== 'all') {
                query = query + `&status=${state.status}`;
            }
            return query;
        }
    }
};
