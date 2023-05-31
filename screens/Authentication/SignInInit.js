import React, { useEffect, useState, useContext, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Platform,
    Linking,
    Alert
} from 'react-native';
import { AuthLayout } from '../';
import { FONTS, SIZES, COLORS, icons } from '../../constants';
import { TextButton, TextIconButton } from '../../components';
import axios from 'axios';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken, Profile } from 'react-native-fbsdk-next';
import { AuthContext } from '../../Context/authContext';
import { BASE_URL } from '../../config';
import CheckBox from '@react-native-community/checkbox';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/AntDesign';
import * as Keychain from 'react-native-keychain';
import { useWeb3Modal } from '@web3modal/react-native';
import { ethers } from 'ethers';

const SignInInit = ({ navigation, route }) => {

    const [commonError, setCommonError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSelected, setIsSelected] = useState(true);

    const { userInfo, login } = useContext(AuthContext);

    const { open, isConnected, provider } = useWeb3Modal();

    const isEnabledSignIn = () => {
        return isSelected
    }

    // useEffect(() => { 
    //     const unsubscribe = navigation.addListener('focus', async () => {
    //         const credentials = await Keychain.getGenericPassword({ service: 'view-s-token' });
    //         if (credentials && credentials.username && credentials.password) {
    //             navigation.push('Home');
    //         }
    //     });
    //     return unsubscribe;
    // }, [navigation]);

    // const web3Provider = useMemo(
    //     () => (provider ? new ethers.providers.Web3Provider(provider) : undefined),
    //     [provider]
    // );

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: Platform.OS == 'ios' ? '662268974133-g820ucosmhbei9l40cg3ub9oh7nah5em.apps.googleusercontent.com' : '662268974133-n7jit2sgfk446mpgp2rai0t8p8iar5r9.apps.googleusercontent.com'
        });
    }, []);

    // useEffect(() => {
    //     addr();
    // }, [isConnected]);

    // const addr = async () => {
    //     // console.log(web3Provider.getSigner)
    //     if (isConnected) {
    //         try {
    //             setIsLoading(true);
    //             const signer = web3Provider.getSigner();
    //             const address = await signer.getAddress();
    //             try {
    //                 const response = await axios.post(`${BASE_URL}/user/social/login`, {
    //                     email: address,
    //                     firstName: '',
    //                     lastName: '',
    //                     profileImage: '',
    //                     username: address,
    //                     token: address,
    //                     type: 'WalletConnect',
    //                     role: 'user'
    //                 });
    //                 setIsLoading(false);
    //                 login(response.data.token, response.data.user);
    //             } catch (error) {
    //                 console.log('error comes:', error);
    //                 if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
    //                     setCommonError(error.response.data.msg);
    //                     setIsLoading(false);
    //                 } else {
    //                     setCommonError('Unknown Error, Try again later');
    //                     setIsLoading(false);
    //                 }
    //             }
    //         } catch (error) {
    //             console.log('error comes:', error);
    //             // some other error happened
    //             setCommonError('Unknown error from WalletConnet, Try again later');
    //             setIsLoading(false);
    //         }
    //     }
    // }

    const googlelogin = async () => {
        try {
            setIsLoading(true);
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            try {
                const response = await axios.post(`${BASE_URL}/user/social/login`, {
                    email: userInfo.user.id,
                    firstName: userInfo.user.givenName,
                    lastName: userInfo.user.familyName,
                    profileImage: userInfo.user.photo,
                    username: userInfo.user.id,
                    token: userInfo.idToken,
                    type: 'google',
                    role: 'user'
                });
                setIsLoading(false);
                login(response.data.token, response.data.user);
                // if (route.params && route.params.navigateTo) {
                //     navigation.push(`${route.params.navigateTo.screen}`, route.params.navigateTo.data);
                // } else {
                //     navigation.push('Home');
                // }
            } catch (error) {
                console.log('error comes:', error);
                if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                    setCommonError(error.response.data.msg);
                    setIsLoading(false);
                } else {
                    setCommonError('Unknown Error, Try again later');
                    setIsLoading(false);
                }
            }
        } catch (error) {
            console.log('error comes:', error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                setCommonError('Login flow cancelled');
                setIsLoading(false);
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
                setCommonError('Singin process is already in progress');
                setIsLoading(false);
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                setCommonError('Google play services not available or outdated');
                setIsLoading(false);
            } else {
                // some other error happened
                setCommonError('Unknown error from Google, Try again later');
                setIsLoading(false);
            }
        }
    }

    const facebookLogin = async () => {
        setIsLoading(true);
        LoginManager.logInWithPermissions(['public_profile', 'email'])
            .then(async result => {
                if (result.isCancelled) {
                    setIsLoading(false);
                    setCommonError('Facebook Login cancelled');
                } else {
                    try {
                        let userProfile = await Profile.getCurrentProfile();
                        if (userProfile) {
                            let userToken = await AccessToken.getCurrentAccessToken();
                            try {
                                const response = await axios.post(`${BASE_URL}/user/social/login`, {
                                    email: userProfile.userID,
                                    firstName: userProfile.firstName,
                                    lastName: userProfile.lastName,
                                    profileImage: userProfile.imageURL,
                                    username: userProfile.userID,
                                    token: userToken.accessToken.toString(),
                                    type: 'facebook',
                                    role: 'user'
                                });
                                setIsLoading(false);
                                login(response.data.token, response.data.user);
                                if (route.params && route.params.navigateTo) {
                                    navigation.push(`${route.params.navigateTo.screen}`, route.params.navigateTo.data);
                                } else {
                                    navigation.navigate('Home');
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
                        } else {
                            setCommonError('Login failed unable to get user profile');
                            setIsLoading(false);
                        }
                    } catch (error) {
                        setIsLoading(false);
                        console.log("Login fail with error: " + error);
                        setCommonError('Facebook Login failed with error, Try again later');
                    }
                }
            }, error => {
                setIsLoading(false);
                console.log("Login fail with error: " + error);
                setCommonError('Facebook Login failed with error, Try again later');
            })
    }

    const onAppleButtonPress = async () => {
        // Start the sign-in request
        try {
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
              });
            
              // Ensure Apple returned a user identityToken
              if (!appleAuthRequestResponse.identityToken) {
                setCommonError('Apple Sign-In failed - no identify token returned');
              }

              setIsLoading(true);
              try {
                const response = await axios.post(`${BASE_URL}/user/social/login`, {
                    email: appleAuthRequestResponse.user,
                    firstName: '',
                    lastName: '',
                    profileImage: '',
                    username: appleAuthRequestResponse.user,
                    token: appleAuthRequestResponse.identityToken,
                    type: 'apple',
                    role: 'user'
                });
                setIsLoading(false);
                login(response.data.token, response.data.user);
                // if (route.params && route.params.navigateTo) {
                //     navigation.push(`${route.params.navigateTo.screen}`, route.params.navigateTo.data);
                // } else {
                //     navigation.navigate('Home');
                // }
            } catch (error) {
                if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                    setCommonError(error.response.data.msg);
                    setIsLoading(false);
                } else {
                    setCommonError('Unknown Error, Try again later');
                    setIsLoading(false);
                }
            }
        } catch (error) {
            console.log(error);   
            setCommonError('Apple Sign-In failed, Try again later.');
            setIsLoading(false);
        }
    }

    return (
        <AuthLayout
            title={"Sign In"}
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
                <View>
                    {Platform.OS == 'ios' ? <TextIconButton 
                        containerStyle={{
                            height: 50,
                            alignItems: 'center',
                            borderRadius: SIZES.radius,
                            backgroundColor: COLORS.lightGray2,
                        }}
                        disabled={isEnabledSignIn() ? false : true }
                        icon={<Icon 
                            name={'apple1'} 
                            size={24} 
                            color={COLORS.black}
                        />}
                        iconPosition="LEFT"
                        iconStyle={{
                            tintColor: null
                        }}
                        label={"Continue With Apple"}
                        labelStyle={{
                            marginLeft: SIZES.radius
                        }}
                        onPress={() => onAppleButtonPress()}
                    /> : null }
                    {/* <TextIconButton 
                        containerStyle={{
                            height: 50,
                            alignItems: 'center',
                            borderRadius: SIZES.radius,
                            marginTop: SIZES.padding,
                            backgroundColor: COLORS.lightGray2,
                        }}
                        disabled={isEnabledSignIn() ? false : true }
                        icon={<Image 
                                source={icons.google}
                                style={{
                                    marginLeft: 5,
                                    width: 20,
                                    height: 20,
                                    tintColor: null
                                }}
                            />}
                        iconPosition="LEFT"
                        iconStyle={{
                            tintColor: null
                        }}
                        label={"Continue With Google"}
                        labelStyle={{
                            marginLeft: SIZES.radius
                        }}
                        onPress={() => googlelogin()}
                    /> */}
                    {/* <TextIconButton 
                        disabled={isEnabledSignIn() ? false : true }
                        containerStyle={{
                            height: 50,
                            alignItems: 'center',
                            marginTop: SIZES.padding,
                            borderRadius: SIZES.radius,
                            backgroundColor: COLORS.blue,
                        }}
                        icon={<Image 
                            source={icons.fb}
                            style={{
                                marginLeft: 5,
                                width: 20,
                                height: 20,
                                tintColor: null
                            }}
                        />}
                        iconPosition="LEFT"
                        iconStyle={{
                            tintColor: COLORS.white
                        }}
                        label={"Continue With Facebook"}
                        labelStyle={{
                            marginLeft: SIZES.radius,
                            color: COLORS.white
                        }}
                        onPress={() => facebookLogin()}
                    /> */}
                    
                </View>
                <TextButton 
                    label="Continue With Email"
                    disabled={isEnabledSignIn() ? false : true }
                    buttonContainerStyle={{
                        height: 50,
                        alignItems: 'center',
                        marginTop: SIZES.padding,
                        borderRadius: SIZES.radius,
                        backgroundColor: isEnabledSignIn() ? COLORS.primary : COLORS.transparentPrimary 
                    }}
                    onPress={() => { 
                        if (route.params && route.params.navigateTo) { 
                            navigation.navigate("SignIn", { navigateTo: route.params.navigateTo });
                        } else {
                            navigation.navigate("SignIn");
                        } 
                    }}
                />
                {/* <TextButton 
                    label={isConnected ? "View Account" : "Continue With Wallet Connect"}
                    disabled={isEnabledSignIn() ? false : true }
                    buttonContainerStyle={{
                        height: 50,
                        alignItems: 'center',
                        marginTop: SIZES.padding,
                        borderRadius: SIZES.radius,
                        backgroundColor: isEnabledSignIn() ? COLORS.blueTwitter : COLORS.transparentPrimary 
                    }} 
                    // onPress={() => { 
                    //     if (route.params && route.params.navigateTo) { 
                    //         navigation.navigate("SignIn", { navigateTo: route.params.navigateTo });
                    //     } else {
                    //         navigation.navigate("SignIn");
                    //     } 
                    // }}
                    onPress={open}
                /> 
                */}
                <View
                    style={{ 
                        flexDirection: 'row',
                        marginTop: SIZES.radius,
                        justifyContent: 'center'
                    }}
                >
                    <Text
                        style={{
                            color: COLORS.white,
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
                            color: COLORS.white,
                            ...FONTS.h3
                        }}
                        onPress={() => navigation.navigate("SignUp")}
                    />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: SIZES.radius,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <CheckBox
                        value={isSelected}
                        onValueChange={() => setIsSelected(!isSelected)}
                        boxType={'square'}
                    />
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent:'center',
                        }}
                    >
                        <Text 
                            style={{
                                color: COLORS.white,
                                ...FONTS.body4,
                                marginTop: SIZES.base,
                                marginLeft: SIZES.base
                            }}
                        >
                            By using our service, you agree to our
                        </Text>
                        <TouchableOpacity
                            onPress={() => { 
                               Linking.openURL(`http://solidcircle.tech/privacy`); 
                            }}
                        >
                            <Text 
                                style={{
                                    color: COLORS.white,
                                    ...FONTS.body4,
                                    marginLeft: SIZES.base
                                }}
                            >
                                Terms of Service & Privacy Policy
                            </Text>
                        </TouchableOpacity>
                    </View>
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

export default SignInInit;