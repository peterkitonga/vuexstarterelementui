<template>
    <el-container class="custom-container">
        <el-header class="no-padding">
            <router-view name="header"></router-view>
        </el-header>
        <router-view></router-view>
    </el-container>
</template>

<script>
    export default {
        name: "guest-wrapper"
    }
</script>

<style scoped>
    .custom-container {
        height: 100%;
        width: 100%;
    }
    .no-padding{
        padding: 0
    }
</style>