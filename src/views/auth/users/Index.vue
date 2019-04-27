<template>
    <el-main>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-card>
                    <div slot="header" class="clearfix">
                        <span>Users</span>
                        <el-button style="float: right; padding: 3px 0" type="text"><i class="el-icon-circle-plus-outline"></i> New</el-button>
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
                        <el-table-column label="Actions">
                            <template slot-scope="scope">
                                <el-dropdown trigger="click" size="small" @command="handleCommands">
                                    <el-button size="mini" circle>
                                        <i class="el-icon-more-outline"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item :command="{method: 'toggleEditUserDialog', params: scope.row}">Edit</el-dropdown-item>
                                        <el-dropdown-item :command="{method: 'toggleEditUserRoleDialog', params: scope.row}">Reassign Role</el-dropdown-item>
                                        <el-dropdown-item v-if="scope.row.is_deactivated === true" :command="{method: 'toggleReactivateConfirmation', params: {id: scope.row.id}}">Reactivate</el-dropdown-item>
                                        <el-dropdown-item v-if="scope.row.is_deactivated === false" :command="{method: 'toggleDeactivateConfirmation', params: {id: scope.row.id}}">Deactivate</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination layout="sizes, prev, pager, next" style="float: right;"
                            :total="tables.users.pagination.total"
                            :current-page="tables.users.pagination.current_page"
                            :page-size="tables.users.pagination.per_page"
                            :page-sizes="[5, 10, 25, 50, 100, 200]"
                            @current-change="handleUsersCurrentPageChange"
                            @size-change="handleUsersPageSizeChange">
                    </el-pagination>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-dialog title="Edit User" :visible.sync="dialogs.users.edit">
                <el-form :label-position="label.position" :model="forms.users.edit" ref="forms.users.edit" :rules="rules.users.edit">
                    <el-row :gutter="20">
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <el-form-item prop="first_name" label="First Name" :error="errors.users.edit.hasOwnProperty('first_name') ? errors.users.edit.first_name : ''">
                                <el-input v-model="forms.users.edit.first_name" clearable type="text"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <el-form-item prop="last_name" label="Last Name" :error="errors.users.edit.hasOwnProperty('last_name') ? errors.users.edit.last_name : ''">
                                <el-input v-model="forms.users.edit.last_name" clearable type="text"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item prop="email" label="Email" :error="errors.users.edit.hasOwnProperty('email') ? errors.users.edit.email : ''">
                        <el-input v-model="forms.users.edit.email" clearable type="email"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogs.users.edit = false">Cancel</el-button>
                    <el-button :loading="loading.users.edit" type="primary" @click="updateUserDetails('forms.users.edit')">Confirm</el-button>
                </span>
            </el-dialog>
        </el-row>
    </el-main>
</template>

<script>
    import {INIT_FETCH_PAGINATED_USERS, INIT_UPDATE_USER} from "../../../store/types";

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
                label: {
                    position: 'top'
                },
                forms: {
                    users: {
                        add: {
                            first_name: '',
                            last_name: '',
                            email: '',
                        },
                        edit: {
                            user_id: 0,
                            first_name: '',
                            last_name: '',
                            email: '',
                        },
                    }
                },
                rules: {
                    users: {
                        add: {
                            first_name: [
                                {required: true, message: 'The first name field is required', trigger: 'blur'},
                            ],
                            last_name: [
                                {required: true, message: 'The last name field is required', trigger: 'blur'},
                            ],
                            email: [
                                {required: true, message: 'The email field is required', trigger: 'blur'},
                                {type: 'email', message: 'The email field should be a valid email', trigger: 'blur'}
                            ]
                        },
                        edit: {
                            first_name: [
                                {required: true, message: 'The first name field is required', trigger: 'blur'},
                            ],
                            last_name: [
                                {required: true, message: 'The last name field is required', trigger: 'blur'},
                            ],
                            email: [
                                {required: true, message: 'The email field is required', trigger: 'blur'},
                                {type: 'email', message: 'The email field should be a valid email', trigger: 'blur'}
                            ]
                        }
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
                errors: {
                    users: {
                        edit: {}
                    }
                },
                dialogs: {
                    users: {
                        edit: false,
                        role: false
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
            handleUsersCurrentPageChange: function(val) {
                this.tables.users.pagination.current_page = val;
                this.fetchUsers();
            },
            handleUsersPageSizeChange: function (val) {
                this.tables.users.pagination.per_page = val;
                this.fetchUsers();
            },
            handleCommands: function (command) {
                this[command.method](command.params);
            },
            toggleEditUserDialog: function (params) {
                this.forms.users.edit.user_id = params.id;
                this.forms.users.edit.first_name = params.name.split(' ')[0];
                this.forms.users.edit.last_name = params.name.split(' ')[1];
                this.forms.users.edit.email = params.email;
                this.dialogs.users.edit = true;
            },
            toggleEditUserRoleDialog: function () {},
            toggleReactivateConfirmation: function () {},
            toggleDeactivateConfirmation: function () {},
            updateUserDetails: function (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.loading.users.edit = true;
                        return this.$store.dispatch(INIT_UPDATE_USER, this.forms.users.edit).then(response => {
                            this.loading.users.edit = false;
                            this.dialogs.users.edit = false;

                            this.$message({
                                type: response.status,
                                showClose: true,
                                duration: 10000,
                                message: response.message,
                            });

                            this.fetchUsers();
                        }).catch(error => {
                            this.loading.users.edit = false;
                            let message = error.data.message;

                            if (message instanceof Array === false)
                            {
                                this.$message({
                                    type: 'error',
                                    showClose: true,
                                    duration: 10000,
                                    message: error.data.message,
                                });
                            } else {
                                let that = this;
                                message.forEach(function(element) {
                                    // clear validation for the field
                                    that.$refs[form].clearValidate(element.field);

                                    // pushes error messages from the response to the validator error bag
                                    that.errors.users.edit[element.field] = element.error;
                                });

                                this.$message({
                                    type: 'error',
                                    showClose: true,
                                    duration: 10000,
                                    message: 'Something\'s not right. Please check your inputs',
                                });
                            }
                        })
                    } else {
                        return this.$message({
                            type: 'error',
                            showClose: true,
                            duration: 10000,
                            message: 'Something\'s not right. Please check your inputs',
                        });
                    }
                });
            }
        },
        mounted: function () {
            this.fetchUsers();
        }
    }
</script>

<style scoped>

</style>