<template>
    <v-app>
        <v-container>
            <v-layout row wrap>
                <v-flex xs10 offset-xs1>
                    <div v-if="isShowResult">
                        <div class="b-row__wrap">
                            <v-btn color="success" @click="onClickBackToQuestions">Вернуться к вопросам</v-btn>
                        </div>
                        <TrainResult :result="result"></TrainResult>
                    </div>
                    <div v-else>
                        <div class="b-row__wrap">
                            <v-layout class="b-train-page__header" justify-start align-center row>
                                <v-spacer></v-spacer>
                                <v-flex class="b-train-page__header-block" xs1>
                                    <v-layout class="font-weight-bold">
                                        <div>{{number}}</div>
                                        <div>/</div>
                                        <div>{{questionsCount}}</div>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs1>
                                    <v-btn color="primary" @click="onClickCompleteTrain">Завершить тест</v-btn>
                                </v-flex>
                            </v-layout>
                        </div>
                        <div class="b-row__wrap">
                            <vue-markdown :source="question.value"></vue-markdown>
                        </div>
                        <div class="b-row__wrap" v-if="question.answers">
                            <div v-if="question.type === 'multiply'">
                                <v-layout v-for="(answer, index) in question.answers" :key="index" class="b-train-page__answer-wrap">
                                    <v-flex>
                                        <v-tooltip bottom>
                                            <v-checkbox class="check" v-model="selectedAnswerIds" :value="answer.id" d-flex justify-center slot="activator"></v-checkbox>
                                            <div>Отметь, если вариант ответа верен</div>
                                        </v-tooltip>
                                    </v-flex>
                                    <v-flex xs11>
                                        <vue-markdown :source="answer.value"></vue-markdown>
                                    </v-flex>
                                </v-layout>
                            </div>
                            <div v-else>
                                <div v-if="question.answers.length === 1">
                                    <v-expansion-panel v-model="questionPanel">
                                        <v-expansion-panel-content>
                                            <div slot="header">Ответ</div>
                                            <v-card>
                                                <v-card-text>
                                                    <v-layout v-for="(answer, index) in question.answers" :id="answer.id" :key="index">
                                                        <v-flex class="b-train-page__answer-check">
                                                            <v-tooltip bottom>
                                                                <v-icon slot="activator" :color="isAnswerExist(answer.id) ? 'primary' : ''" @click="onClickChooseAnswer(answer.id);"> {{isAnswerExist(answer.id) ? 'radio_button_checked' : 'radio_button_unchecked'}}
                                                                </v-icon>
                                                                <span>Отметь, если вариант ответа верен</span>
                                                            </v-tooltip>
                                                        </v-flex>
                                                        <v-flex xs11><vue-markdown :source="answer.value"></vue-markdown></v-flex>
                                                    </v-layout>
                                                </v-card-text>
                                            </v-card>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </div>
                                <div v-else>
                                    <v-layout class="b-train-page__answer-wrap" v-for="(answer, index) in question.answers" :id="answer.id" :key="index">
                                        <v-flex class="b-train-page__answer-check">
                                            <v-tooltip bottom>
                                                <v-icon slot="activator" :color="isAnswerExist(answer.id) ? 'primary' : ''" @click="onClickChooseAnswer(answer.id);"> {{isAnswerExist(answer.id) ? 'radio_button_checked' : 'radio_button_unchecked'}}
                                                </v-icon>
                                                <span>Отметь, если вариант ответа верен</span>
                                            </v-tooltip>
                                        </v-flex>
                                        <v-flex xs11><vue-markdown :source="answer.value"></vue-markdown></v-flex>
                                    </v-layout>
                                </div>
                            </div>
                        </div>
                        <v-layout>
                            <v-btn class="error" :disabled="isPrevBtnDisable" @click="onClickGetPrevQuestion">Предыдущий вопрос</v-btn>
                            <v-btn class="success" @click="onClickGetNextQuestion">{{(number === questionsCount) ? 'Отправить ответ' : 'Следующий вопрос'}}
                            </v-btn>
                        </v-layout>
                    </div>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>
