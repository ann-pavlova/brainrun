<template>
    <div class="b-row__wrap">
        <div class="b-row__wrap title">Результаты тренировки для пользователя: {{result.userName}}</div>
        <div class="b-train-page__result-wrap"
             :class="{'b-train-page__result-wrap_is-correct': item.isCorrectAnswer === true}"
             v-for="(item, index) in result.questions" :key="index">
            <div class="b-row__wrap">
                <vue-markdown :source="item.value"></vue-markdown>
            </div>
            <div class="b-row__wrap">
                <div class="b-row__wrap" v-for="(answer, index) in item.answers" :key="answer.id">
                    <v-layout class="b-train-result__answer-wrap" :class="{'b-train-result__answer-wrap_is-correct': answer.isCorrect && answer.isUserChoose, 'b-train-result__answer-wrap_is-wrong': answer.isUserChoose && !answer.isCorrect }">
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
        </div>
    </div>
</template>

<script>
    import VueMarkdown from 'vue-markdown';

    export default {
        props: ['result'],
        components: {
            VueMarkdown
        }
    };
</script>

<style scoped lang="scss">
    .b-train-page__result-wrap {
        padding: 10px;
        border-radius: 5px;
        border: 2px solid rgba(243, 67, 67, 0.5);
        margin-bottom: 20px;

        &.b-train-page__result-wrap_is-correct {
            border: 2px solid rgba(68, 187, 16, 0.5);
        }
    }

    .b-train-result__answer-wrap {
        padding: 10px;
        border: 2px solid #eeeeee;
        border-radius: 5px;
    }

    .b-train-result__answer-wrap_is-correct {
        border: 2px solid rgb(68, 187, 16);
    }

    .b-train-result__answer-wrap_is-wrong {
        border: 2px solid rgb(243, 67, 67);
    }

</style>
