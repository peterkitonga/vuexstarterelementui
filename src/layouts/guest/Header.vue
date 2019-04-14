<template>
    <el-menu class="el-menu-custom" mode="horizontal" :default-active="this.$route.name" :router="true">
        <el-menu-item index="logo" route="/">VuexStarter</el-menu-item>
        <el-menu-item index="register" route="/register" style="float: right">Register</el-menu-item>
        <el-menu-item index="login" route="/login" style="float: right">Login</el-menu-item>
    </el-menu>
</template>

<script>
    export default {
        name: "guest-header"
    }
</script>

<style scoped>

</style>