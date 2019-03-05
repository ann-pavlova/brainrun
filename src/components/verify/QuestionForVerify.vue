<template>
    <div>
        <div class="b-row__wrap">
            <vue-markdown :source="question.value"></vue-markdown>
        </div>
        <div v-if="question.answers">
            <div class="b-row__wrap" v-for="(answer, index) in question.answers" :key="answer.id">
                <v-layout class="b-verification__answer-wrap">
                    <div class="b-verification__answer">
                        <vue-markdown :source="answer.value"></vue-markdown>
                    </div>
                    <v-spacer></v-spacer>
                    <div class="b-verification__answer-check-icon" v-if="answer.isCorrect">
                        <svg fill="none" height="24" stroke="#000" stroke-linecap="round"
                    stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24"
                    xmlns="http://www.w3.org/2000/svg">
                            <polyline points="9 11 12 14 23 3"/>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                        </svg>
                    </div>
                </v-layout>
            </div>
        </div>
        <v-btn color="success" @click="onClickVerify">Проверен</v-btn>
        <v-btn color="error" @click="onClickCancelVerify">Отложен</v-btn>
    </div>
</template>

<script>
    import VueMarkdown from 'vue-markdown';

    export default {
        props: ['question'],
        methods: {
            onClickVerify() {
                this.$emit('onClickVerify');
            },
            onClickCancelVerify() {
                this.$emit('onClickCancelVerify');
            }
        },
        components: {
            VueMarkdown
        }
    };
</script>
<style lang="scss">
    .b-verification__answer-wrap {
        padding: 10px;
        border: 2px solid #eeeeee;
    }
</style>
