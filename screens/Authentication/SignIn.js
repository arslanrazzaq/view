import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import { AuthLayout } from '../';
import { FONTS, SIZES, COLORS, icons } from '../../constants';
import { FormInput, TextButton } from '../../components';
import { utils } from '../../utils';
import axios from 'axios';
import { AuthContext } from '../../Context/authContext';
import { BASE_URL } from '../../config';
import * as Keychain from 'react-native-keychain';

const SignIn = ({ navigation, route }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [commonError, setCommonError] = useState("");

    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { userInfo, login } = useContext(AuthContext);

    const isEnabledSignIn = () => {
        return email != "" && password != "" && emailError == ""
    }

    useEffect(() => { 
        const unsubscribe = navigation.addListener('focus', async () => {
            const credentials = await Keychain.getGenericPassword({ service: 'lh-s-token' });
            if (credentials && credentials.username && credentials.password) {
                navigation.goBack();
            }
        });
        return unsubscribe;
    }, [navigation]);


    const loginUser = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${BASE_URL}/user/login`, {
                email: email,
                password: password,
                type: 'email'
            });
            setIsLoading(false);
            login(response.data.token, response.data.user);
            if (!response.data.user.gender || !response.data.user.dob ||!response.data.user.nationality) {
                navigation.navigate('SelectGender', { user_id: response.data.user.id, description: '', username: response.data.user.username, profile_pic: response.data.user.profile_pic });
            } else {
                if (route.params && route.params.navigateTo) {
                    navigation.push(`${route.params.navigateTo.screen}`, route.params.navigateTo.data);
                } else {
                    navigation.navigate('Home');
                }
            }
        } catch (error) {
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoading(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoading(false);
            }
        }
    }

    return (
        <AuthLayout
            title={"Sign in now"}
            subTitle={""}
            navigation={navigation}
            isLoading={isLoading}
        >
            <View
                style={{
                    flex: 1,
                    marginTop: SIZES.padding * 2
                }}
            >
                <FormInput 
                    label="Email"
                    keyboardType='email-address'
                    autoCompleteType="email"
                    onChange={(value) => {
                        utils.validateEmail(value, setEmailError)
                        setEmail(value)
                    }}
                    onFocus={() => setCommonError("")}
                    value={email}
                    errorMsg={emailError}
                    appendComponent={
                        <View
                            style={{
                                justifyContent: 'center'
                            }}
                        >
                            <Image 
                                source={email == "" || (email != "" && emailError == "") ? icons.correct : icons.cancel}
                                style={{
                                    height: 20,
                                    width: 20,
                                    tintColor: email == "" ? COLORS.gray : (email != "" && emailError == "") ? COLORS.green: COLORS.red,

                                }}
                            />
                        </View>
                    }
                />
                <FormInput 
                    label="Password"
                    secureTextEntry={!showPass}
                    autoCompleteType="password"
                    containerStyle={{
                        marginTop: SIZES.radius
                    }}
                    onChange={(value) => {
                        setPassword(value)
                    }}
                    onFocus={() => setCommonError("")}
                    value={password}
                    appendComponent={
                        <TouchableOpacity
                            style={{
                                justifyContent: 'center',
                                width: 40,
                                alignItems: 'flex-end'
                            }}
                            onPress={() => setShowPass(!showPass)}
                        >
                            <Image 
                                source={showPass ? icons.eye_close: icons.eye}
                                style={{
                                    height: 20,
                                    width: 20,
                                    tintColor: COLORS.gray
                                }}
                            />
                        </TouchableOpacity>
                    }
                />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        marginTop: SIZES.radius
                    }}
                >
                    <TextButton
                        label="Forgot Password?"
                        buttonContainerStyle={{
                            backgroundColor: null
                        }}
                        labelStyle={{
                            color: COLORS.gray,
                            ...FONTS.body4
                        }}
                        onPress={() => navigation.navigate("ForgotPassword")}
                    />
                </View>
                <TextButton 
                    label="Sign In"
                    disabled={isEnabledSignIn() ? false : true }
                    buttonContainerStyle={{
                        height: 55,
                        alignItems: 'center',
                        marginTop: SIZES.padding,
                        borderRadius: SIZES.radius,
                        backgroundColor: isEnabledSignIn() ? COLORS.primary : COLORS.transparentPrimary 
                    }}
                    onPress={() => loginUser()}
                />
                <View
                    style={{ 
                        flexDirection: 'row',
                        marginTop: SIZES.radius,
                        justifyContent: 'center'
                    }}
                >
                    <Text
                        style={{
                            color: COLORS.darkGray,
                            ...FONTS.body3
                        }}
                    >
                        Don't have an account?
                    </Text>
                    <TextButton 
                        label="Sign Up"
                        buttonContainerStyle={{
                            marginLeft: 3,
                            backgroundColor: null
                        }}
                        labelStyle={{
                            color: COLORS.primary,
                            ...FONTS.h3
                        }}
                        onPress={() => navigation.navigate("SignUp")}
                    />
                </View>
                {   commonError ? <Text 
                        style={{
                            color: COLORS.red,
                            ...FONTS.body4,
                            marginTop: SIZES.base,
                            textAlign: 'center'
                        }}
                    >
                        {commonError}
                    </Text> : null
                }
            </View>
           
        </AuthLayout>
    )
}

export default SignIn;