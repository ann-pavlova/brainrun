import {TAGS} from '../store/routes';
import dataLevels from '../data/levels';

export default {
    data() {
        return {
            debounce: null
        };
    },
    methods: {
        // async onArrowDownLoadTags(value) {
        //     if (value !== '') {
        //         return;
        //     }
        //
        //     this.updateTagsByQuery(value);
        // },
        onArrowDownLoadLevels(value) {
            if (value !== '') {
                return;
            }

            this.autocompleteLevels = dataLevels;
        },
        async updateTagsByQuery(inputValue) {
            if (inputValue === undefined) {
                inputValue = '';
            }

            let autocompleteTags = await this.$store.dispatch(`${TAGS}/getMatchTags`, inputValue);
            this.autocompleteTags = this.convertTagsForInput(autocompleteTags);
        },
        convertTagsForInput(tags) {
            let updatedTagsArray = [];
            for (let i = 0; i < tags.length; i++) {
                let updatedTagObject = {
                    'alias': tags[i].alias,
                    'text': tags[i].name
                };
                updatedTagsArray.push(updatedTagObject);
            }
            return updatedTagsArray;
        },
        async addNewTag(tagObject) {
            if (!('alias' in tagObject)) {
                let tag = {name: tagObject.text};
                let newTag = await this.$store.dispatch(`${TAGS}/createTag`, tag);
                tagObject.alias = newTag.data.alias;
            }

            return tagObject;
        },
        onInputWithDelayLevel(value) {
            this.autocompleteLevels = dataLevels.filter(i => {
                return i.text.indexOf(value) !== -1;
            });
        },
        onInputWithDelayTags(value) {
            if (value.length === 0 || value === ' ') {
                return;
            }

            clearTimeout(this.debounce);
            let that = this;
            this.debounce = setTimeout(async() => {
                that.updateTagsByQuery(value);
            }, 600);
        }
    }
};
