<template>
    <div>
        <TagsInput
            v-model.trim="tag"
            :tags="selectedTags"
            :autocomplete-items="exTags"
            :add-only-from-autocomplete="addOnlyFromAutocomplete"
            :placeholder="placeholder"
            :allow-edit-tags="true"
            :autocomplete-always-open="isAutocompleteShow"
            @before-adding-tag="beforeAddingTag"
            @before-deleting-tag="beforeDeletingTag"
            @tags-changed="TagsChangeed"
            @input="onInputWithDelayTags"
            @keyup.native.down="onArrowDown"
        />
    </div>
</template>

<script>
    import VueTagsInput from '@johmun/vue-tags-input';

    export default {
        props: {
            addNewTag: {
                type: Function
            },
            addOnlyFromAutocomplete: {
                default: false
            },
            exTags: {
                type: Array
            },
            placeholder: {
                type: String
            },
            selectedTags: {
                type: Array
            }
        },
        data() {
            return {
                tag: '',
                isAutocompleteShow: false
            };
        },
        methods: {
            async beforeAddingTag(obj) {
                obj.tag = await this.addNewTag(obj.tag);
                obj.addTag();
            },
            TagsChangeed($event) {
                this.$emit('update:selectedTags', $event);
                this.isAutocompleteShow = false;
            },
            beforeDeletingTag(obj) {
                this.$emit('beforeDeletingTag', obj.tag);
                obj.deleteTag();
            },
            onInputWithDelayTags() {
                this.$emit('onInputWithDelayTags', this.tag);
            },
            onArrowDown() {
                this.isAutocompleteShow = true;
            }
        },
        components: {
            TagsInput: VueTagsInput
        }
    };
</script>

<style lang="scss">
    .b-tags__input {
        border: 2px solid rgba(0, 0, 0, .54);
        padding: 12px 12px 7px 12px;
        border-radius: 4px;

        .tags-input-badge {
            background-color: #3f51b5;
            display: inline-block;
            color: #ffffff;
            border-radius: 2px;
            padding: 2px 5px;
            margin: 0 7px 7px 0;
        }

        .tags-input-remove {
            cursor: pointer;
            position: relative;
            display: inline-block;
            width: 7px;
            height: 7px;

            &:before, &:after {
                content: '';
                position: absolute;
                width: 100%;
                top: 50%;
                left: 0;
                background: #5dc282;
                height: 2px;
                margin-top: -2px;
            }

            &:before {
                transform: rotate(45deg);
            }

            &:after {
                transform: rotate(-45deg);
            }
        }

        .typeahead-badges {
            .tags-input-badge {
                cursor: pointer;
            }
        }
    }

    .vue-tags-input .input {
        padding: 4px 10px;
        border: none;
        transition: border-bottom 100ms ease;
        border-bottom: 1px solid #ccc;
    }

    /* change border-color on focus */
    .vue-tags-input.ti-focus .input {
        border-bottom: 1px solid #333;
    }

    .tag {
        position: relative;
    }

    .tag.valid {
        background-color: #04B404;
    }

    .tag.custom-class {
        background-color: #fff;
        color: rgba(100, 100, 100, 1);
        font-weight: bold;
        text-transform: uppercase;
        box-shadow: 2px 2px 0px 0px rgba(100, 100, 100, 1);
        margin-right: 4px;
        border: 1px solid rgba(100, 100, 100, 1);
        border-radius: 0px;
        font-size: 13px;
    }

    .tag.no-numbers {
        background-color: #FE9A2E;
    }

    .duplicate {
        text-decoration: line-through;
    }

    .new-tag-input.invalid, .item.invalid {
        color: #e54d42;
    }

    .new-tag-input.no-numbers, .item.no-numbers {
        color: #FE9A2E;
    }

    .tag:after {
        transition: transform .2s;
        position: absolute;
        content: '';
        height: 2px;
        width: 108%;
        left: -4%;
        top: calc(50% - 1px);
        background-color: #000;
        transform: scaleX(0);
    }

    .deletion-mark :after {
        transform: scaleX(1);
    }
</style>
