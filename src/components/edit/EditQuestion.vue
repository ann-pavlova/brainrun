<template>
    <div>
        <div class="b-row__wrap">
            <Tags :exTags="autocompleteTags"
                  :selectedTags.sync="selectedTags"
                  :placeholder="'Добавить тег'"
                  :addNewTag="addNewTag"
                  @onInputWithDelayTags="onInputWithDelayTags"></Tags>
        </div>
        <!-- textarea -->
        <div class="b-row__wrap">
            <v-flex xs4>
                <p>Тип поля ввода вопроса</p>
                <v-select
                    :items="valueTypes"
                    v-model="valueType"
                ></v-select>
            </v-flex>
        </div>
        <div v-if="valueType === 'raw'" class="b-row__wrap">
            <v-textarea
                outline
                color="indigo"
                label="Вопрос"
                v-model.trim="question"
            ></v-textarea>
        </div>
        <div v-else class="b-row__wrap">
            <markdown-editor v-model="question" :configs="configs" ref="markdownEditor"></markdown-editor>
        </div>
        <!-- selects -->
        <div class="b-row__wrap">
            <v-layout>
                <v-flex xs5>
                    <p>Уровень сложности</p>
                    <v-select
                        :items="levels"
                        v-model="level"
                    ></v-select>
                </v-flex>
                <v-flex xs5 offset-xs2>
                    <p>Язык</p>
                    <v-select
                        :items="langs"
                        v-model="lang"
                    ></v-select>
                </v-flex>
            </v-layout>
            <v-layout>
                <v-flex xs6>
                    <v-btn color="primary" @click="onClickAddAnswer" :disabled="!isAllAnswersCorrect">Добавить ответ</v-btn>
                </v-flex>
            </v-layout>
        </div>
        <!-- answers -->
        <div v-if="answers.length !== 0">
            <transition-group name="list">
                <v-layout v-for="(answer, index) in answers" :key="answer.id">
                    <v-flex xs1 d-flex align-center justify-center>
                        <v-btn class="b-edit-question__btn" :id="answer.id" @click.prevent="onClickRemoveAnswer($event)">
                            <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M11.06,64l-.16-2.72L8.7,19.39h5.75L16.5,58.25h31l2-38.86H55.3L53,64H11.06ZM44.22,0V7.19H60v5.75H4V7.19H19.78V0ZM24.81,7.19H39.19V3.6H24.81Zm3.72,46.37L27.8,19.39h-5l.73,34.17Zm11.86,0,.73-34.17h-5l-.73,34.17Z"
                                    data-name="&lt;Compound Path&gt;" id="_Compound_Path_"/>
                            </svg>
                        </v-btn>
                        <v-tooltip bottom>
                            <v-checkbox class="check" v-model="answer.isCorrect" slot="activator"></v-checkbox>
                            <div>Отметь, если вариант ответа верен</div>
                        </v-tooltip>
                    </v-flex>
                    <v-flex xs11>
                        <markdown-editor v-model="answer.value" :configs="configs" @input="onInputAnswer"
                                         ref="markdownEditor"></markdown-editor>
                    </v-flex>
                </v-layout>
            </transition-group>
        </div>
    </div>
</template>

<script>
    import Tags from '../Tags';
    import {EDIT_QUESTION} from '../../store/routes';
    import tagsMixin from '../../mixins/tags';
    import markdownEditor from 'vue-simplemde/src/markdown-editor';
    import 'simplemde/dist/simplemde.min.css';

    export default {
        data() {
            return {
                levels: [100, 200, 300, 400],
                langs: ['ru', 'eng'],
                valueTypes: ['markdown', 'raw'],
                autocompleteTags: [],
                isAllAnswersCorrect: true,
                mark: '',
                configs: {
                    spellChecker: false
                }
            };
        },
        mixins: [tagsMixin],
        computed: {
            answers() {
                return this.$store.state[`${EDIT_QUESTION}`].question.answers;
            },
            question: {
                get() {
                    return this.$store.state[`${EDIT_QUESTION}`].question.value;
                },
                set(value) {
                    this.$store.dispatch(`${EDIT_QUESTION}/setValue`, {param: 'value', data: value});
                    this.validateForm();
                }
            },
            level: {
                get() {
                    return this.$store.state[`${EDIT_QUESTION}`].question.level;
                },
                set(value) {
                    this.$store.dispatch(`${EDIT_QUESTION}/setValue`, {param: 'level', data: value});
                }
            },
            lang: {
                get() {
                    return this.$store.state[`${EDIT_QUESTION}`].question.language;
                },
                set(value) {
                    this.$store.dispatch(`${EDIT_QUESTION}/setValue`, {param: 'language', data: value});
                }
            },
            selectedTags: {
                get() {
                    return this.$store.state[`${EDIT_QUESTION}`].selectedTags;
                },
                set(value) {
                    this.$store.dispatch(`${EDIT_QUESTION}/setSelectedTags`, {param: 'selectedTags', data: value});
                }
            },
            valueType: {
                get() {
                    return this.$store.state[`${EDIT_QUESTION}`].question.valueType;
                },
                set(value) {
                    this.$store.dispatch(`${EDIT_QUESTION}/setValue`, {param: 'valueType', data: value});
                }
            }
        },
        methods: {
            async saveQuestion() {
                await this.$store.dispatch(`${EDIT_QUESTION}/saveQuestion`);
                this.$store.commit(`${EDIT_QUESTION}/resetAnswers`);
            },
            loadAutocompleteTags() {
                this.updateTagsByQuery();
            },
            onClickAddAnswer() {
                this.$store.dispatch(`${EDIT_QUESTION}/addAnswer`);
                this.validateForm();
            },
            onClickRemoveAnswer($event) {
                this.$store.dispatch(`${EDIT_QUESTION}/removeAnswer`, $event.currentTarget.getAttribute('id'));
                this.validateForm();
            },
            onInputAnswer() {
                this.validateForm();
            },
            validateForm() {
                this.isAllAnswersCorrect = this.$store.getters[`${EDIT_QUESTION}/isAllAnswersCorrect`];
                let isFormValid = this.question.length !== 0 && this.isAllAnswersCorrect;
                this.$emit('setSaveQuestionAvailable', isFormValid);
            }
        },
        components: {
            markdownEditor,
            Tags
        }
    };
</script>

<style lang="scss">
    .b-edit-question__btn {
        background-color: transparent !important;
        box-shadow: none !important;
        min-width: 30px;

        &:hover {
            background-color: transparent;
        }

        svg {
            width: 15px;
            height: 15px;
        }
    }

    .list-item {
        display: inline-block;
    }

    .list-enter-active, .list-leave-active {
        transition: all .5s;
    }

    .list-enter, .list-leave-to {
        opacity: 0;
        transform: translateY(-10px);
    }
</style>
