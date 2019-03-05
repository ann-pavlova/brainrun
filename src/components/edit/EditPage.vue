<template>
    <v-app>
        <v-container>
            <v-layout row wrap>
                <v-flex xs10 offset-xs1>
                    <v-form>
                        <EditQuestion ref="editQuestion" @setSaveQuestionAvailable="setSaveQuestionAvailable"></EditQuestion>
                        <v-layout>
                            <v-btn color="success" :disabled="isSaveAvailable" @click="onClickSaveQuestion">Сохранить
                            </v-btn>
                        </v-layout>
                    </v-form>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>

<script>
    import EditQuestion from './EditQuestion';
    import {EDIT_QUESTION} from '../../store/routes';

    export default {
        data() {
            return {
                isSaveAvailable: true
            };
        },
        methods: {
            onClickSaveQuestion() {
                this.$refs.editQuestion.saveQuestion();
            },
            setSaveQuestionAvailable(isValid) {
                this.isSaveAvailable = !isValid;
            }
        },
        computed: {
            question() {
                return this.$store.state[`${EDIT_QUESTION}`].question.value;
            }
        },
        components: {
            EditQuestion
        }
    };
</script>
