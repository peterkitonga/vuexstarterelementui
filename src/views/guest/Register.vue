<template>
    <el-main>
        <el-row type="flex" justify="center">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="20">
                <el-card class="box-card" style="height: auto">
                    <div slot="header" class="clearfix" style="text-align: center">
                        <span>Register</span>
                    </div>
                    <el-form v-on:submit.prevent.native="submit('forms.register')" :label-position="label.position" :model="forms.register" ref="forms.register" :rules="rules">
                        <el-row :gutter="20">
                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <el-form-item prop="first_name" label="First Name" :error="errors.register.hasOwnProperty('first_name') ? errors.register.first_name : ''">
                                    <el-input v-model="forms.register.first_name" clearable type="text"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <el-form-item prop="last_name" label="Last Name" :error="errors.register.hasOwnProperty('last_name') ? errors.register.last_name : ''">
                                    <el-input v-model="forms.register.last_name" clearable type="text"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item prop="email" label="Email" :error="errors.register.hasOwnProperty('email') ? errors.register.email : ''">
                            <el-input v-model="forms.register.email" clearable type="email"></el-input>
                        </el-form-item>
                        <el-form-item prop="password" label="Password" :error="errors.register.hasOwnProperty('password') ? errors.register.password : ''">
                            <el-input v-model="forms.register.password" clearable type="password"></el-input>
                        </el-form-item>
                        <el-form-item prop="password_confirmation" label="Confirm Password" :error="errors.register.hasOwnProperty('password_confirmation') ? errors.register.password_confirmation : ''">
                            <el-input v-model="forms.register.password_confirmation" clearable type="password"></el-input>
                        </el-form-item>
                        <el-button :loading="loading.register" native-type="submit" plain type="primary">Register</el-button>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </el-main>
</template>

<script>
    import {INIT_REGISTER_AUTH_USER} from "../../store/types";

    export default {
        name: "guest-register",
        data: function () {
            let validatePasswordConfirmation = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('The confirm password field is required'));
                } else if (value !== this.forms.register.password) {
                    callback(new Error('The password field and confirm password field must match'));
                } else {
                    callback();
                }
            };

            return {
                loading: {
                    register: false
                },
                label: {
                    position: 'top'
                },
                forms: {
                    register: {
                        first_name: '',
                        last_name: '',
                        email: '',
                        password: '',
                        password_confirmation: '',
                    }
                },
                rules: {
                    first_name: [
                        {required: true, message: 'The first name field is required', trigger: 'blur'},
                    ],
                    last_name: [
                        {required: true, message: 'The last name field is required', trigger: 'blur'},
                    ],
                    email: [
                        {required: true, message: 'The email field is required', trigger: 'blur'},
                        {type: 'email', message: 'The email field should be a valid email', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: 'The password field is required', trigger: 'blur'},
                        {min: 6, max: 255, message: 'The password must be at least 6 characters', trigger: 'blur'}
                    ],
                    password_confirmation: [
                        {validator: validatePasswordConfirmation, trigger: 'blur'},
                    ]
                },
                errors: {
                    register: {}
                }
            }
        },
        methods: {
            submit: function(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.loading.register = true;
                        return this.$store.dispatch(INIT_REGISTER_AUTH_USER, this.forms.register).then(response => {
                            this.loading.register = false;

                            this.$message({
                                type: response.status,
                                showClose: true,
                                duration: 10000,
                                message: response.message,
                            });

                            this.$router.push({name: 'login'});
                        }).catch(error => {
                            this.loading.register = false;
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
                                    that.errors.register[element.field] = element.error;
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
        }
    }
</script>

<style scoped>

</style>