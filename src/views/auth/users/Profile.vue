<template>
    <el-main>
        <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="20">
                <el-row style="padding: 10px 0;">
                    <el-card class="profile-card">
                        <div class="image-overlay">
                            <img :src="details.image === null ? base_url + 'images/user-avatar.png' : details.image" class="image">
                            <el-form>
                                <el-tooltip content="Click to update image" placement="right" effect="light">
                                    <el-button type="primary" class="image-overlay-content" circle>
                                        <el-input type="file" id="profile-image-file" class="input-file" v-model="files.profile"></el-input>
                                        <label for="profile-image-file"><i class="el-icon-edit"></i></label>
                                    </el-button>
                                </el-tooltip>
                            </el-form>
                        </div>
                        <div class="content">
                            <span>{{forms.profile.first_name + ' ' + forms.profile.last_name}}</span>
                            <br>
                            <small>{{forms.profile.email}}</small>
                            <div class="bottom clearfix">
                                <time class="time">Joined at {{details.date_added}}</time>
                                <br>
                                <time class="time">Last Seen at {{details.last_seen}}</time>
                            </div>
                        </div>
                    </el-card>
                </el-row>
            </el-col>
            <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="20">
                <el-row style="padding: 10px 0;">
                    <el-col :span="24">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>Update Details</span>
                            </div>
                            <el-form v-on:submit.prevent.native="updateProfile('forms.profile')" :label-position="label.position" :model="forms.profile" ref="forms.profile" :rules="rules.profile">
                                <el-row :gutter="20">
                                    <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <el-form-item prop="first_name" label="First Name" :error="errors.profile.hasOwnProperty('first_name') ? errors.profile.first_name : ''">
                                            <el-input v-model="forms.profile.first_name" clearable type="text"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <el-form-item prop="last_name" label="Last Name" :error="errors.profile.hasOwnProperty('last_name') ? errors.profile.last_name : ''">
                                            <el-input v-model="forms.profile.last_name" clearable type="text"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item prop="email" label="Email" :error="errors.profile.hasOwnProperty('email') ? errors.profile.email : ''">
                                    <el-input v-model="forms.profile.email" clearable type="email"></el-input>
                                </el-form-item>
                                <el-button :loading="loading.profile" native-type="submit" plain type="primary">Submit</el-button>
                            </el-form>
                        </el-card>
                    </el-col>
                </el-row>
                <el-row style="padding: 10px 0;">
                    <el-col :span="24">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>Change Password</span>
                            </div>
                            <el-form v-on:submit.prevent.native="changePassword('forms.password')" :label-position="label.position" :model="forms.password" ref="forms.password" :rules="rules.password">
                                <el-form-item prop="current_password" label="Current Password" :error="errors.password.hasOwnProperty('current_password') ? errors.password.current_password : ''">
                                    <el-input v-model="forms.password.current_password" clearable type="password" show-password></el-input>
                                </el-form-item>
                                <el-form-item prop="password" label="New Password" :error="errors.password.hasOwnProperty('password') ? errors.password.password : ''">
                                    <el-input v-model="forms.password.password" clearable type="password" show-password></el-input>
                                </el-form-item>
                                <el-form-item prop="password_confirmation" label="Confirm Password" :error="errors.password.hasOwnProperty('password_confirmation') ? errors.password.password_confirmation : ''">
                                    <el-input v-model="forms.password.password_confirmation" clearable type="password" show-password></el-input>
                                </el-form-item>
                                <el-button :loading="loading.password" native-type="submit" plain type="primary">Change</el-button>
                            </el-form>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </el-main>
</template>

