import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    TouchableOpacity
} from 'react-native';
import { AuthLayout } from '../';
import { FONTS, SIZES, COLORS, icons } from '../../constants';
import { FormInput, TextButton } from '../../components';
import axios from 'axios';
import { utils } from '../../utils';
import { BASE_URL } from '../../config';
import * as Keychain from 'react-native-keychain';

const ChangePassword = ({ navigation, route }) => {

    const [commonError, setCommonError] = useState("");
    const [commonErrorMb, setCommonErrorMb] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPass, setShowPass] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [showPassConfirm, setShowPassConfirm] = useState(false);
    
    useEffect(() => { 
        const unsubscribe = navigation.addListener('focus', async () => {
            const credentials = await Keychain.getGenericPassword({ service: 'view-s-token' });
            if (credentials && credentials.username && credentials.password) {
                navigation.goBack();
            }
        });
        return unsubscribe;
    }, [navigation]);

    const isEnabledSignIn = () => {
        return password != "" && passwordError == "" && confirmPassword != "" && confirmPasswordError == "" && commonErrorMb == ""
    }

    const handleChangePassword = async () => {
        if (password != confirmPassword) {
            setCommonErrorMb("Password & confirm password doesn't match");
            return;
        }
        try {
            setIsLoading(true);
            const response = await axios.post(`${BASE_URL}/reset/password/change/mb`, { id: route.params.user_id, password: password });
            setIsLoading(false);
            Alert.alert('Password Change', 'Password changed successfully.');
            navigation.navigate('SignIn');
        } catch (error) {
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoading(false);
                Alert.alert('Password Change', error.response.data.msg);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoading(false);
            }
        }
    }

    return (
        <AuthLayout
            title={"Change password"}
            subTitle={""}
            titleContainerStyle= {{
                marginTop: SIZES.padding * 2
            }}
            navigation={navigation}
            isLoading={isLoading}
            isHeader={true}
        >
            <View
                style={{
                    flex: 1,
                    marginTop: SIZES.padding * 2,

                }}
            >
                <FormInput 
                    label="Password"
                    secureTextEntry={!showPass}
                    autoCompleteType="password" 
                    containerStyle={{
                        marginTop: SIZES.radius
                    }}
                    value={password}
                    errorMsg={passwordError}
                    onChange={(value) => {
                        utils.validatePassword(value, setPasswordError)
                        setPassword(value)
                        setCommonErrorMb("")
                    }}
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
                <FormInput 
                    label="Confirm Password"
                    secureTextEntry={!showPassConfirm}
                    autoCompleteType="password" 
                    containerStyle={{
                        marginTop: SIZES.radius
                    }}
                    value={confirmPassword}
                    errorMsg={confirmPasswordError}
                    onChange={(value) => {
                        utils.validatePassword(value, setConfirmPasswordError)
                        setConfirmPassword(value)
                        setCommonErrorMb("")
                    }}
                    appendComponent={
                        <TouchableOpacity
                            style={{
                                justifyContent: 'center',
                                width: 40,
                                alignItems: 'flex-end'
                            }}
                            onPress={() => setShowPassConfirm(!showPassConfirm)}
                        >
                            <Image 
                                source={showPassConfirm ? icons.eye_close: icons.eye}
                                style={{
                                    height: 20,
                                    width: 20,
                                    tintColor: COLORS.gray
                                }}
                            />
                        </TouchableOpacity>
                    }
                />
                {   commonErrorMb ? <Text 
                        style={{
                            color: COLORS.red,
                            ...FONTS.body4,
                            marginTop: SIZES.base,
                            textAlign: 'center'
                        }}
                    >
                        {commonErrorMb}
                    </Text> : null
                }
                <TextButton 
                    label={'Change Password'}
                    diabled={isEnabledSignIn() ? false : true }
                    buttonContainerStyle={{
                        height: 50,
                        alignItems: 'center',
                        marginTop: SIZES.padding,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.primary,
                        backgroundColor: isEnabledSignIn() ? COLORS.primary : COLORS.transparentPrimary 
                    }}
                    onPress={()=> handleChangePassword()}
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

export default ChangePassword;