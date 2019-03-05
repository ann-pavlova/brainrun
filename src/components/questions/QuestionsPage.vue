<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs12>
                <v-form class="b-questions__params">
                    <div class="b-questions__tags">
                        <Tags :exTags="autocompleteTags"
                              :selectedTags.sync="selectedTags"
                              :placeholder="'Добавить тег'"
                              :addNewTag="addNewTag"
                              @onInputWithDelayTags="onInputWithDelayTags"></Tags>
                    </div>
                    <v-layout>
                        <v-flex class="b-questions__levels" xs3 mr-4>
                            <div class="b-questions__label">Уровень</div>
                            <Tags :exTags="autocompleteLevels"
                                  :selectedTags.sync="selectedLevels"
                                  :placeholder="''"
                                  :addNewTag="addNewTag"
                                  @onInputWithDelayTags="onInputWithDelayLevel($event)"></Tags>
                        </v-flex>
                        <v-flex class="b-questions__select" xs1 mr-4>
                            <div class="b-questions__label">Статус</div>
                            <v-select
                                :items="statusVariants"
                                v-model="status"
                            ></v-select>
                        </v-flex>
                        <v-flex class="b-questions__select" xs1 mr-4>
                            <div class="b-questions__label">Язык</div>
                            <v-select
                                :items="langs"
                                v-model="lang"
                            ></v-select>
                        </v-flex>
                        <v-flex xs3>
                            <v-layout class="b-questions__btns">
                                <v-flex>
                                    <v-tooltip top>
                                        <v-btn slot="activator" color="primary" dark @click="onClickCreateQuestion"><v-icon>add</v-icon></v-btn>
                                        <span>Создать вопрос</span>
                                    </v-tooltip>
                                </v-flex>
                                <v-flex>
                                    <v-dialog v-model="isTrainModalActive" persistent max-width="600px" :disabled="selectedTags.length === 0">
                                        <v-tooltip top slot="activator">
                                            <v-btn color="primary" :disabled="selectedTags.length === 0" slot="activator"><v-icon>fitness_center</v-icon></v-btn>
                                            <span>Тренировка</span>
                                        </v-tooltip>
                                        <v-card>
                                            <v-card-title>
                                                <span class="headline">Тренировка</span>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-layout wrap>
                                                    <v-text-field v-model="userName"
                                                                  label="Как тебя зовут?"></v-text-field>
                                                </v-layout>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn color="blue darken-1" flat @click="isTrainModalActive = false">
                                                    Отмена
                                                </v-btn>
                                                <v-btn color="blue darken-1" flat :disabled="userName.length === 0" @click="onClickCreateTrainSession">Начать
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </v-flex>
                                <v-flex>
                                    <v-dialog v-model="isSaveTemplateModalActive" persistent max-width="600px" :disabled="true">
                                        <v-tooltip top slot="activator">
                                            <v-btn color="primary" :disabled="true" slot="activator"><v-icon>bookmark</v-icon></v-btn>
                                            <span>Сохранить шаблон</span>
                                        </v-tooltip>
                                        <v-card>
                                            <v-card-title>
                                                <span class="headline">Создать шаблон</span>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-layout wrap>
                                                    <v-text-field v-model="templateName" label="Название шаблона"></v-text-field>
                                                </v-layout>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn color="blue darken-1" flat @click="isSaveTemplateModalActive = false">
                                                    Отмена
                                                </v-btn>
                                                <v-btn color="blue darken-1" flat @click="onClickSaveTemplate">Сохранить
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </v-flex>
                                <v-flex>
                                    <v-tooltip top slot="activator">
                                        <v-btn color="primary" slot="activator" class="b-questions__file-upload">
                                            <v-icon>attachment</v-icon>
                                            <file-upload :url='url' :thumb-url='thumbUrl' @success="onSucess" @error="onError" accept='.xml' @change="onFileChange"></file-upload>
                                        </v-btn>
                                        <span>Импорт вопросов</span>
                                    </v-tooltip>
                                </v-flex>
                                <v-flex>
                                    <v-tooltip bottom slot="activator">
                                        <div slot="activator">
                                            <v-icon>help_outline</v-icon>
                                        </div>
                                        <pre>
