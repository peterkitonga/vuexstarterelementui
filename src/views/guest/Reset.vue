<template>
    <el-main>
        <el-row type="flex" justify="center">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="20">
                <el-card class="box-card" style="height: auto">
                    <div slot="header" class="clearfix" style="text-align: center">
                        <span>Reset Password</span>
                    </div>
                    <el-form v-on:submit.prevent.native="submit('forms.reset')" :label-position="label.position" :model="forms.reset" ref="forms.reset" :rules="rules">
                        <el-form-item prop="password" label="New Password" :error="errors.reset.hasOwnProperty('password') ? errors.reset.password : ''">
                            <el-input v-model="forms.reset.password" clearable type="password" show-password></el-input>
                        </el-form-item>
                        <el-form-item prop="password_confirmation" label="Confirm Password" :error="errors.reset.hasOwnProperty('password_confirmation') ? errors.reset.password_confirmation : ''">
                            <el-input v-model="forms.reset.password_confirmation" clearable type="password" show-password></el-input>
                        </el-form-item>
                        <el-button :loading="loading.reset" native-type="submit" plain type="primary">Reset</el-button>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </el-main>
</template>

<script>
    import {INIT_RESET_AUTH_PASSWORD} from "../../store/types";

    export default {
        name: "guest-reset",
        data: function () {
            let validatePasswordConfirmation = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('The confirm password field is required'));
                } else if (value !== this.forms.reset.password) {
                    callback(new Error('The password field and confirm password field must match'));
                } else {
                    callback();
                }
            };

            return {
                loading: {
                    reset: false
                },
                label: {
                    position: 'top'
                },
                forms: {
                    reset: {
                        token: '',
                        password: '',
                        password_confirmation: '',
                    }
                },
                rules: {
                    password: [
                        {required: true, message: 'The password field is required', trigger: 'blur'},
                        {min: 6, max: 255, message: 'The password must be at least 6 characters', trigger: 'blur'}
                    ],
                    password_confirmation: [
                        {validator: validatePasswordConfirmation, trigger: 'blur'},
                    ]
                },
                errors: {
                    reset: {}
                }
            }
        },
        computed: {
            resetToken: function () {
                return this.$route.params['token'];
            }
        },
        methods: {
            submit: function(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.loading.reset = true;
                        return this.$store.dispatch(INIT_RESET_AUTH_PASSWORD, this.forms.reset).then(response => {
                            this.loading.reset = false;

                            this.$message({
                                showClose: true,
                                duration: 10000,
                                message: response.message,
                                type: response.status
                            });

                            this.$router.push({name: 'login'});
                        }).catch(error => {
                            this.loading.reset = false;
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
                                    that.errors.reset[element.field] = element.error;
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
            this.forms.reset.token = this.resetToken;
        }
    }
</script>

<style scoped>

</style>