<template>
    <el-container>
        <el-aside :width="this.$store.state['sidebar_collapse'] === true ? '64px' : '200px'">
            <router-view name="sidebar"></router-view>
        </el-aside>
        <el-container>
            <el-header style="padding: 1px">
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

</style>