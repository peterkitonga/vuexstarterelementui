<template>
    <el-main>
        <el-row style="padding: 10px 0;">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-card>
                    <div slot="header" class="clearfix">
                        <span>Users</span>
                        <el-form v-on:submit.prevent.native="handleFilterUsersTableData('forms.users.search')" :inline="true" :model="forms.users.search" ref="forms.users.search" :rules="rules.users.search" size="mini" style="float: right;">
                            <el-form-item prop="value">
                                <el-input v-model="forms.users.search.value" clearable :placeholder="'Search by ' + searchValueLabel" class="input-with-select" @clear="handleResetUsersTableData">
                                    <el-select v-model="forms.users.search.column" value="forms.users.search.column" placeholder="Select" slot="append">
                                        <el-option v-for="item in options.search" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                                    </el-select>
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button :loading="loading.users.search" type="primary" native-type="submit" icon="el-icon-search" circle plain></el-button>
                                <el-button type="success" v-on:click="toggleAddUserDialog" plain><i class="el-icon-circle-plus-outline"></i> New</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-table v-loading="loading.tables.users" :data="tables.users.data" :default-sort="{prop: tables.users.sort.column, order: tables.users.sort.direction}" style="width: 100%">
                        <el-table-column prop="name" label="Name" width="180" sortable></el-table-column>
                        <el-table-column prop="email" label="Email" width="auto" sortable></el-table-column>
                        <el-table-column prop="role" label="Role" width="110" sortable></el-table-column>
                        <el-table-column prop="is_active" label="Active" width="70">
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.is_active === false ? 'primary' : 'success'" disable-transitions>
                                    {{scope.row.is_active}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="is_logged_in" label="Online" width="70">
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.is_logged_in === false ? 'primary' : 'success'" disable-transitions>
                                    {{scope.row.is_logged_in}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date_added" label="Date Added" width="150" sortable></el-table-column>
                        <el-table-column label="Actions" width="70">
                            <template slot-scope="scope">
                                <el-dropdown trigger="click" size="small" @command="handleCommands">
                                    <el-button size="mini" circle>
                                        <i class="el-icon-more-outline"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item :command="{method: 'toggleEditUserDialog', params: scope.row}">Edit</el-dropdown-item>
                                        <el-dropdown-item :disabled="scope.row.id === authUser.id || scope.row.is_logged_in === true" :command="{method: 'toggleEditUserRoleDialog', params: scope.row}">Reassign Role</el-dropdown-item>
                                        <el-dropdown-item v-if="scope.row.is_deactivated === true" :disabled="scope.row.id === authUser.id || scope.row.is_logged_in === true" :command="{method: 'toggleReactivateConfirmation', params: scope.row}">Reactivate</el-dropdown-item>
                                        <el-dropdown-item v-if="scope.row.is_deactivated === false" :disabled="scope.row.id === authUser.id || scope.row.is_logged_in === true" :command="{method: 'toggleDeactivateConfirmation', params: scope.row}">Deactivate</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination layout="total, sizes, prev, pager, next" style="float: right;"
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
            <el-dialog title="Add User" :visible.sync="dialogs.users.add">
                <el-form :label-position="label.position" :model="forms.users.add" ref="forms.users.add" :rules="rules.users.add">
                    <el-row :gutter="20">
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <el-form-item prop="first_name" label="First Name" :error="errors.users.add.hasOwnProperty('first_name') ? errors.users.add.first_name : ''">
                                <el-input v-model="forms.users.add.first_name" clearable type="text"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <el-form-item prop="last_name" label="Last Name" :error="errors.users.add.hasOwnProperty('last_name') ? errors.users.add.last_name : ''">
                                <el-input v-model="forms.users.add.last_name" clearable type="text"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item prop="email" label="Email" :error="errors.users.add.hasOwnProperty('email') ? errors.users.add.email : ''">
                        <el-input v-model="forms.users.add.email" clearable type="email"></el-input>
                    </el-form-item>
                    <el-form-item prop="role_select" label="Role" :error="errors.users.add.hasOwnProperty('role_select') ? errors.users.add.role_select : ''">
                        <el-select v-model="forms.users.add.role_select" value="forms.users.add.role_select" clearable placeholder="Select user role">
                            <el-option v-for="item in options.roles" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-on:click="dialogs.users.add = false">Cancel</el-button>
                    <el-button :loading="loading.users.add" type="primary" v-on:click="addNewUser('forms.users.add')" plain>Confirm</el-button>
                </span>
            </el-dialog>

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
                    <el-button v-on:click="dialogs.users.edit = false">Cancel</el-button>
                    <el-button :loading="loading.users.edit" type="primary" v-on:click="updateUserDetails('forms.users.edit')" plain>Confirm</el-button>
                </span>
            </el-dialog>

            <el-dialog title="Reassign Role" :visible.sync="dialogs.users.role">
                <el-form :label-position="label.position" :model="forms.users.role" ref="forms.users.role" :rules="rules.users.role">
                    <el-form-item prop="role_select" label="Role" :error="errors.users.role.hasOwnProperty('role_select') ? errors.users.role.role_select : ''">
                        <el-select v-model="forms.users.role.role_select" value="forms.users.role.role_select" clearable placeholder="Select user role">
                            <el-option v-for="item in options.roles" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-on:click="dialogs.users.role = false">Cancel</el-button>
                    <el-button :loading="loading.users.role" type="primary" v-on:click="updateUserRole('forms.users.role')" plain>Confirm</el-button>
                </span>
            </el-dialog>
        </el-row>
    </el-main>
</template>

<script>
    import {
        GET_AUTH_OBJECT,
        GET_ALL_USERS,
        INIT_FETCH_ALL_USERS,
        INIT_FETCH_PAGINATED_USERS,
        INIT_FETCH_ALL_USER_ROLES,
        INIT_STORE_USER,
        INIT_UPDATE_USER,
        INIT_UPDATE_USER_ROLE,
        INIT_UPDATE_USER_ACTIVE_STATUS
    } from "../../../store/types";

    export default {
        name: "users-index",
        data: function () {
            return {
                loading: {
                    users: {
                        add: false,
                        edit: false,
                        role: false,
                        search: false,
                        delete: false
                    },
                    tables: {
                        users: false
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
                            role_select: 0,
                        },
                        edit: {
                            user_id: 0,
                            first_name: '',
                            last_name: '',
                            email: '',
                        },
                        role: {
                            user_id: 0,
                            role_select: 0,
                        },
                        search: {
                            column: 'name',
                            value: ''
                        },
                    }
                },
                options: {
                    roles: [
                        {
                            value: 0,
                            label: 'Select an option',
                            disabled: true
                        }
                    ],
                    search: [
                        {
                            value: 'name',
                            label: 'Name',
                            disabled: false
                        },
                        {
                            value: 'email',
                            label: 'Email',
                            disabled: false
                        },
                        {
                            value: 'date_added',
                            label: 'Date Added',
                            disabled: false
                        }
                    ]
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
                        },
                        role: {
                            role_select: [
                                {required: true, message: 'The role field is required', trigger: 'blur'},
                            ]
                        },
                        search: {
                            value: [
                                {required: true, message: 'The search value field is required', trigger: 'blur'}
                            ]
                        }
                    }
                },
                tables: {
                    users: {
                        data: [],
                        sort: {
                            column: 'date_added',
                            direction: 'descending'
                        },
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
                        add: {},
                        edit: {},
                        role: {},
                    }
                },
                dialogs: {
                    users: {
                        add: false,
                        edit: false,
                        role: false,
                        deactivate: false,
                        reactivate: false
                    }
                }
            }
        },
        computed: {
            authUser: function () {
                return this.$store.getters[GET_AUTH_OBJECT];
            },
            searchValueLabel: function () {
                let value = this.forms.users.search.column;
                let option = this.options.search.find(function (element) {
                    return element.value === value;
                });

                return option['label'];
            },
            sortDirectionShort: function () {
                return this.tables.users.sort.direction === 'descending' ? 'desc' : 'asc';
            }
        },
        methods: {
            fetchUsers: function () {
                this.loading.tables.users = true;
                this.loading.users.search = true;

                return this.$store.dispatch(INIT_FETCH_PAGINATED_USERS, {page: this.tables.users.pagination.current_page, limit: this.tables.users.pagination.per_page, sort: btoa(JSON.stringify({column: this.tables.users.sort.column, direction: this.sortDirectionShort}))}).then(response => {
                    this.loading.tables.users = false;
                    this.loading.users.search = false;
                    this.tables.users.data = response.data;
                    this.tables.users.pagination.to = parseInt(response.meta.to);
                    this.tables.users.pagination.from = parseInt(response.meta.from);
                    this.tables.users.pagination.total = parseInt(response.meta.total);
                    this.tables.users.pagination.per_page = parseInt(response.meta.per_page);
                    this.tables.users.pagination.current_page = parseInt(response.meta.current_page);
                });
            },
            filterUsers: function () {
                this.loading.users.search = true;
                this.loading.tables.users = true;

                return this.$store.dispatch(INIT_FETCH_PAGINATED_USERS, {page: this.tables.users.pagination.current_page, limit: this.tables.users.pagination.per_page, search: btoa(JSON.stringify(this.forms.users.search)), sort: btoa(JSON.stringify({column: this.tables.users.sort.column, direction: this.sortDirectionShort}))}).then(response => {
                    this.loading.users.search = false;
                    this.loading.tables.users = false;
                    this.tables.users.data = response.data;
                    this.tables.users.pagination.to = parseInt(response.meta.to);
                    this.tables.users.pagination.from = parseInt(response.meta.from);
                    this.tables.users.pagination.total = parseInt(response.meta.total);
                    this.tables.users.pagination.per_page = parseInt(response.meta.per_page);
                    this.tables.users.pagination.current_page = parseInt(response.meta.current_page);
                });
            },
            fetchUserRoles: function() {
                return this.$store.dispatch(INIT_FETCH_ALL_USER_ROLES).then(response => {
                    let that = this;
                    response.data.forEach(function (element) {
                        that.options.roles.push({
                            value: element.id,
                            label: element.name,
                            disabled: false
                        });
                    });
                });
            },
            handleUsersCurrentPageChange: function(val) {
                this.tables.users.pagination.current_page = val;

                if (this.forms.users.search.value === '') {
                    this.fetchUsers();
                } else {
                    this.filterUsers();
                }
            },
            handleUsersPageSizeChange: function (val) {
                this.tables.users.pagination.per_page = val;

                if (this.forms.users.search.value === '') {
                    this.fetchUsers();
                } else {
                    this.filterUsers();
                }
            },
            handleCommands: function (command) {
                this[command.method](command.params);
            },
            handleFilterUsersTableData: function (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.tables.users.pagination.current_page = 1;

                        this.filterUsers();
                    } else {
                        return this.$message({
                            type: 'error',
                            showClose: true,
                            duration: 10000,
                            message: 'Something\'s not right. Please check your inputs',
                        });
                    }
                });
            },
            handleResetUsersTableData: function () {
                this.tables.users.pagination.to = 0;
                this.tables.users.pagination.from = 0;
                this.tables.users.pagination.total = 0;
                this.tables.users.pagination.per_page = 10;
                this.tables.users.pagination.current_page = 1;

                this.fetchUsers();
            },
            toggleAddUserDialog: function () {
                this.dialogs.users.add = true;
            },
            toggleEditUserDialog: function (params) {
                this.forms.users.edit.user_id = params.id;
                this.forms.users.edit.first_name = params.name.split(' ')[0];
                this.forms.users.edit.last_name = params.name.split(' ')[1];
                this.forms.users.edit.email = params.email;
                this.dialogs.users.edit = true;
            },
            toggleEditUserRoleDialog: function (params) {
                let currentRole = this.options.roles.find(function (element) {
                    return element.label === params.role.charAt(0).toUpperCase() + params.role.slice(1);
                });
                this.forms.users.role.user_id = params.id;
                this.forms.users.role.role_select = currentRole.value;
                this.dialogs.users.role = true;
            },
            toggleReactivateConfirmation: function (params) {
                return this.$confirm(`Are you sure you want to reactivate ${params.name}?`, 'Confirm', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    type: 'info'
                }).then(() => {
                    this.$store.dispatch(INIT_UPDATE_USER_ACTIVE_STATUS, {action: 'reactivate', user_id: params.id}).then(response => {
                        this.$message({
                            type: response.status,
                            showClose: true,
                            duration: 10000,
                            message: response.message,
                        });

                        this.fetchUsers();
                    }).catch(error => {
                        this.$message({
                            type: 'error',
                            showClose: true,
                            duration: 10000,
                            message: error.data.message,
                        });
                    });
                });
            },
            toggleDeactivateConfirmation: function (params) {
                return this.$confirm(`Are you sure you want to deactivate ${params.name}?`, 'Warning', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch(INIT_UPDATE_USER_ACTIVE_STATUS, {action: 'deactivate', user_id: params.id}).then(response => {
                        this.$message({
                            type: response.status,
                            showClose: true,
                            duration: 10000,
                            message: response.message,
                        });

                        this.fetchUsers();
                    }).catch(error => {
                        this.$message({
                            type: 'error',
                            showClose: true,
                            duration: 10000,
                            message: error.data.message,
                        });
                    });
                });
            },
            addNewUser: function (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.loading.users.add = true;
                        return this.$store.dispatch(INIT_STORE_USER, this.forms.users.add).then(response => {
                            this.loading.users.add = false;
                            this.dialogs.users.add = false;
                            this.forms.users.add.first_name = '';
                            this.forms.users.add.last_name = '';
                            this.forms.users.add.email = '';
                            this.forms.users.add.role_select = 0;

                            this.$message({
                                type: response.status,
                                showClose: true,
                                duration: 10000,
                                message: response.message,
                            });

                            this.fetchUsers();
                        }).catch(error => {
                            this.loading.users.add = false;
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
                                    that.errors.users.add[element.field] = element.error;
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
            },
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
            },
            updateUserRole: function (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.loading.users.role = true;
                        return this.$store.dispatch(INIT_UPDATE_USER_ROLE, this.forms.users.role).then(response => {
                            this.loading.users.role = false;
                            this.dialogs.users.role = false;

                            this.$message({
                                type: response.status,
                                showClose: true,
                                duration: 10000,
                                message: response.message,
                            });

                            this.fetchUsers();
                        }).catch(error => {
                            this.loading.users.role = false;
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
                                    that.errors.users.role[element.field] = element.error;
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
            this.fetchUserRoles();
        }
    }
</script>

<style scoped>

</style>