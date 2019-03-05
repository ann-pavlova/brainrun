<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs10 offset-xs1>
                <div v-if="isEmptyQuestion">
                    Вопросов для валидации нет
                </div>
                <div v-else v-cloak>
                    <QuestionForVerify :question="question" @onClickVerify="verifyQuestion" @onClickCancelVerify="cancelVerifyQuestion"></QuestionForVerify>
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import QuestionForVerify from './QuestionForVerify';
    import {FOR_VERIFY} from '../../store/routes';

    export default {
        data() {
            return {
                title: 'Верификация'
            };
        },
        created() {
            if (this.$route.params.id !== undefined) {
                this.$store.dispatch(`${FOR_VERIFY}/setQuestionForVerifiedToState`, this.$route.params.id);
            }
            
            this.getQuestionForVerify();
        },
        computed: {
            question() {
                return this.$store.state[`${FOR_VERIFY}`].question;
            },
            nextId() {
                return this.$store.state[`${FOR_VERIFY}`].nextId;
            },
            isEmptyQuestion() {
                return this.question.value === undefined;
            }
        },
        methods: {
            async verifyQuestion() {
                this.setQuestionVerify('setQuestionAsVerify');
            },
            async cancelVerifyQuestion() {
                this.setQuestionVerify('setQuestionAsNoVerify');
            },
            async setQuestionVerify(actionName) {
                let resp = await this.$store.dispatch(`${FOR_VERIFY}/${actionName}`, this.question.id);
                if (resp.status === 200) {
                    this.getQuestionForVerify();
                }
            },
            async getQuestionForVerify() {
                await this.$store.dispatch(`${FOR_VERIFY}/getQuestionForVerify`);
                this.pushIdToRoute();
            },
            pushIdToRoute() {
                if (this.isEmptyQuestion) {
                    this.$router.push({name: 'VerifyPage'});
                } else {
                    this.$router.replace({name: 'VerifyPageById', params: {id: `${this.question.id}`}});
                }
            }
        },
        components: {
            QuestionForVerify
        }
};
</script>
