<template>
    <el-main>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-card>
                    <div slot="header" class="clearfix">
                        <span>Users</span>
                        <el-button style="float: right; padding: 3px 0" type="text">Add User</el-button>
                    </div>
                    <el-table :data="tables.users.data" :default-sort = "{prop: tables.users.sort.default.column, order: tables.users.sort.default.direction}" style="width: 100%">
                        <el-table-column prop="name" label="Name" sortable></el-table-column>
                        <el-table-column prop="email" label="Email" sortable></el-table-column>
                        <el-table-column prop="is_logged_in" label="Online">
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.is_logged_in === false ? 'primary' : 'success'" disable-transitions>
                                    {{scope.row.is_logged_in}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date_added" label="Date Added" sortable></el-table-column>
                    </el-table>
                    <el-pagination
                            layout="prev, pager, next"
                            :total="tables.users.pagination.total"
                            :current-page="tables.users.pagination.current_page"
                            :page-size="tables.users.pagination.per_page"
                            @current-change="handleCurrentPageChange"
                            style="float: right;">
                    </el-pagination>
                </el-card>
            </el-col>
        </el-row>
    </el-main>
</template>

<script>
    import {INIT_FETCH_PAGINATED_USERS} from "../../../store/types";

    export default {
        name: "users-index",
        data: function () {
            return {
                loading: {
                    users: {
                        add: false,
                        edit: false,
                        delete: false
                    }
                },
                tables: {
                    users: {
                        data: [],
                        sort: {
                            default: {
                                column: 'date_added',
                                direction: 'descending'
                            }
                        },
                        search: '',
                        pagination: {
                            current_page: 1,
                            per_page: 10,
                            total: 0,
                            from: 0,
                            to: 0
                        }
                    }
                },
                dialogs: {
                    users: {
                        view: false
                    }
                }
            }
        },
        methods: {
            fetchUsers: function () {
                return this.$store.dispatch(INIT_FETCH_PAGINATED_USERS, {page: this.tables.users.pagination.current_page, limit: this.tables.users.pagination.per_page}).then(response => {
                    this.tables.users.data = response.data;
                    this.tables.users.pagination.to = parseInt(response.meta.to);
                    this.tables.users.pagination.from = parseInt(response.meta.from);
                    this.tables.users.pagination.total = parseInt(response.meta.total);
                    this.tables.users.pagination.per_page = parseInt(response.meta.per_page);
                    this.tables.users.pagination.current_page = parseInt(response.meta.current_page);
                })
            },
            handleCurrentPageChange: function(val) {
                this.tables.users.pagination.current_page = val;
                this.fetchUsers();
            },
        },
        mounted: function () {
            this.fetchUsers();
        }
    }
</script>

<style scoped>

</style>