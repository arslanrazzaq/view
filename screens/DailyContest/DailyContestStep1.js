import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    Platform,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Dimensions,
    KeyboardAvoidingView
} from 'react-native';
import { COLORS, SIZES, FONTS, icons } from '../../constants';
import { TextButton, Header, IconButton } from '../../components';
import { AuthContext } from '../../Context/authContext';

const DailyContestStep1 = ({ navigation, route }) => {

    const { userInfo } = useContext(AuthContext);

    const [photo, setPhoto] = useState([]);
    const [post_title, setPostTitle] = useState('');
    const [commonError, setCommonError] = useState("");

    useEffect(() => {
        if (route.params && route.params.data) {
            setPhoto(route.params.data.photo || []);
            setPostTitle(route.params.data.post_title || '');
        }
    }, []);

    const isEnabledSignIn = () => {
        return photo != null && photo.length > 0 && post_title != "" && post_title.trim().length > 0 && userInfo.user && userInfo.user.id
    }

    const handleUploadPhoto = () => {
        setCommonError("");
        let data = { ...route.params?.data, photo: photo, user_id: userInfo.user.id, post_title };
        navigation.navigate("DailyContestStep2", { data: data });
    };

    function renderHeader() {
        return (
            <Header
                title="OOTD Challenge"
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
                        onPress={() => navigation.push('Home')}
                    // onPress={() => navigation.navigate('DailyContestInit', { data: {...route.params?.data, photo: photo, post_title: post_title} })}
                    />
                }
                rightComponent={
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: SIZES.radius,
                        }}
                        disabled={isEnabledSignIn() ? false : true}
                        onPress={() => handleUploadPhoto()}
                    >
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: 'center',
                                width: 60,
                                height: 40,
                                borderRadius: SIZES.radius,
                                backgroundColor: isEnabledSignIn() ? COLORS.blue : COLORS.transparentPrimary
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
                                Next
                            </Text>
                        </View>
                    </TouchableOpacity>
                }
            />
        )
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : ""}
            style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}
        >
            <SafeAreaView style={{ backgroundColor: COLORS.white }}>
                {renderHeader()}
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
                        marginTop: SIZES.base,
                        height: 40,
                    }}
                >
                    <TextButton
                        buttonContainerStyle={{
                            height: 40,
                            flex: 1,
                            marginRight: SIZES.base,
                            borderRadius: SIZES.radius,
                            backgroundColor: COLORS.primary
                        }}
                        label={photo && photo.length <= 0 ? `Choose my photos` : `${photo.length} images selected`}
                        labelStyle={{
                            color: COLORS.white
                        }}
                        onPress={() => navigation.navigate('DailyContestChoosePhotos', { data: { ...route.params?.data, photo: photo, post_title: post_title } })}
                    />
                </View>
                <View
                    style={{
                        marginTop: SIZES.radius
                    }}
                >
                    {commonError ? <Text
                        style={{
                            color: COLORS.red,
                            ...FONTS.h3,
                            textAlign: 'center'
                        }}
                    >
                        {commonError}
                    </Text> : null
                    }
                </View>
                <Text
                    style={{
                        color: COLORS.black,
                        ...FONTS.h3
                    }}
                >
                    [Step 1 of 4] Title Box
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
                            // height: Dimensions.get('window').height - 400,
                            marginLeft: SIZES.radius,
                            marginVertical: SIZES.radius,
                            ...FONTS.body3,
                            textAlignVertical: "top"
                        }}
                        maxLength={3000}
                        multiline
                        value={post_title}
                        onChangeText={(value) => {
                            setPostTitle(value);
                        }}
                        placeholder={'Type here...'}
                    />
                </View>
                <View style={{ height: 50 }} />
            </View>
        </KeyboardAvoidingView>
    )
}

export default DailyContestStep1