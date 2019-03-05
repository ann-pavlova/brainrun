<template>
    <v-app>
        <div class="b-menu__wrap">
            <div class="container fluid">
                <nav>
                    <ul class="b-menu" d-flex>
                        <li class="b-menu__item" v-for="(item, index) in menuItems" :key="index">
                            <router-link class="b-menu__link" :to="{name: item.path}">{{item.title}}</router-link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <router-view></router-view>
        <div v-if="error">
            <v-snackbar
                :timeout="3000"
                color="error"
                @input="closeError"
                value="true"
            >
                {{error}}
                <v-btn
                    dark
                    flat
                    @click.native="closeError"
                >
                    Close
                </v-btn>
            </v-snackbar>
        </div>
        <div v-if="toastNotification">
            <v-snackbar
                :timeout="3000"
                color="success"
                value="true"
            >
                {{toastNotification}}
                <v-btn
                    dark
                    flat
                    @click.native="closeToastNotification"
                >
                    Close
                </v-btn>
            </v-snackbar>
        </div>
    </v-app>
</template>

<script>
    import {MAIN_MENU, TOAST_NOTIFICATION, ERROR} from './store/routes';

    export default {
        computed: {
            error() {
                return this.$store.state[`${ERROR}`].error;
            },
            toastNotification() {
                return this.$store.state[`${TOAST_NOTIFICATION}`].text;
            },
            menuItems() {
                return this.$store.state[`${MAIN_MENU}`].menuItems;
            }
        },
        methods: {
            closeError() {
                return this.$store.dispatch(`${ERROR}/clearError`);
            },
            closeToastNotification() {
                return this.$store.dispatch(`${TOAST_NOTIFICATION}/clearToastNotification`);
            },
            onClickRoute(path) {
                this.$router.push({name: path});
            }
        }
    };
</script>

<style lang="scss">
    .b-row__wrap {
        margin-bottom: 20px;
    }

    .b-menu__wrap {
        background-color: #1976d2;
    }

    .b-menu {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .b-menu__item {
        display: inline-block;
        margin-right: 50px;
    }

    .b-menu__link {
        color: rgba(#ffffff, 0.5);
        text-decoration: none;
        text-transform: uppercase;
        transition: 0.3s color;

        &.router-link-active {
            text-decoration: underline;
            color: #ffffff;
        }
    }

    p {
        margin: 0;
        padding: 0;
    }

    input {
        outline: none;
    }

    .theme--light.v-card {
        height: 100%;
        overflow: auto;
    }
</style>
