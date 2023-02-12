import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    SafeAreaView
} from 'react-native';
import { Header, IconButton, FormInput, TextButton } from '../../components';
import { FONTS, SIZES, COLORS, icons } from '../../constants';
import AnimatedLoader from "react-native-animated-loader";
import { utils } from '../../utils';
import axios from 'axios';
import { AuthContext } from '../../Context/authContext';
import { BASE_URL } from '../../config';

const Paypal = ({ navigation }) => {

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [commonError, setCommonError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { userInfo } = useContext(AuthContext);
    const [data, setData] = useState({});

    const isEnabledSignIn = () => {
        return email != "" && emailError == "" && userInfo.user && userInfo.user?.id
    }


    useEffect(() => { 
        checkPaypal();
    }, []);

    const checkPaypal = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/paypal/${userInfo.user?.id}/list`);
            setData(response.data.data);
            if (response.data.data) {
                setEmail(response.data.data.email);
            }
            setIsLoading(false);
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

    const renderHeader = () => {
        return (
            <Header
                title="My Email"
                containerStyle={{
                    height: 50,
                    marginHorizontal: SIZES.base,
                    marginTop: 0,
                }}
                leftComponent={
                    <IconButton
                        icon={icons.back}
                        containerStyle={{
                            width: 50,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderRadius: SIZES.radius,
                            borderColor: COLORS.gray2
                        }}
                        iconStyle={{
                            width: 30,
                            height: 20,
                            tintColor: COLORS.gray,
                        }}
                        onPress={() => navigation.goBack()}
                    />
                }
                rightComponent={null}
            />
        )
    }

    const handleConnectEmail = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${BASE_URL}/paypal/create`, {
                email: email,
                user_id: userInfo.user?.id
            });
            setIsLoading(false);
            navigation.navigate('Home');
        } catch (error) {
            console.log(error);
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
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}
        >
            <AnimatedLoader
                visible={isLoading}
                overlayColor="rgba(255,255,255,0.75)"
                source={require("../../constants/loader.json")}
                animationStyle={{
                    width: 300,
                    height: 300
                }}
                speed={1}
            />
           <SafeAreaView style={{ backgroundColor: COLORS.white }}>
                { renderHeader() }
            </SafeAreaView>
            <View
                style={{
                    marginHorizontal: SIZES.padding,
                    marginTop: SIZES.radius,
                    borderRadius: SIZES.radius,
                    flex: 1
                }}
            >
                <Text
                    style={{
                        color: COLORS.black,
                        ...FONTS.body2
                    }}
                >
                    My email address
                </Text>
                <View
                    style={{
                        marginTop: SIZES.radius,
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
                                        tintColor: email == "" ? COLORS.gray : (email != "" && emailError == "") ? COLORS.green : COLORS.red,
                                    }}
                                />
                            </View>
                        }
                    />
                </View>
                <TextButton
                    label="Submit"
                    disabled={isEnabledSignIn() ? false : true}
                    buttonContainerStyle={{
                        height: 55,
                        alignItems: 'center',
                        marginTop: SIZES.padding,
                        borderRadius: SIZES.radius,
                        backgroundColor: isEnabledSignIn() ? COLORS.primary : COLORS.transparentPrimary
                    }}
                    onPress={() => handleConnectEmail()}
                />
                {commonError ? <Text
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
        </View>
    )
}

const styles = StyleSheet.create({
    cartItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SIZES.radius,
        paddingHorizontal: SIZES.radius,
        borderRadius: SIZES.radius
    }
})

export default Paypal