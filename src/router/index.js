import Vue from 'vue';
import Router from 'vue-router';
import EditPage from '../components/edit/EditPage';
import QuestionsPage from '../components/questions/QuestionsPage';
import Train from '../components/trainSession/TrainPage';
import Templates from '../components/templates/Templates';
import VerifyPage from '../components/verify/VerifyPage';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Root',
            redirect: '/questions'
        },
        {
            path: '/questions',
            name: 'QuestionsPage',
            component: QuestionsPage
        }, {
            path: '/edit',
            name: 'EditPage',
            component: EditPage
        }, {
            path: '/trainSession/:sessionId',
            name: 'TrainPage',
            component: Train,
            children: [{
                path: '/trainSession/:sessionId/questions/:questionNumber',
                name: 'TrainPageWithParams',
                component: Train
            }]
        }, {
            path: '/templates',
            name: 'Templates',
            component: Templates
        }, {
            path: '/verify',
            name: 'VerifyPage',
            component: VerifyPage,
            children: [{
                path: '/verify/:id',
                name: 'VerifyPageById',
                component: VerifyPage
            }]
        }
    ]
});
