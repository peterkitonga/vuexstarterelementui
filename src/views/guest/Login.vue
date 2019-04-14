<template>
    <el-main>
        <el-row type="flex" justify="center">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="20">
                <el-card class="box-card" style="height: auto">
                    <div slot="header" class="clearfix" style="text-align: center">
                        <span>Log In</span>
                    </div>
                    <el-form v-on:submit.prevent.native="submit('forms.login')" :label-position="label.position" :model="forms.login" ref="forms.login" :rules="rules">
                        <el-form-item prop="email" label="Email" :error="errors.login.hasOwnProperty('email') ? errors.login.email : ''">
                            <el-input v-model="forms.login.email" clearable type="email"></el-input>
                        </el-form-item>
                        <el-form-item prop="password" label="Password" :error="errors.login.hasOwnProperty('password') ? errors.login.password : ''">
                            <el-input v-model="forms.login.password" clearable type="password"></el-input>
                        </el-form-item>
                        <el-button :loading="loading.login" native-type="submit" plain type="primary">Log In</el-button>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </el-main>
</template>

<script>
    import {
        INIT_LOGIN_AUTH_USER
    } from "../../store/types";

    export default {
        name: "guest-login",
        data: function () {
            return {
                loading: {
                    login: false
                },
                label: {
                    position: 'left'
                },
                forms: {
                    login: {
                        email: '',
                        password: ''
                    }
                },
                rules: {
                    email: [
                        {required: true, message: 'The email field is required', trigger: 'blur'},
                        {type: 'email', message: 'The email field should be a valid email', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: 'The password field is required', trigger: 'blur'},
                        {min: 6, max: 255, message: 'The password must be at least 6 characters', trigger: 'blur'}
                    ]
                },
                errors: {
                    login: {}
                }
            }
        },
        methods: {
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.loading.login = true;
                        return this.$store.dispatch(INIT_LOGIN_AUTH_USER, this.forms.login).then(response => {
                            this.loading.login = false;
                            this.$message({
                                type: 'success',
                                showClose: true,
                                duration: 10000,
                                message: response.message,
                            });
                        }).catch(error => {
                            this.loading.login = false;
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
                                    that.errors.login[element.field] = element.error;
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
        }
    }
</script>

<style scoped>

</style>