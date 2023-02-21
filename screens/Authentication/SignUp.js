import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Platform,
    Alert,
    Linking
} from 'react-native';
import { AuthLayout } from '../';
import { FONTS, SIZES, COLORS, icons } from '../../constants';
import { FormInput, TextButton, TextIconButton } from '../../components';
import { utils } from '../../utils';
import axios from 'axios';
// import { LoginManager, AccessToken, Profile } from 'react-native-fbsdk-next';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { AuthContext } from '../../Context/authContext';
import { BASE_URL } from '../../config';
import CheckBox from '@react-native-community/checkbox';
import * as Keychain from 'react-native-keychain';

const SignUp = ({ navigation }) => {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [isSelected, setIsSelected] = useState(true);
    const [emailError, setEmailError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [commonError, setCommonError] = useState("");

    const [saveMe, setSaveMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const { userInfo, login } = useContext(AuthContext);

    const isEnabledSignUp = () => {
        return isSelected && email != "" && password != "" && emailError == "" && username !== "" && username.trim() !== "" && usernameError == "" && passwordError == ""
    }

    useEffect(() => { 
        const unsubscribe = navigation.addListener('focus', async () => {
            const credentials = await Keychain.getGenericPassword({ service: 'view-s-token' });
            if (credentials && credentials.username && credentials.password) {
                navigation.goBack();
            }
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => { 
        GoogleSignin.configure({
            webClientId: Platform.OS == 'ios' ? '662268974133-g820ucosmhbei9l40cg3ub9oh7nah5em.apps.googleusercontent.com' : '662268974133-n7jit2sgfk446mpgp2rai0t8p8iar5r9.apps.googleusercontent.com'
        });
    },[])

    const registerUser = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${BASE_URL}/user/create`, {
                email: email,
                password: password,
                username: username,
                type: 'email',
                role: 'user'
            });
            setIsLoading(false);
            navigation.navigate('SignIn');
        } catch (error) {
            console.log(error.response.data);
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoading(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoading(false);
            }
        }
    }

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
                navigation.navigate('Home');
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
        // LoginManager.logInWithPermissions(['public_profile', 'email'])
        //     .then(async result => {
        //         if (result.isCancelled) {
        //             setIsLoading(false);
        //             setCommonError('Facebook Login cancelled');
        //         } else {
        //             try {
        //                 let userProfile = await Profile.getCurrentProfile();
        //                 if (userProfile) {
        //                     let userToken = await AccessToken.getCurrentAccessToken();
        //                     try {
        //                         const response = await axios.post(`${BASE_URL}/user/social/login`, {
        //                             email: userProfile.userID,
        //                             firstName: userProfile.firstName,
        //                             lastName: userProfile.lastName,
        //                             profileImage: userProfile.imageURL,
        //                             username: userProfile.userID,
        //                             token: userToken.accessToken.toString(),
        //                             type: 'facebook',
        //                             role: 'user'
        //                         });
        //                         setIsLoading(false);
        //                         login(response.data.token, response.data.user);
        //                         navigation.navigate('Home');
        //                     } catch (error) {
        //                         if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
        //                             setCommonError(error.response.data.msg);
        //                             setIsLoading(false);
        //                         } else {
        //                             setCommonError('Unknown Error, Try again later');
        //                             setIsLoading(false);
        //                         }
        //                     }
        //                 } else {
        //                     setCommonError('Login failed unable to get user profile');
        //                     setIsLoading(false);
        //                 }
        //             } catch (error) {
        //                 setIsLoading(false);
        //                 console.log("Login fail with error: " + error);
        //                 setCommonError('Facebook Login failed with error, Try again later');
        //             }
        //         }
        //     }, error => {
        //         setIsLoading(false);
        //         console.log("Login fail with error: " + error);
        //         setCommonError('Facebook Login failed with error, Try again later');
        //     })
    }

    return (
        <AuthLayout
            title={"Continue"}
            subTitle={"Sign up now"}
            titleContainerStyle= {{
                marginTop: SIZES.radius
            }}
            navigation={navigation}
            isLoading={isLoading}
            isHeader={true}
        >
            <View
                style={{
                    flex: 1,
                    marginTop: SIZES.padding,

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
                    label="Username"
                    containerStyle={{
                        marginTop: SIZES.radius
                    }}
                    maxLength={40}
                    autoCompleteType="email"
                    onChange={(value) => {
                        // utils.validateEmail(value, setEmailError)
                        setUsername(value.replace(/\s/g, ''))

                    }}
                    value={username}
                    errorMsg={usernameError}
                    appendComponent={
                        <View
                            style={{
                                justifyContent: 'center'
                            }}
                        >
                            <Image 
                                source={username == "" || (username != "" && usernameError == "") ? icons.correct : icons.cancel}
                                style={{
                                    height: 20,
                                    width: 20,
                                    tintColor: username == "" ? COLORS.gray : (username != "" && usernameError == "") ? COLORS.green: COLORS.red,

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
                    value={password}
                    errorMsg={passwordError}
                    onChange={(value) => {
                        utils.validatePassword(value, setPasswordError)
                        setPassword(value)
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
                <TextButton 
                    label="Sign Up"
                    disabled={isEnabledSignUp() ? false : true }
                    buttonContainerStyle={{
                        height: 55,
                        alignItems: 'center',
                        marginTop: SIZES.padding,
                        borderRadius: SIZES.radius,
                        backgroundColor: isEnabledSignUp() ? COLORS.primary : COLORS.transparentPrimary 
                    }}
                    onPress={() => { registerUser(); }}
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
                            color: COLORS.white,
                            ...FONTS.body3
                        }}
                    >
                        Already have an account?
                    </Text>
                    <TextButton 
                        label="Sign In"
                        buttonContainerStyle={{
                            marginLeft: 3,
                            backgroundColor: null
                        }}
                        labelStyle={{
                            color: COLORS.white,
                            ...FONTS.h3
                        }}
                        onPress={() => navigation.goBack()}
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
                            onPress={() => { Linking.openURL('https://www.lunahunt.com/legal') }}
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
                <View style={{ marginTop: SIZES.padding }}>
                    <TextIconButton 
                        containerStyle={{
                            height: 50,
                            alignItems: 'center',
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
                    />
                    <TextIconButton 
                        containerStyle={{
                            height: 50,
                            alignItems: 'center',
                            marginTop: SIZES.radius,
                            borderRadius: SIZES.radius,
                            backgroundColor: COLORS.lightGray2,
                        }}
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
                    />
                </View>
            </View>
            <View style={{ height: 50 }} />
        </AuthLayout>
    )
}

export default SignUp;