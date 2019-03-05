import apiTags from '../api/apiTags';

export default {
    namespaced: true,
    actions: {
        async getMatchTags({commit}, query) {
            let tags = await apiTags.getTagsByQuery(query);
            return tags.data;
        },
        createTag({commit}, tag) {
            return apiTags.createTag(tag);
        },
        getTagsByAliases({commit}, aliases) {
            return apiTags.getTagsByAliases(aliases);
        }
    }
};
