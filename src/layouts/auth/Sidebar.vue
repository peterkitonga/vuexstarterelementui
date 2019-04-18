<template>
    <el-menu class="el-menu-vertical-custom" :router="true" :default-active="this.$route.name" :collapse="this.$store.state['sidebar_collapse']" :collapse-transition="false">
        <el-menu-item index="subscriber.home" route="/home" v-if="hasAccess('subscriber')">
            <i class="el-icon-menu"></i>
            <span>Home</span>
        </el-menu-item>
        <el-menu-item index="administrator.home" route="/admin/home" v-if="hasAccess('administrator')">
            <i class="el-icon-menu"></i>
            <span>Home</span>
        </el-menu-item>
        <el-menu-item index="users.index" route="/users" v-if="hasAccess('administrator')">
            <i class="el-icon-news"></i>
            <span>Users</span>
        </el-menu-item>
    </el-menu>
</template>

<script>
    export default {
        name: "auth-sidebar",
        data: function() {
            return {
                collapsed: false
            }
        },
        methods: {
            hasAccess: function (role) {
                return role === this.$store.state['auth_object']['role'];
            }
        }
    }
</script>

<style scoped>
    .el-menu--collapse {
        width: 64px;
        min-height: 100vh;
    }
    .el-menu-vertical-custom:not(.el-menu--collapse) {
        min-height: 100vh;
    }
</style>