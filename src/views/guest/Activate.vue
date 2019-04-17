<template>
    <el-main v-loading="loading.activate"></el-main>
</template>

<script>
    import {INIT_ACTIVATE_AUTH_USER} from "../../store/types";

    export default {
        name: "guest-activate",
        data: function () {
            return {
                loading: {
                    activate: false
                }
            }
        },
        computed: {
            activationCode: function () {
                return this.$route.params['code'];
            }
        },
        methods: {
            activateAccount: function () {
                this.loading.activate = true;

                return this.$store.dispatch(INIT_ACTIVATE_AUTH_USER, this.activationCode).then(response => {
                    this.loading.activate = false;

                    this.$message({
                        type: response.status,
                        showClose: true,
                        duration: 10000,
                        message: response.message
                    });

                    this.$router.push({name: 'login'});
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        duration: 10000,
                        message: error.data.message
                    });

                    this.$router.push({name: 'login'});
                });
            }
        },
        mounted: function () {
            this.activateAccount()
        }
    }
</script>

<style scoped>

</style>