<script>
    import VueMarkdown from 'vue-markdown';
    import {TRAIN_SESSION} from '../../store/routes';
    import TrainResult from './TrainResult';

    export default {
        data() {
            return {
                questionPanel: null,
                isRadioButtonActive: false,
                selectedAnswerIds: [],
                title: 'Тренировка',
                question: {},
                isPrevBtnDisable: false,
                isShowResult: false,
                result: [],
                routeFromLink: ''
            };
        },
        async created() {
            if (this.$route.params.sessionId !== undefined && this.$route.params.questionNumber !== undefined) {
                await this.$store.dispatch(`${TRAIN_SESSION}/setValueFromQueryParams`, {id: this.$route.params.sessionId, number: +this.$route.params.questionNumber});
                await this.$store.dispatch(`${TRAIN_SESSION}/getTrainSessionById`, this.$route.params.sessionId);
                this.question = await this.$store.dispatch(`${TRAIN_SESSION}/getQuestion`);
            } else if (this.$route.params.sessionId !== undefined) {
                this.result = await this.$store.dispatch(`${TRAIN_SESSION}/getTrainSessionResult`, this.$route.params.sessionId);
                this.isShowResult = true;
            } else {
                this.resetComponentParams();
                this.getNextQuestion();
            }
        },

        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.routeFromLink = from.fullPath;
            });
        },
        computed: {
            isAnswerExist() {
                return function(id) {
                    return this.selectedAnswerIds.indexOf(id) >= 0;
                };
            },
            number() {
                return this.$store.state.trainSession.number;
            },
            questionsCount() {
                return this.$store.state.trainSession.questionsCount;
            },
            sessionId() {
                return this.$store.state.trainSession.id;
            }
        },
        methods: {
            onClickChooseAnswer(id) {
                this.selectedAnswerIds = [];
                this.selectedAnswerIds.push(id);
            },
            resetComponentParams() {
                this.questionPanel = null;
                this.selectedAnswerIds = [];
                this.isRadioButtonActive = false;
            },
            async onClickGetPrevQuestion() {
                this.resetComponentParams();
                this.question = await this.$store.dispatch(`${TRAIN_SESSION}/getPrevQuestion`);
                this.$router.replace({name: 'TrainPageWithParams', params: {sessionId: `${this.sessionId}`, questionNumber: `${this.number}`}});

                if (this.number === 1) {
                    this.isPrevBtnDisable = true;
                }
            },
            async onClickGetNextQuestion() {
                this.isPrevBtnDisable = false;
                await this.createAnswers();
                if (this.number !== this.questionsCount) {
                    this.resetComponentParams();
                    this.getNextQuestion();
                }
            },
            createAnswers() {
                if (this.selectedAnswerIds.length) {
                    this.$store.dispatch(`${TRAIN_SESSION}/createAnswers`, {answerIds: this.selectedAnswerIds, questionId: this.question.id});
                }
            },
            async getNextQuestion() {
                this.question = await this.$store.dispatch(`${TRAIN_SESSION}/getNextQuestion`);
                this.$router.replace({name: 'TrainPageWithParams', params: {sessionId: `${this.sessionId}`, questionNumber: `${this.number}`}});
            },
            async onClickCompleteTrain() {
                this.result = await this.$store.dispatch(`${TRAIN_SESSION}/completeTrainSession`);
                this.isShowResult = true;
                this.$router.push({name: 'TrainPage', params: {sessionId: this.sessionId}});
            },
            onClickBackToQuestions() {
                this.$router.push(this.routeFromLink);
            }
        },
        components: {
            VueMarkdown,
            TrainResult
        }
    };
</script>


<style lang="scss">
    .b-train-page__answer-wrap {
        border-bottom: 2px solid #eeeeee;
        margin-bottom: 10px;
        padding-top: 10px;

        .v-input--selection-controls {
            margin-top: 0;
            padding-top: 0;
        }
    }

    .b-train-page__answer-check {
        height: 48px;
    }
</style>
