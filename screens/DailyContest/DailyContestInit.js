import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    ScrollView,
    Text,
    SafeAreaView,
    Modal,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import { COLORS, SIZES, FONTS, icons } from '../../constants';
import { IconButton, Header, ExpandableView, TextButton } from '../../components';
import axios from 'axios';
import AnimatedLoader from "react-native-animated-loader";
import { BASE_URL } from '../../config';
import mime from "mime";
import { AuthContext } from '../../Context/authContext';


const DailyContestInit = ({ navigation, route }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [isLoad, setIsLoad] = useState(false);
    
    const [commonError, setCommonError] = useState("");
    const [faqList, setFaqList] = useState([]);

    const [isPostEnabled, setIsPostEnabled] = useState(true);
    const [errorModelTwice, setErrorModelTwice] = useState(false);
    const [successModel, setSuccessModel] = useState(false);

    const { userInfo } = useContext(AuthContext);

    const createFormData = (photo, body = {}) => {
        const data = new FormData();
        photo.forEach(elem => {
            data.append('photo', {
                name: 'image',
                type: elem.mime,
                uri:  elem.path
            });
        });

        Object.keys(body).forEach((key) => {
            data.append(key, body[key]);
        });

        return data;
    };

    const handleUploadPhotoInit = () => {
        setIsPostEnabled(false);
    }

    function renderConfirmModal() {

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={!isPostEnabled}
            >
                <TouchableWithoutFeedback
                    onPress={() => setIsPostEnabled(true)}
                    disabled={isLoading}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)'
                        }}
                    >
                        <View
                            style={{
                                // height: 400,
                                width: SIZES.width * 0.8,
                                backgroundColor: COLORS.white,
                                borderRadius: SIZES.radius,
                                paddingBottom: SIZES.padding,
                                paddingHorizontal: SIZES.radius
                            }}
                        >
                            <Text
                                style={{ ...FONTS.h3, color: COLORS.black, paddingVertical: SIZES.padding, alignSelf: 'center' }}
                            >
                                Are you ready to post?
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <TextButton
                                    buttonContainerStyle={{
                                        height: 40,
                                        width: 100,
                                        borderRadius: SIZES.radius,
                                        backgroundColor: COLORS.blue
                                    }}
                                    labelStyle={{
                                        color: COLORS.white,
                                        ...FONTS.h4
                                    }}
                                    label={
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: COLORS.white, ...FONTS.h4 }}>Yes</Text>
                                            { 
                                                isLoading ? 
                                                    <View style={{ marginLeft: SIZES.radius }}>
                                                        <ActivityIndicator /> 
                                                    </View>
                                                : null 
                                            }
                                        </View>
                                    }
                                    onPress={() => checkAbleToPost()}
                                    disabled={isLoading}
                                />
                                <TextButton
                                    buttonContainerStyle={{
                                        height: 40,
                                        width: 100,
                                        borderRadius: SIZES.radius,
                                        backgroundColor: COLORS.blue
                                    }}
                                    labelStyle={{
                                        color: COLORS.white,
                                        ...FONTS.h4
                                    }}
                                    label={'Not Yet'}
                                    onPress={() => setIsPostEnabled(true)}
                                    disabled={isLoading}
                                />
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    function renderErrorModalTwice() {

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={errorModelTwice}
            >
                <TouchableWithoutFeedback
                    onPress={() => setErrorModelTwice(false)}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)'
                        }}
                    >
                        <View
                            style={{
                                // height: 400,
                                width: SIZES.width * 0.8,
                                backgroundColor: COLORS.white,
                                borderRadius: SIZES.radius,
                                paddingBottom: SIZES.padding,
                                paddingHorizontal: SIZES.radius
                            }}
                        >
                            <Text
                                style={{ ...FONTS.h3, color: COLORS.black, paddingTop: SIZES.padding, paddingBottom: SIZES.radius, alignSelf: 'center' }}
                            >
                                {`${commonError}`}
                            </Text>
                            <Text
                                style={{ ...FONTS.h3, color: COLORS.black, paddingBottom: SIZES.padding, alignSelf: 'center' }}
                            >
                                {`Please try again when today’s OOTD Challenge ends.`}
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center'
                                }}
                            >
                                <TextButton
                                    buttonContainerStyle={{
                                        height: 40,
                                        width: 100,
                                        borderRadius: SIZES.radius,
                                        backgroundColor: COLORS.blue
                                    }}
                                    labelStyle={{
                                        color: COLORS.white,
                                        ...FONTS.h4
                                    }}
                                    label={'Close'}
                                    onPress={() => setErrorModelTwice(false)}
                                />
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    function renderSuccessModal() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={successModel}
            >
                <TouchableWithoutFeedback
                    onPress={() => { setSuccessModel(false); navigation.push("Home");}}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)'
                        }}
                    >
                        <View
                            style={{
                                // height: 400,
                                width: SIZES.width * 0.8,
                                backgroundColor: COLORS.white,
                                borderRadius: SIZES.radius,
                                paddingBottom: SIZES.padding,
                                paddingHorizontal: SIZES.radius
                            }}
                        >
                            <Text
                                style={{ ...FONTS.h3, color: COLORS.black, paddingVertical: SIZES.padding, alignSelf: 'center' }}
                            >
                                Success!
                            </Text>
                            <Text
                                style={{ ...FONTS.h3, color: COLORS.black, paddingBottom: SIZES.padding, alignSelf: 'center' }}
                            >
                                You have successfully entered Today’s OOTD Challenge
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center'
                                }}
                            >
                                <TextButton
                                    buttonContainerStyle={{
                                        height: 40,
                                        width: 100,
                                        borderRadius: SIZES.radius,
                                        backgroundColor: COLORS.blue
                                    }}
                                    labelStyle={{
                                        color: COLORS.white,
                                        ...FONTS.h4
                                    }}
                                    label={'Close'}
                                    onPress={() => {setSuccessModel(false); navigation.push("Home");}}
                                />
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    const handleUploadPhoto = () => {
        let dataR = route.params.data;
        let data = createFormData(dataR.photo, {
            user_id: userInfo.user.id,
            post_title: dataR.post_title,
            styling_tips: dataR.styling_tips ? dataR.styling_tips : '',
            my_height: dataR.myHeight,
            outfit: dataR.outfit
        });

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': "application/x-www-form-urlencoded",
                'Accept': 'application/json'
            },
        };

        axios.post(`${BASE_URL}/post/create`, data, config)
            .then(response => {
                setIsPostEnabled(true);
                setIsLoading(false);
                setSuccessModel(true);
            })
            .catch(error => {
                setIsPostEnabled(true);
                if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                    if (error.response.status === 401) {
                        setErrorModelTwice(true);
                    }
                    setCommonError(error.response.data.msg);
                    setIsLoading(false);
                } else {
                    setCommonError('Unknown Error, Try again later');
                    setIsLoading(false);
                }
            });
    };

    const checkAbleToPost = () => {
        setCommonError("");
        setIsLoading(true);
        axios.post(`${BASE_URL}/post/create/check`, { user_id: userInfo.user.id })
            .then(response => {
                handleUploadPhoto();
            })
            .catch(error => {
                setIsPostEnabled(true);
                if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                    if (error.response.status === 401) {
                        setErrorModelTwice(true);
                    }
                    setCommonError(error.response.data.msg);
                    setIsLoading(false);
                } else {
                    setCommonError('Unknown Error, Try again later');
                    setIsLoading(false);
                }
            });
    }

    function renderHeader() {
        return (
            <Header
                title=""
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
                        onPress={() => navigation.navigate('DailyContest', { data: route.params.data })}
                    />
                }
                rightComponent={
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: SIZES.radius,
                        }}
                        disabled={!isPostEnabled}
                        onPress={() => handleUploadPhotoInit()}
                    >
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: 'center',
                                width: 60,
                                height: 40,
                                borderRadius: SIZES.radius,
                                backgroundColor: isPostEnabled ? COLORS.blue : COLORS.transparentPrimary
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
                                Post
                            </Text>
                        </View>
                    </TouchableOpacity>
                }
            />
        )
    }

    useEffect(() => {
        getFaqs();
    }, []);

    const getFaqs = async () => {
        setIsLoad(true);
        try {
            const response = await axios.get(`${BASE_URL}/faqs/list`);
            setFaqList(response.data.data);
            setIsLoad(false);
        } catch (error) {
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoad(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoad(false);
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
            <SafeAreaView style={{ backgroundColor: COLORS.white }}>
                {renderHeader()}
            </SafeAreaView>
            {!isPostEnabled ? renderConfirmModal() : null}
            {errorModelTwice ? renderErrorModalTwice() : null}
            {successModel ? renderSuccessModal() : null}
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
            <View
                style={{
                    marginHorizontal: SIZES.padding,
                    borderRadius: SIZES.radius,
                    flex: 1
                }}
            >
                {/* <TextButton
                    label="Enter Daily Contest"
                    buttonContainerStyle={{
                        height: 55,
                        alignItems: 'center',
                        marginTop: SIZES.padding,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.primary
                    }}
                    onPress={() => navigation.navigate('DailyContestStep1', { data: { ...route.params?.data } })}
                /> */}
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
                {/* <Text
                    style={{
                        color: COLORS.red,
                        ...FONTS.body3,
                        marginTop: SIZES.radius
                    }}
                >
                    Before entering daily contest, Please check Contest rules below.
                </Text> */}
                <Text
                    style={{
                        color: COLORS.black,
                        ...FONTS.h2,
                        marginTop: SIZES.radius,
                        alignSelf: 'center'
                    }}
                >
                    Rules
                </Text>
                { 
                    isLoad ? 
                        <View style={{ alignItems: 'center', margin: SIZES.padding * 2 }}>
                            <ActivityIndicator /> 
                        </View>
                    : null 
                }
                <ScrollView
                    style={{
                        flexGrow: 1,
                        marginTop: SIZES.radius
                    }}
                >
                    {
                        faqList.map((elem, index) => (
                            <ExpandableView
                                label={`${elem.question}`}
                                label2={`${elem.answer}`}
                                isOpen={false}
                                key={elem.id}
                                label2Style={{
                                    color: COLORS.black
                                }}
                            />
                        ))
                    }
                </ScrollView>
            </View>
            <View style={{ height: 50 }} />
        </View>
    )
}

export default DailyContestInit