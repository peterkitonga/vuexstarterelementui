<template>
    <el-menu class="el-menu-custom" mode="horizontal" :default-active="this.$route.name" :router="true">
        <el-menu-item index="logo" route="/">VuexStarter</el-menu-item>
        <el-menu-item index="logout" route="#" style="float: right">
            <el-dropdown @command="handleCommands" trigger="click">
                    <span>
                        <img src="/images/user-avatar.png" alt="User Image" class="img-circle" style="height: 35px;width: 35px;border-radius: 50%">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="{method: 'logout', params: {}}">Logout</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-menu-item>
    </el-menu>
</template>

<script>
    import {INIT_LOGOUT_AUTH_USER} from "../../store/types";

    export default {
        name: "auth-header",
        methods: {
            handleCommands: function (command) {
                this[command.method](command.params);
            },
            logout: function () {
                return this.$store.dispatch(INIT_LOGOUT_AUTH_USER).then(response => {
                    this.$message({
                        type: response.status,
                        showClose: true,
                        duration: 10000,
                        message: response.message,
                    });
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        duration: 10000,
                        message: error.data.message,
                    });
                })
            }
        }
    }
</script>

<style scoped>

</style>