import Vue from 'vue';
import Vuex from 'vuex';
import tags from './tags/tags';
import editQuestion from './questions/editQuestion';
import questionsForVerify from './questions/questionsForVerify';
import questions from './questions/questions';
import trainSession from './trainSession/trainSession';
import mainMenu from './mainMenu';
import toastNotification from './toastNotification';
import error from './error';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        tags,
        editQuestion,
        questionsForVerify,
        questions,
        trainSession,
        mainMenu,
        toastNotification,
        error
    }
});
