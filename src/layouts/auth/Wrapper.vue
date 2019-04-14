<template>
    <el-container class="custom-container">
        <el-aside width="200px">
            <router-view name="sidebar"></router-view>
        </el-aside>
        <el-container>
            <el-header class="no-padding">
                <router-view name="header"></router-view>
            </el-header>
            <router-view/>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "auth-wrapper"
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