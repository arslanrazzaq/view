import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    ImageBackground,
    TextInput
} from 'react-native';
import { Header, IconButton, FormInput, TextButton } from '../../components';
import { FONTS, SIZES, COLORS, icons, images } from '../../constants';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { AuthContext } from '../../Context/authContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const AddAccount = ({ navigation, route }) => {

    const [accountName, setAccountName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [commonError, setCommonError] = useState("");
    const [accountType, setAccountType] = useState('');

    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
        setAccountType(route.params.type);
    }, []);

    const renderHeader = () => {
        return (
            <Header
                title="Add Account"
                containerStyle={{
                    height: 50,
                    marginHorizontal: SIZES.base,
                    marginTop: 0,
                }}
                titleStyle={{
                    color: COLORS.white
                }}
                leftComponent={
                    <IconButton
                        icon={icons.cross}
                        containerStyle={{
                            width: 40,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderRadius: SIZES.radius,
                            borderColor: COLORS.white
                        }}
                        iconStyle={{
                            width: 30,
                            height: 20,
                            tintColor: COLORS.gold,
                        }}
                        onPress={() => navigation.goBack()}
                    />
                }
                rightComponent={
                    <IconButton 
                        containerStyle={{
                            width: 40,
                            height: 40
                        }}
                    />
                }
            />
        )
    }

    const isEnabledSignIn = () => {
        return accountName != ""
    }

    const handleAccountAdd = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${BASE_URL}/nfts/user/create`, {
                user_id: userInfo?.user?.id,
                username: accountName,
                type: accountType == 'PROTON' ? 'proton' : 'polygon'
            });
            setIsLoading(false);
            navigation.push('Home');
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
        <ImageBackground 
            source={images.background}
            style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}
        >
            <SafeAreaView>
                { renderHeader() }
            </SafeAreaView>
            <View
                style={{
                    marginHorizontal: SIZES.radius,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <KeyboardAwareScrollView
                    keyboardDismissMode="on-drag"
                    contentContainerStyle={{
                        flex: 1,
                        paddingHorizontal: SIZES.padding,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    enableOnAndroid={true}
                    enableAutomaticScroll={Platform.OS === 'ios'}
                    keyboardShouldPersistTaps={"handled"}
                    enableResetScrollToCoords={false}
                >
                    <Image
                        source={images.logo_02}
                        resizeMode='contain'
                        style={{
                            height: 250,
                            width: 250,
                            borderRadius: SIZES.radius,
                            marginBottom: SIZES.padding 
                        }}
                    />
                    {   
                        accountType == 'PROTON' ?
                            <Text
                                style={{
                                    color: COLORS.white,
                                    ...FONTS.body3,
                                    alignSelf: 'center'
                                }}
                            >
                                Add a PROTON account below to get started. Only enter your account name. No public or private keys are needed to track your accounts.
                            </Text>
                        :
                            <Text
                                style={{
                                    color: COLORS.white,
                                    ...FONTS.body3,
                                    alignSelf: 'center'
                                }}
                            >
                                Add a POLYGON account below to get started. Only enter your account hash address. No public or private keys are needed to track your accounts.
                            </Text>
                    }
                    <FormInput 
                        label=""
                        containerStyle={{
                            marginTop: SIZES.radius,
                        }}
                        inputContainerStyle={{
                            paddingHorizontal: SIZES.radius,
                            width: '100%'
                        }}
                        value={accountName}
                        onChange={(value) => {
                            setAccountName(value);
                        }}
                        placeholder={accountType == 'PROTON' ? `PROTON account name` : `POLYGON account hash address`}
                    />
                    <TextButton
                        label="Add Account"
                        disabled={isEnabledSignIn() ? false : true }
                        buttonContainerStyle={{
                            height: 55,
                            alignItems: 'center',
                            marginTop: SIZES.padding,
                            borderRadius: SIZES.radius,
                            backgroundColor: isEnabledSignIn() ? COLORS.primary : COLORS.transparentPrimary,
                            paddingHorizontal: SIZES.padding,
                            alignSelf: 'center'
                        }}
                        onPress={() => handleAccountAdd()}
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
                </KeyboardAwareScrollView>
            </View>
        </ImageBackground>
    )
}

export default AddAccount