Пример структуры файла:
&lt;?xml version="1.0" encoding="UTF-8"&gt;
&lt;questions tags="c#"&gt;
    &lt;question tags=".net" source="https://www.toptal.com/dot-net/interview-questions"&gt;
        &lt;value type="raw"&gt;
            Discuss what garbage collection is and how it works.
            Provide a code example of how you can enforce garbage collection in .NET.
        &lt;/value&gt;
        &lt;language>eng&lt;/language&gt;
        &lt;level>200&lt;/level&gt;
    &lt;/question>
&lt;/questions>
                                        </pre>
                                    </v-tooltip>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-form>
                <v-layout>
                    <v-flex xs12>
                        <v-data-table
                            :rows-per-page-items="[5, 25, 50]"
                            :headers="questionsTableHeaders"
                            :items="questions"
                            :loading="isQuestionsLoaded"
                            :must-sort="true"
                            :total-items="pagination.totalItems"
                            :pagination.sync="pagination"
                            class="elevation-1"
                        >
                            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                            <template slot="items" slot-scope="props">
                                <tr @click="props.expanded = !props.expanded" class="b-questions__table-tr">
                                    <td>{{props.item.value | maxLength}}</td>
                                    <td>{{props.item['createDate'] | formatDate}}</td>
                                    <td>{{props.item.type}}</td>
                                    <td>{{props.item.level}}</td>
                                    <td>{{props.item.status}}</td>
                                </tr>
                            </template>
                            <template slot="expand" slot-scope="props">
                                <v-btn :id="props.item.id" class="b-questions__icon-btn"
                                       @click.prevent="onClickDeleteQuestion">
                                    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M11.06,64l-.16-2.72L8.7,19.39h5.75L16.5,58.25h31l2-38.86H55.3L53,64H11.06ZM44.22,0V7.19H60v5.75H4V7.19H19.78V0ZM24.81,7.19H39.19V3.6H24.81Zm3.72,46.37L27.8,19.39h-5l.73,34.17Zm11.86,0,.73-34.17h-5l-.73,34.17Z"
                                            data-name="&lt;Compound Path&gt;" id="_Compound_Path_"/>
                                    </svg>
                                </v-btn>
                                <v-btn slot="activator" :id="props.item.id" class="b-questions__icon-btn"
                                       @click.prevent="onClickEditQuestion">
                                    <svg enable-background="new 0 0 512 512" height="512px" id="Layer_1" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M493.278,154.515l-22.625,22.641L334.871,41.39l22.625-22.641c25-25,65.531-25,90.531,0l45.25,45.266  C518.246,89,518.246,129.515,493.278,154.515z M176.465,426.031c-6.25,6.25-6.25,16.375,0,22.625c6.25,6.281,16.375,6.281,22.625,0  l248.938-248.875l-22.656-22.641L176.465,426.031z M63.309,312.906c-6.25,6.25-6.25,16.375,0,22.625s16.375,6.25,22.625,0  L334.871,86.64l-22.625-22.625L63.309,312.906z M357.465,109.25L108.559,358.156c-12.5,12.469-12.469,32.75,0,45.25  c12.5,12.5,32.75,12.563,45.281-0.031l248.906-248.859L357.465,109.25z M153.778,471.219c-7.656-7.656-11.344-17.375-12.719-27.375  c-3.25,0.5-6.531,0.969-9.875,0.969c-17.094,0-33.156-6.688-45.25-18.781c-12.094-12.125-18.75-28.156-18.75-45.25  c0-3.125,0.469-6.156,0.906-9.188c-10.344-1.406-19.906-5.938-27.406-13.438c-0.719-0.719-0.969-1.688-1.625-2.469L-0.004,512  l155.906-39.031C155.215,472.344,154.434,471.875,153.778,471.219z"/>
                                        </svg>
                                </v-btn>
                                <v-btn :id="props.item.id" class="b-questions__icon-btn" :disabled="props.item.status !== 'forverify'"
                                       @click.prevent="onClickVerified">
                                    <svg fill="none" height="24" stroke="#000" stroke-linecap="round"
                                         stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <polyline points="9 11 12 14 23 3"/>
                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                                    </svg>
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-flex>
                </v-layout>
                <v-dialog v-model="isVerifyModalActive" fullscreen hide-overlay
                          transition="dialog-bottom-transition">
                    <v-card>
                        <v-toolbar dark color="primary">
                            <v-btn icon dark @click="onClickCloseVerifyModal">
                                <v-icon>close</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-container>
                            <v-layout row wrap>
                                <v-flex xs10 offset-xs1>
                                    <VerifyModal></VerifyModal>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="isEditQuestionModalActive" fullscreen hide-overlay
                          transition="dialog-bottom-transition">
                    <v-card>
                        <v-toolbar dark color="primary">
                            <v-btn icon dark @click="isEditQuestionModalActive = false">
                                <v-icon>close</v-icon>
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-toolbar-items>
                                <v-btn dark flat :disabled="isSaveAvailable"
                                       @click.prevent="onClickSaveQuestion">Сохранить
                                </v-btn>
                            </v-toolbar-items>
                        </v-toolbar>
                        <v-container>
                            <v-layout row wrap>
                                <v-flex xs10 offset-xs1>
                                    <EditQuestion ref="editQuestion" @setSaveQuestionAvailable="setSaveQuestionAvailable"></EditQuestion>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                </v-dialog>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import Tags from '../Tags';
    import EditQuestion from '../edit/EditQuestion';
    import VerifyModal from '../verify/VerifyModal';
    import dataLevels from '../../data/levels';
    import tagsMixin from '../../mixins/tags';
    import * as Route from '../../store/routes';
    import moment from 'moment';
    import config from '../../data/config';
    import Vue from 'vue';
    import FileUpload from 'v-file-upload';
    Vue.use(FileUpload);

    export default {
        data() {
            return {
                url: Route.IMPORT_URL,
                fileUploaded: [],
                title: 'Вопросы',
                statusVariants: ['all', 'published', 'draft', 'forVerify', 'fixRequired', 'deleted'],
                langs: ['all', 'ru', 'eng'],
                lang: 'all',
                status: 'all',
                isInitState: false,
                isVerifyModalActive: false,
                isSaveTemplateModalActive: false,
                isTrainModalActive: false,
                isEditQuestionModalActive: false,
                templateName: '',
                userName: '',
                selectedTags: [],
                selectedLevels: [],
                autocompleteTags: [],
                autocompleteLevels: dataLevels,
                isSaveAvailable: true,
                isQuestionsLoaded: false,
                questions: [],
                pagination: {
                    descending: true,
                    rowsPerPage: 5,
                    sortBy: 'date',
                    page: 1,
                    totalItems: 0
                },
                questionsTableHeaders: [
                    {
                        text: 'Вопрос',
                        align: 'left',
                        sortable: false,
                        value: 'name'
                    }, {
                        text: 'Дата создания',
                        value: 'date'
                    }, {
                        text: 'Тип вопроса',
                        value: 'type'
                    }, {
                        text: 'Уровень',
                        value: 'level'
                    }, {
                        text: 'Статус',
                        value: 'status'
                    }
                ]
            };
        },
        mixins: [tagsMixin],
        filters: {
            formatDate(value) {
                if (value) {
                    let date = moment(value, 'DD.MM.YYYY HH:mm:ss zzz');
                    return date.format(config.formatDateTableQuestion);
                }
            },
            maxLength(value) {
                if (value && value.length > config.maxLengthTableQuestion) {
                    let shortQuestionText = value.slice(0, config.maxLengthTableQuestion);
                    return `${shortQuestionText}...`;
                } else {
                    return value;
                }
            }
        },
        async created() {
            this.isInitState = true;
            if (localStorage.paginationRowsPerPage) {
                this.pagination.rowsPerPage = Number(localStorage.paginationRowsPerPage);
                this.$store.dispatch(`${Route.QUESTIONS}/updateLimitFromLocalStorage`, this.pagination.rowsPerPage);
            }
            this.updateTagsByQuery();

            await this.setQuestionFilterParametrsFromQuery();
            this.updateQuestions();
            this.isInitState = false;
        },
        computed: {
            questionValue() {
                return this.$store.state[`${Route.EDIT_QUESTION}`].question.value;
            }
        },
        watch: {
            'pagination.rowsPerPage'(newValue) {
                localStorage.paginationRowsPerPage = newValue;
            },
            pagination() {
                this.$store.dispatch(`${Route.QUESTIONS}/setPaging`, this.pagination);
                if (!this.isInitState) {
                    this.updateQuestions();
                }
            },
            selectedTags() {
                this.$store.dispatch(`${Route.QUESTIONS}/saveAliases`, {name: 'tagAliases', value: this.selectedTags});
                if (!this.isInitState) {
                    this.updateQuestions();
                }
            },
            selectedLevels() {
                this.$store.dispatch(`${Route.QUESTIONS}/saveAliases`, {name: 'levelAliases', value: this.selectedLevels});
                if (!this.isInitState) {
                    this.updateQuestions();
                }
            },
            lang() {
                this.$store.dispatch(`${Route.QUESTIONS}/setLang`, this.lang);
                if (!this.isInitState) {
                    this.updateQuestions();
                }
            },
            status() {
                this.$store.dispatch(`${Route.QUESTIONS}/setStatus`, this.status);
                if (!this.isInitState) {
                    this.updateQuestions();
                }
            }
        },
        methods: {
            onError(progressEvent) {
                this.$store.dispatch('error/setErrorMessage', `${progressEvent.srcElement.response.message}`);
            },
            async onSucess(progressEvent) {
                let importedCount = progressEvent.srcElement.response.importedCount;
                await this.$store.dispatch(`${Route.TOAST_NOTIFICATION}/setToastNotification`, `Импортированных вопросов: ${importedCount}`);
                this.updateQuestions();
            },
            thumbUrl(file) {
                return file.myThumbUrlProperty;
            },
            onFileChange(file) {
                this.fileUploaded = file;
            },
            async setQuestionFilterParametrsFromQuery() {
                let queryFromRoute = this.$route.query;

                if (queryFromRoute.limit) {
                    this.pagination.rowsPerPage = +queryFromRoute.limit;
                }

                if (queryFromRoute.orderby) {
                    let orderBy = queryFromRoute.orderby.split(':');
                    this.pagination.sortBy = orderBy[0];
                    this.pagination.descending = orderBy[1] === 'desc';
                }

                if (queryFromRoute.lang) {
                    this.lang = queryFromRoute.lang;
                }

                if (queryFromRoute.status) {
                    this.status = queryFromRoute.status;
                }

                if (queryFromRoute.tags) {
                    let tags = await this.$store.dispatch(`${Route.TAGS}/getTagsByAliases`, queryFromRoute.tags);
                    this.selectedTags = this.convertTagsForInput(tags.data);
                }

                if (queryFromRoute.levels) {
                    let levelsFromQuery = queryFromRoute.levels.split(',');
                    let levelsArray = [];
                    for (let i = 0; i < levelsFromQuery.length; i++) {
                        levelsArray.push({'alias': levelsFromQuery[i], 'text': levelsFromQuery[i]});
                    }
                    this.selectedLevels = levelsArray;
                }
            },
            setSaveQuestionAvailable(isValid) {
                this.isSaveAvailable = !isValid;
            },
            getTrainSessionStartRequest(tags, username) {
                let tagAlias = [];

                for (let i = 0; i < tags.length; i++) {
                    tagAlias.push(tags[i].alias);
                }

                return {
                    'userName': username,
                    'tags': tagAlias
                };
            },
            onClickCloseVerifyModal() {
                this.updateQuestions();
                this.isVerifyModalActive = false;
            },
            async onClickCreateTrainSession() {
                let trainSessionStartRequest = this.getTrainSessionStartRequest(this.selectedTags, this.userName);
                let trainSession = await this.$store.dispatch(`${Route.TRAIN_SESSION}/createTrainSession`, trainSessionStartRequest);
                this.$router.push({name: 'TrainPageWithParams', params: {sessionId: trainSession.id, questionNumber: 1}});
            },
            async updateQuestions() {
                this.isQuestionsLoaded = true;
                let questionContainer = await this.$store.dispatch(`${Route.QUESTIONS}/getQuestions`);
                this.questions = questionContainer.questions;
                this.pagination.totalItems = +questionContainer.totalCount;
                this.isQuestionsLoaded = false;
            },
            async onClickCreateQuestion() {
                await this.$store.dispatch(`${Route.EDIT_QUESTION}/setQuestionToState`);
                this.isEditQuestionModalActive = true;
                this.$refs.editQuestion.loadAutocompleteTags();
            },
            async onClickSaveQuestion() {
                let isQuestionSaved = await this.$store.dispatch(`${Route.EDIT_QUESTION}/saveQuestion`);
                if (isQuestionSaved) {
                    this.updateQuestions();
                    this.isEditQuestionModalActive = false;
                    this.$store.dispatch(`${Route.TOAST_NOTIFICATION}/setToastNotification`, 'Вопрос создан');
                } else {
                    this.$store.dispatch(`${Route.TOAST_NOTIFICATION}/setToastNotification`, 'Произошла ошибка');
                }
            },
            async onClickDeleteQuestion($event) {
                await this.$store.dispatch(`${Route.EDIT_QUESTION}/onClickDeleteQuestion`, $event.currentTarget.id);
                this.updateQuestions();
            },
            async onClickEditQuestion($event) {
                await this.$store.dispatch(`${Route.EDIT_QUESTION}/setQuestionToState`, $event.currentTarget.id);
                this.isEditQuestionModalActive = true;
                this.$refs.editQuestion.loadAutocompleteTags();
            },
            async onClickVerified($event) {
                await this.$store.dispatch(`${Route.FOR_VERIFY}/setQuestionForVerifiedToState`, $event.currentTarget.id);
                this.isVerifyModalActive = true;
            },
            onClickSaveTemplate() {
                this.isSaveTemplateModalActive = false;
                this.$store.dispatch(`${Route.QUESTIONS}/saveTemplate`, this.templateName);
            }
        },
        components: {
            Tags,
            EditQuestion,
            VerifyModal
        }
    };
</script>

<style lang="scss">
    .b-questions__tags {
        margin-bottom: 20px;

        .vue-tags-input {
            max-width: 100% !important;
        }
    }

    .b-questions__levels {
        .vue-tags-input {
            max-width: 100% !important;
        }
    }

    .b-questions__label {
        margin-bottom: 10px;
    }

    .b-questions__select {
        .v-text-field {
            padding-top: 0;
            margin-top: 0;
        }
    }

    .b-questions__params {
        margin-bottom: 50px;
    }

    .b-questions__btns {
        height: 100%;
        align-items: center;
    }

    .b-questions__icon-btn {
        svg {
            width: 15px;
            height: 15px;
        }
    }

    .b-questions__table-tr {
        &:hover {
            cursor: pointer;
        }
    }

    .b-questions__file-upload {
        position: relative;
        padding: 0;
        overflow: hidden;

        .file-upload {
            width: 100%;
            position: absolute;
            opacity: 0;
            height: 100%;
        }
    }
</style>
