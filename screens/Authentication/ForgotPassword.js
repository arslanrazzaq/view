import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    Alert
} from 'react-native';
import { AuthLayout } from '../';
import { FONTS, SIZES, COLORS, icons } from '../../constants';
import { FormInput, TextButton } from '../../components';
import axios from 'axios';
import { utils } from '../../utils';
import { BASE_URL } from '../../config';
import * as Keychain from 'react-native-keychain';


const ForgotPassword = ({ navigation }) => {

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [commonError, setCommonError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFACode, setIsFACode] = useState(true);

    const [FACode, setFACode] = useState("");
    const [FACodeError, setFACodeError] = useState("");

    useEffect(() => { 
        const unsubscribe = navigation.addListener('focus', async () => {
            const credentials = await Keychain.getGenericPassword({ service: 'lh-s-token' });
            if (credentials && credentials.username && credentials.password) {
                navigation.goBack();
            }
        });
        return unsubscribe;
    }, [navigation]);

    const isEnabledSignIn = () => {
        if (isFACode) {
            return email != "" && emailError == "" && email.trim().length > 0 
        } else {
            return email != "" && emailError == "" && FACode != "" && FACodeError == "" && FACode.trim().length > 0 && email.trim().length > 0 
        }
    }

    const handleForgotPassword = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${BASE_URL}/reset/password`, { email: email });
            setIsLoading(false);
            // setIsFACode(false);
            Alert.alert('Password Recovery', 'Reset password link sent to your email.');
        } catch (error) {
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoading(false);
                // setIsFACode(true);
                Alert.alert('Password Recovery', error.response.data.msg);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoading(false);
                // setIsFACode(true);
            }
        }
    }

    const handleForgotPasswordFA = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${BASE_URL}/reset/password/mb`, { email: email, FACode: FACode });
            setIsLoading(false);
            setIsFACode(false);
            navigation.navigate('ChangePassword', { user_id: response.data.user.id });
        } catch (error) {
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoading(false);
                setIsFACode(true);
                Alert.alert('Password Recovery', error.response.data.msg);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoading(false);
                setIsFACode(true);
            }
        }
    }

    return (
        <AuthLayout
            title={"Reset your password"}
            subTitle={"Tell us your email address. We will send you a code to reset your password"}
            titleContainerStyle= {{
                marginTop: SIZES.padding * 2
            }}
            navigation={navigation}
            isLoading={isLoading}
        >
            <View
                style={{
                    flex: 1,
                    marginTop: SIZES.padding * 2,

                }}
            >
                <FormInput 
                    label="Email"
                    keyboardType='email-address'
                    autoCompleteType="email"
                    editable={`${isFACode}`}
                    onChange={(value) => {
                        utils.validateEmail(value, setEmailError)
                        setEmail(value)
                    }}
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
                { !isFACode ?
                    <FormInput 
                        containerStyle={{
                            marginTop: SIZES.radius
                        }}
                        label="Verification Code"
                        keyboardType='number-pad'
                        autoCompleteType="off"
                        onChange={(value) => {
                            setFACode(value)
                        }}
                        value={FACode}
                        errorMsg={FACodeError}
                        appendComponent={
                            <View
                                style={{
                                    justifyContent: 'center'
                                }}
                            >
                                <Image 
                                    source={FACode == "" || (FACode != "" && FACodeError == "") ? icons.correct : icons.cancel}
                                    style={{
                                        height: 20,
                                        width: 20,
                                        tintColor: FACode == "" ? COLORS.gray : (FACode != "" && FACodeError == "") ? COLORS.green: COLORS.red,

                                    }}
                                />
                            </View>
                        }
                    /> 
                    : null 
                }
                <TextButton 
                    label={isFACode ? 'Send' : 'Continue'}
                    diabled={isEnabledSignIn() ? false : true }
                    buttonContainerStyle={{
                        height: 50,
                        alignItems: 'center',
                        marginTop: SIZES.padding,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.primary,
                        backgroundColor: isEnabledSignIn() ? COLORS.primary : COLORS.transparentPrimary 
                    }}
                    onPress={()=> { if (isFACode) { handleForgotPassword(); } else { handleForgotPasswordFA() } }}
                />
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

export default ForgotPassword;