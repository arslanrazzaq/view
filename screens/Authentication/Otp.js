import React, { useState, useEffect } from 'react';
import {
    View,
    Text
} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { AuthLayout } from '../';
import { FONTS, SIZES, COLORS } from '../../constants';
import { TextButton } from '../../components';
import * as Keychain from 'react-native-keychain';

const Otp = ({ navigation }) => {

    const [timer, setTimer] = useState(60);
    
    useEffect(()=> {
        let interval = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer > 0) {
                    return prevTimer - 1;
                } else {
                    return prevTimer;
                }
            })
        }, 1000) 

        return () => clearInterval(interval)
    }, []);

    // useEffect(() => { 
    //     const unsubscribe = navigation.addListener('focus', async () => {
    //         const credentials = await Keychain.getGenericPassword({ service: 'view-s-token' });
    //         if (credentials && credentials.username && credentials.password) {
    //             navigation.goBack();
    //         }
    //     });
    //     return unsubscribe;
    // }, [navigation]);

    return (
        <AuthLayout
            title={"OTP Authentication"}
            subTitle={"An authentication code has been sent to example@gmail.com"}
            titleContainerStyle= {{
                marginTop: SIZES.padding * 2
            }}
            navigation={navigation}
        >
            <View
                style={{
                    flex: 1,
                    marginTop: SIZES.padding * 2,

                }}
            >
                <OTPInputView 
                    pinCount={4}
                    style={{
                        width: '100%',
                        height: 50
                    }}
                    codeInputFieldStyle={{
                        width: 65,
                        height: 65,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.lightGray2,
                        color: COLORS.black,
                        ...FONTS.h3
                    }}
                    onCodeFilled={(code) => {
                        console.log(code)
                    }}
                />
                <View
                    style={{ 
                        flexDirection: 'row',
                        marginTop: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}
                >
                    <Text
                        style={{
                            color: COLORS.darkGray,
                            ...FONTS.body3
                        }}
                    >
                        Didn't receive code?
                    </Text>
                    <TextButton 
                        label={`Resend (${timer})s`}
                        buttonContainerStyle={{
                            marginLeft: 3,
                            backgroundColor: null
                        }}
                        labelStyle={{
                            color: COLORS.primary,
                            ...FONTS.h3
                        }}
                        onPress={() => setTimer(60)}
                    />
                </View>
            </View>
            <View>
                <TextButton 
                    label='Continue'
                    buttonContainerStyle={{
                        height: 50,
                        alignItems: 'center',
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.primary
                    }}
                    onPress={()=> console.log('continue')}
                />
                <View
                    style={{
                        marginTop: SIZES.padding,
                        alignItems: 'center'
                    }}
                >
                    <Text 
                        style={{
                            color: COLORS.darkGray,
                            ...FONTS.body3
                        }}
                    >
                        By signing up, you agree to our.
                    </Text>
                    <TextButton 
                        label='Terms and Conditions'
                        buttonContainerStyle={{
                            backgroundColor: null
                        }}
                        labelStyle={{
                            color: COLORS.primary,
                            ...FONTS.body3
                        }}
                        onPress={()=> console.log('continue')}
                    />
                </View>
            </View>
        </AuthLayout>
    )
}

export default Otp;