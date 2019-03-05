<template>
    <v-layout row wrap>
        <v-flex xs10 offset-xs1>
            <QuestionForVerify :question="question" @onClickVerify="verifyQuestion" @onClickCancelVerify="cancelVerifyQuestion"></QuestionForVerify>
        </v-flex>
    </v-layout>
</template>

<script>
    import QuestionForVerify from './QuestionForVerify';
    import {FOR_VERIFY} from '../../store/routes';

    export default {
        computed: {
            question() {
                return this.$store.state[`${FOR_VERIFY}`].question;
            }
        },
        methods: {
            async verifyQuestion() {
                this.setQuestionVerify('setQuestionAsVerify');
            },
            async cancelVerifyQuestion() {
                this.setQuestionVerify('setQuestionAsNoVerify');
            },
            setQuestionVerify(actionName) {
                this.$store.dispatch(`${FOR_VERIFY}/${actionName}`, this.question.id);
                this.$store.dispatch(`${FOR_VERIFY}/${actionName}`);
            }
        },
        components: {
            QuestionForVerify
        }
    };
</script>