<script>
    import {
        INIT_FETCH_AUTH_USER,
        INIT_UPDATE_AUTH_USER_PASSWORD,
        INIT_UPDATE_AUTH_USER_PROFILE
    } from "../../../store/types";

    export default {
        name: "users-profile",
        data: function () {
            let validatePasswordConfirmation = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('The confirm password field is required'));
                } else if (value !== this.forms.password.password) {
                    callback(new Error('The password field and confirm password field must match'));
                } else {
                    callback();
                }
            };

            return {
                base_url: process.env.BASE_URL,
                loading: {
                    profile: false,
                    password: false
                },
                label: {
                    position: 'top'
                },
                details: {},
                files: {
                    profile: ''
                },
                forms: {
                    profile: {
                        first_name: '',
                        last_name: '',
                        email: '',
                        image_select: ''
                    },
                    password: {
                        current_password: '',
                        password: '',
                        password_confirmation: ''
                    }
                },
                rules: {
                    profile: {
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
                    password: {
                        current_password: [
                            {required: true, message: 'The current password field is required', trigger: 'blur'},
                            {min: 6, max: 255, message: 'The current password must be at least 6 characters', trigger: 'blur'}
                        ],
                        password: [
                            {required: true, message: 'The password field is required', trigger: 'blur'},
                            {min: 6, max: 255, message: 'The password must be at least 6 characters', trigger: 'blur'}
                        ],
                        password_confirmation: [
                            {validator: validatePasswordConfirmation, trigger: 'blur'},
                        ]
                    }
                },
                errors: {
                    profile: {},
                    password: {}
                }
            }
        },
        methods: {
            fetchAuthUser: function() {
                return this.$store.dispatch(INIT_FETCH_AUTH_USER).then(response => {
                    this.details = response.data;
                    this.forms.profile.first_name = response.data.name.split(' ')[0];
                    this.forms.profile.last_name = response.data.name.split(' ')[1];
                    this.forms.profile.email = response.data.email;
                });
            },
            updateProfile: function (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.loading.profile = true;
                        return this.$store.dispatch(INIT_UPDATE_AUTH_USER_PROFILE, this.forms.profile).then(response => {
                            this.loading.profile = false;
                            this.$message({
                                type: response.status,
                                showClose: true,
                                duration: 10000,
                                message: response.message,
                            });

                            this.fetchAuthUser();
                        }).catch(error => {
                            this.loading.profile = false;
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
                                    that.errors.profile[element.field] = element.error;
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
            },
            changePassword: function (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.loading.password = true;
                        return this.$store.dispatch(INIT_UPDATE_AUTH_USER_PASSWORD, this.forms.password).then(response => {
                            this.loading.password = false;
                            this.$message({
                                type: response.status,
                                showClose: true,
                                duration: 10000,
                                message: response.message,
                            });
                        }).catch(error => {
                            this.loading.password = false;
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
                                    that.errors.password[element.field] = element.error;
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
            },
            validateFileType: function(file) {
                let fileTypes = [
                    'image/jpeg',
                    'image/pjpeg',
                    'image/png'
                ];

                for(let i = 0; i < fileTypes.length; i++)
                {
                    if(file.type === fileTypes[i])
                    {
                        return true;
                    }
                }

                return false;
            }
        },
        watch: {
            'files.profile': {
                handler() {
                    let file = document.getElementById('profile-image-file').files[0];
                    if (this.validateFileType(file)) {
                        let that = this;
                        let reader = new FileReader();

                        reader.onload = function (e) {
                            that.details.image = e.target.result;
                            that.forms.profile.image_select = e.target.result;

                            return that.$store.dispatch(INIT_UPDATE_AUTH_USER_PROFILE, that.forms.profile).then(() => {
                                that.$message({
                                    type: 'success',
                                    showClose: true,
                                    duration: 10000,
                                    message: 'Successfully updated your profile image',
                                });
                            });
                        };
                        reader.readAsDataURL(file);
                    }  else {
                        this.$message({
                            type: 'error',
                            showClose: true,
                            duration: 10000,
                            message: 'The image selected should be jpg or png',
                        });
                    }
                },
                deep: true
            }
        },
        mounted: function () {
            this.fetchAuthUser();
        }
    }
</script>

<style scoped>
    .profile-card .image-overlay {
        position: relative;
        text-align: center;
    }
    .profile-card .image-overlay-content {
        transition: .5s ease;
        opacity: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
    }
    .profile-card .image-overlay:hover .image-overlay-content {
        opacity: 1;
    }
    .profile-card .image-overlay .image {
        width: 200px;
        height: 200px;
        object-fit: cover;
        border-radius: 50%;
        transition: .5s ease;
        backface-visibility: hidden;
    }
    .profile-card .image-overlay:hover .image {
        opacity: 0.3;
    }
    .profile-card .content {
        padding: 14px;
        text-align: center;
    }
    .profile-card .bottom {
        margin-top: 10px;
    }
    .profile-card .time {
        font-size: 14px;
        color: #999;
    }
    .input-file {
        cursor: pointer;
        display: block;
        height: 100%;
        left: 0;
        opacity: 0 !important;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: -1;
    }
    .input-file + label {
        font-size: inherit;
        font-weight: inherit;
        color: white;
        display: inline-block;
        cursor: pointer;
    }
</style>