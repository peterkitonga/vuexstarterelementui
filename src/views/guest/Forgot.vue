<template>
    <el-main>
        <el-row type="flex" justify="center">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="20">
                <el-card class="box-card" style="height: auto">
                    <div slot="header" class="clearfix" style="text-align: center">
                        <span>Forgot Password?</span>
                    </div>
                    <el-form v-on:submit.prevent.native="submit('forms.forgot')" :label-position="label.position" :model="forms.forgot" ref="forms.forgot" :rules="rules">
                        <el-form-item prop="email" label="Email" :error="errors.forgot.hasOwnProperty('email') ? errors.forgot.email : ''">
                            <el-input v-model="forms.forgot.email" clearable type="email"></el-input>
                        </el-form-item>
                        <el-button :loading="loading.forgot" native-type="submit" plain type="primary">Send Email</el-button>
                        <el-button type="text" v-on:click="$router.push({name: 'login'})">Back To Login <i class="el-icon-arrow-right el-icon-right"></i></el-button>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </el-main>
</template>

<script>
    import {INIT_SEND_RESET_AUTH_PASSWORD_LINK} from "../../store/types";

    export default {
        name: "guest-forgot",
        data: function () {
            return {
                loading: {
                    forgot: false
                },
                label: {
                    position: 'top'
                },
                forms: {
                    forgot: {
                        email: ''
                    }
                },
                errors: {
                    forgot: {}
                },
                rules: {
                    email: [
                        {required: true, message: 'The email field is required', trigger: 'blur'},
                        {type: 'email', message: 'The email field should be a valid email', trigger: 'blur'}
                    ]
                },
            }
        },
        methods: {
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.loading.forgot = true;
                        return this.$store.dispatch(INIT_SEND_RESET_AUTH_PASSWORD_LINK, this.forms.forgot).then(response => {
                            this.loading.forgot = false;
                            this.$message({
                                type: response.status,
                                showClose: true,
                                duration: 10000,
                                message: response.message,
                            });
                        }).catch(error => {
                            this.loading.forgot = false;
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
                                    that.errors.forgot[element.field] = element.error;
                                });

                                this.$message({
                                    type: 'error',
                                    showClose: true,
                                    duration: 10000,
                                    message: 'Something\'s not right. Please check your inputs',
                                });
                            }
                        });
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