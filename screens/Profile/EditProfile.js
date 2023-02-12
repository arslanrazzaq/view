import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    SafeAreaView,
    KeyboardAvoidingView,
    TouchableOpacity
} from 'react-native';
import { Header, IconButton, TextButton, FormInput } from '../../components';
import { FONTS, SIZES, COLORS, icons } from '../../constants';
import AnimatedLoader from "react-native-animated-loader";
import axios from 'axios';
import { AuthContext } from '../../Context/authContext';
import { BASE_URL } from '../../config';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';

const EditProfile = ({ navigation, route }) => {

    const [description, setDescription] = useState("");
    const [commonError, setCommonError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { userInfo, login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [photo, setPhoto] = useState([]);
    
    useEffect(() => {
        if (userInfo?.user?.gender && userInfo?.user?.dob && userInfo?.user?.nationality && !route.params.isEdit) {
            navigation.push('Home', { screen: 'Home' });
        }
        setProfilePic(route.params.profile_pic);
        setDescription(route.params.description);
        setUsername(route.params.username);
    }, []);

    const isEnabledSignIn = () => {
        return description != "" && description.trim().length != 0 && username != "" && username.trim().length != 0 && username.trim().length <= 40
    }

    const renderHeader = () => {
        return (
            <Header
                title={route.params.isEdit ? "About Me" : "Step 4 of 4"}
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
                rightComponent={
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: SIZES.radius,
                        }}
                        onPress={() => handleDescription()}
                        disabled={isEnabledSignIn() ? false : true}
                    >
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: 'center',
                                width: 60,
                                height: 40,
                                borderRadius: SIZES.radius,
                                backgroundColor: !isEnabledSignIn() ? COLORS.gray : COLORS.blue
                            }}
                        >
                            <Text
                                style={{
                                    borderRadius: SIZES.radius,
                                    ...FONTS.body4,
                                    fontSize: 17,
                                    color: COLORS.white,
                                }}
                            >
                                Save
                            </Text>
                        </View>
                    </TouchableOpacity> 
                }
            />
        )
    }

    const handleChoosePhoto = async () => {
        setCommonError("");
        ImagePicker.openPicker({
            width: 500,
            height: 500,
            writeTempFile: false,
            cropping: true,
            cropperCircleOverlay: true
        }).then(image => {
            let check = (image.size / 1048576).toFixed(2);
            if (check > 20) {
                setCommonError(`Your photo size can't exceed 20MB`);
            } else {
                setPhoto([image]);
                // handleUploadPhoto([image]);
            }
        }).catch(error => {
            console.log(`Error occurs while opening croper`);
        });
    };

    const createFormData = (photo, body = {}) => {
        const data = new FormData();
        photo.forEach(elem => {
            data.append('photo', {
                name: 'profile-image',
                type: elem.mime,
                uri: elem.path
            });
        });

        Object.keys(body).forEach((key) => {
            data.append(key, body[key]);
        });

        return data;
    };

    const handleDescription = async () => {
        setIsLoading(true);
        try {
            let data = {};
            if (route.params.isEdit) {
                data = createFormData(photo, { 
                    id: userInfo.user.id, 
                    firstName: userInfo.user.firstName, 
                    lastName: userInfo.user.lastName, 
                    profile_pic: userInfo.user.profile_pic, 
                    description: description, 
                    username: username,
                });
            } else {
                data = createFormData(photo, { 
                    id: userInfo.user.id, 
                    firstName: userInfo.user.firstName, 
                    lastName: userInfo.user.lastName, 
                    profile_pic: userInfo.user.profile_pic, 
                    description: description, 
                    username: username,
                    gender: route.params?.gender ? route.params.gender : userInfo.user.gender ? userInfo.user.gender : '',
                    dob: route.params?.dob ? JSON.stringify(route.params.dob) : userInfo.user.dob ? JSON.stringify(userInfo.user.dob) : '',
                    nationality: route.params?.nationality ? route.params.nationality : userInfo.user.nationality ? userInfo.user.nationality : '', 
                });
            }
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': "application/x-www-form-urlencoded",
                    'Accept': 'application/json'
                },
            };
            const response = await axios.put(`${BASE_URL}/user/update`, data, config);
            setIsLoading(false);
            login(response.data.token, response.data.user);
            // if (route.params.isEdit) {
            //     navigation.push('Profile', { user_id: route.params.user_id });
            // } else {
                navigation.push('Home', { screen: 'Home' });
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
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : ""}
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

                <View
                    style={{
                        flexDirection: 'row',
                        paddingVertical: SIZES.base,
                        paddingHorizontal: SIZES.base,
                    }}
                >   
                    <Text
                        style={{
                            color: COLORS.gray,
                            ...FONTS.body3,
                            marginRight: SIZES.radius,
                            alignSelf: 'center'
                        }}
                    >
                        Profile Photo  
                    </Text>
                    <TouchableOpacity
                        onPress={handleChoosePhoto}
                        style={{
                            borderWidth: 1,
                            borderColor: COLORS.gray2,
                            borderRadius: 50,
                            height: 70,
                            width: 70,
                            overflow: 'hidden',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {   profilePic || photo.length > 0 ? 
                                <FastImage
                                    source={{
                                        priority: FastImage.priority.high,
                                        uri: photo.length > 0 ? photo[0].path : profilePic ? profilePic.startsWith("https://") ? `${profilePic}` : `https://${profilePic}` : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                                    }}
                                    style={{
                                        height: 70,
                                        width: 70
                                    }}
                                /> 
                            :
                                <Icon 
                                    name={'plus'} 
                                    size={40} 
                                    color={COLORS.gray2}
                                />
                        }
                    </TouchableOpacity>
                </View>
                <FormInput 
                    label="Username"
                    containerStyle={{
                        marginBottom: SIZES.radius
                    }}
                    onChange={(value) => {
                        setUsername(value.replace(/\s/g, ''))
                    }}
                    value={username}
                    errorMsg={usernameError}
                    maxLength={40}
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
                <Text
                    style={{
                        color: COLORS.gray,
                        ...FONTS.body3
                    }}
                >
                    Please write about yourself.  
                </Text>
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: SIZES.radius,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.lightGray2,
                        marginTop: SIZES.base,
                    }}
                >
                    <TextInput
                        style={{
                            // height: 300,
                            marginLeft: SIZES.radius,
                            marginVertical: SIZES.radius,
                            ...FONTS.body3,
                            textAlignVertical: "top"
                        }}
                        multiline
                        maxLength={3000}
                        value={description}
                        onChangeText={(value) => {
                            setDescription(value);
                        }}
                        placeholder={'Describe yourself...'}
                    />
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
            </View>
            <View style={{ height: 25 }} />
        </KeyboardAvoidingView>
    )
}

export default EditProfile