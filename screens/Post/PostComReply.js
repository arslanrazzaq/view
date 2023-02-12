import React, { useEffect, useState, useContext, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Platform,
    TextInput,
    SafeAreaView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import { COLORS, SIZES, FONTS, icons } from '../../constants';
import { IconButton, Header, TextButton } from '../../components';
import Icon from 'react-native-vector-icons/AntDesign';
import IconE from 'react-native-vector-icons/Entypo';
import IconF5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import AnimatedLoader from "react-native-animated-loader";
import { BASE_URL } from '../../config';
import { AuthContext } from '../../Context/authContext';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import { FlashList } from '@shopify/flash-list';
import { InterstitialAd, AdEventType, BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import KeyboardManager from 'react-native-keyboard-manager';

if (KeyboardManager) {
KeyboardManager.setEnable(true);
KeyboardManager.setEnableDebugging(true);
KeyboardManager.setKeyboardDistanceFromTextField(40);
KeyboardManager.setLayoutIfNeededOnUpdate(true);
KeyboardManager.setEnableAutoToolbar(false);
KeyboardManager.setToolbarManageBehaviourBy('subviews'); // "subviews" | "tag" | "position"
KeyboardManager.setToolbarPreviousNextButtonEnable(false);
KeyboardManager.setShouldShowToolbarPlaceholder(false);
KeyboardManager.setOverrideKeyboardAppearance(false);
KeyboardManager.setKeyboardAppearance('default'); // "default" | "light" | "dark"
KeyboardManager.setShouldResignOnTouchOutside(true);
KeyboardManager.setShouldPlayInputClicks(true);
}
const adUnitIdB = TestIds.BANNER;

moment.updateLocale('en', {
    relativeTime : {
        s  : 'just now',
        ss : '%d seconds ago',
        m:  "%dm ago",
        mm: "%dm ago",
        h:  "%dh ago",
        hh: "%dh ago",
        d:  "%dd ago",
        dd: "%dd ago",
        M:  "%dmo ago",
        MM: "%dmo ago",
        y:  "%dy ago",
        yy: "%dy ago"
    }
});

// const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
const adUnitId = TestIds.INTERSTITIAL;

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing'],
});


const abbreviateNumber = (value) => {
    let newValue = value;
    if (value >= 1 && value < 9999) {
        return `${value}`;
    } else if (value >= 9999) {
        let suffixes = ["", "K+", "M+", "B+","T+"];
        let suffixNum = Math.floor( (""+value).length/3 );
        let shortValue = '';
        for (let precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            let dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0) { 
            shortValue = shortValue.toFixed(1);
        }
        newValue = shortValue+suffixes[suffixNum];
        return newValue;
    } else if (value <= -9999) {
        let suffixes = ["", "K+", "M+", "B+","T+"];
        let suffixNum = Math.floor( (""+value).length/3 );
        let shortValue = '';
        for (let precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            let dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0) { 
            shortValue = shortValue.toFixed(1);
        }
        newValue = shortValue+suffixes[suffixNum];
        return newValue;
    } else {
        return newValue;
    }
}

let comRepTxt = '';
let isCommentFocus = false;


const PostComReply = ({ navigation, route }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [comment, setComment] = useState('');
    const [commonError, setCommonError] = useState("");
    const [data, setData] = useState({});
    const { userInfo } = useContext(AuthContext);
    const [selectedCommentToReply, setSelectedCommentToReply] = useState(null);
    const [selectedReplyToReply, setSelectedReplyToReply] = useState(null);
    const [commentReply, setCommentReply] = useState("");
    const [isCommentReply, setIsCommentReply] = useState(false);

    const [isLoadingExtra, setIsLoadingExtra] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(0);


    const [loaded, setLoaded] = useState(false);
    const [itemFromDot, setItemFromDot] = useState(null);
    const [itemFromDotType, setItemFromDotType] = useState(null);
    const [isDeleteModelCom, setIsDeleteModelCom] = useState(false);
    const [isDotModel, setIsDotModel] = useState(false);
    const [isVoteLoading, setIsVoteLoading] = useState({ loading: false, id: null, type: null });
    const [selectedComFilter, setSelectedComFilter] = useState('top');

    const [isListRefereshed, setIsListRefereshed] = useState('');
    const comment_input = useRef(null);

    const [isBlockModel, setIsBlockModel] = useState(false);
    const [isBlockModelError, setIsBlockModelError] = useState(false);
    const [isBlockModelConfirm, setIsBlockModelConfirm] = useState(false);

    const isEnabledComment = () => {
        return comment != "" && commentError == "" && userInfo?.user && userInfo?.user?.id
    }

    function renderHeader() {
        return (
            <Header
                title="Replies"
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
                // rightComponent={
                //     <IconButton
                //         icon={icons.home}
                //         containerStyle={{
                //             width: 40,
                //             height: 40,
                //             justifyContent: 'center',
                //             alignItems: 'center',
                //             borderWidth: 1,
                //             borderRadius: SIZES.radius,
                //             borderColor: COLORS.gray2
                //         }}
                //         iconStyle={{
                //             width: 20,
                //             height: 20,
                //             tintColor: COLORS.gray,
                //         }}
                //         onPress={() => navigation.push('Home', { screen: 'Home' })}
                //     />
                // }
            />
        )
    }

    useEffect(() => {
        if (route.params.focusToComment) {
            isCommentFocus = route.params.focusToComment;
        }
        getPostComment();
        // const unsubscribeInterstitialEvents = loadInterstitialAds();
        // return unsubscribeInterstitialEvents;
    }, []);

    const loadInterstitialAds = () => {
        const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
            setLoaded(true);
        });

        const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
            setLoaded(false);
            interstitial.load();
            //handleVotePressedWithAds();
        });

        interstitial.load();

        return () => {
            unsubscribeClosed();
            unsubscribeLoaded();
        }
    }

    const getPostComment = async (isLoad=true, filter=selectedComFilter) => {
        setIsLoading(isLoad);
        setData({});
        try {
            const response = await axios.get(`${BASE_URL}/single/comment/${route.params.comment_id}/${route.params.post_id}/10/1/${userInfo?.user?.id}`);
            setIsLoading(false);
            let dataToShow = response.data.data;
            let com = dataToShow.post_comment_replies.filter((value, index, self) => index === self.findIndex((t) => (t.id === value.id)));
            let newRes = Object.assign({}, dataToShow);
            newRes.post_comment_replies = com;
            if (newRes.length < pageSize) {
                setCount(newRes.length);                
            } else {
                setCount(newRes.PostComReplyCount);
            }
            await setData(newRes);
            setPageSize(10);
            setCurrentPage(1);
            if (isCommentFocus) {
                setSelectedCommentToReply(newRes); setSelectedReplyToReply(null); setIsCommentReply(true); setIsListRefereshed(`com-${newRes.id}`);
                setTimeout(() => {
                    comment_input.current.focus();
                }, 500);
                isCommentFocus = false;
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
    }

    const getPostExtraCommentReplies = async (page, current, filter=selectedComFilter) => {
        setIsLoadingExtra(true);
        try {
            const response = await axios.get(`${BASE_URL}/single/comment/${route.params.comment_id}/${route.params.post_id}/${page}/${current}/${userInfo?.user?.id}`);
            let newResult = data;
            let combine = [...data.post_comment_replies, ...response.data.data.post_comment_replies];
            let newRes = combine.filter((value, index, self) => index === self.findIndex((t) => (t.id === value.id)));
            newResult.post_comment_replies = newRes;
            if (response.data.data.post_comment_replies.length < pageSize) {
                setCount(newRes.length);                
            } else {
                setCount(newResult.PostComReplyCount);
            }
            setData(newResult);
            setPageSize(page);
            setCurrentPage(current);
            setIsLoadingExtra(false);
        } catch (error) {
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoadingExtra(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoadingExtra(false);
            }
        }
    }

    const voteOnComment = async (type, com_id, type_com_rep, main_com_id) => {
        if (!userInfo?.user?.id) {
            navigation.navigate('SignInInit', { navigateTo: { screen: 'PostComReply', data: { post_id: route.params.post_id, comment_id: route.params.comment_id }}});
            return;
        }
        setIsVoteLoading({ loading: true, id: com_id, type: type_com_rep });
        try {
            let dataObj = { 
                post_id: route.params.post_id,
                user_id:  userInfo?.user?.id,
                type: type, 
                type_com_rep: type_com_rep, 
                page_size: data.post_comment_replies.length, 
                current_page: 1,
                is_reply_page: true
            };
            
            if (type_com_rep == 'com') {
                dataObj.post_comment_id = com_id;
            } else if (type_com_rep == 'rep') {
                dataObj.post_comment_id = main_com_id;
                dataObj.post_comment_reply_id = com_id;
            }
            
            const response = await axios.post(`${BASE_URL}/post/vote/com`, dataObj);
            let dataToShow = response.data.data;
            let com = dataToShow.post_comment_replies.filter((value, index, self) => index === self.findIndex((t) => (t.id === value.id)));
            let newRes = Object.assign({}, dataToShow);
            newRes.post_comment_replies = com;
            setData(newRes);
            setIsVoteLoading({ loading: false, id: null, type: null });
        } catch (error) {
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsVoteLoading({ loading: false, id: null, type: null });
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsVoteLoading({ loading: false, id: null, type: null });
            }
        }
    }

    const handleReportPress = (id, username) => {
        if (userInfo && userInfo?.user && userInfo?.user?.id) {
            navigation.push("PostReport", { post_id: route.params.post_id, user_id: userInfo.user.id, reported_username: `${username}@` });
        } else {
            navigation.push('SignInInit', { navigateTo: { screen: 'PostReport', data: { post_id: route.params.post_id, reported_username: `${username}@` }}});
        }
    }

    const handleDateFormat = (time) => {
        let output = moment(time).fromNow(true);
        return output;
    }

    const handleCommentReply = async (val, type) => {
        if (!userInfo?.user?.id) {
            navigation.navigate('SignInInit', { navigateTo: { screen: 'PostComReply', data: { post_id: route.params.post_id, comment_id: route.params.comment_id }}});
            return;
        }

        try {
            setIsLoading(true);
            let data = {};
            if (type == 'comment') {
                data = { post_comment_id: selectedCommentToReply.id, user_id: userInfo?.user?.id, content: val }; 
            } else {
                data = { post_comment_id: route.params.comment_id, reply_to_user_id: selectedReplyToReply.user_id, user_id: userInfo?.user?.id, content: val };
            }
            const response = await axios.post(`${BASE_URL}/comment/reply/create`, data);
            comRepTxt = '';
            setIsListRefereshed('');
            setComment('');
            setCommentReply('');
            setSelectedCommentToReply(null);
            setSelectedReplyToReply(null);
            getPostComment();
        } catch (error) {
            setIsListRefereshed('');
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoading(false);
                setComment('');
                comRepTxt = '';
                setCommentReply('');
                setSelectedCommentToReply(null);
                setSelectedReplyToReply(null);
            } else if (error.response && error.response.status && error.response.status === 401) {
                setCommonError(error.response.data.msg);
                setIsLoading(false);
                setIsBlockModelError(true);
                setComment('');
                comRepTxt = '';
                setCommentReply('');
                setSelectedCommentToReply(null);
                setSelectedReplyToReply(null);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoading(false);
                comRepTxt = '';
                setComment('');
                setCommentReply('');
                setSelectedCommentToReply(null);
                setSelectedReplyToReply(null);
            }
        }
    }

    function renderConfirmDeleteModalCom() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={isDeleteModelCom}
            >
                <TouchableWithoutFeedback
                    onPress={() => setIsDeleteModelCom(false)}
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
                                Do you want to delete this comment?
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
                                        <Text style={{ color: COLORS.white, ...FONTS.h4 }}>Yes</Text>
                                    }
                                    onPress={() => {itemFromDotType == 'com' ? handleDeleteApiCom() : handleDeleteApiComRep() }}
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
                                    label={'No'}
                                    onPress={() => setIsDeleteModelCom(false)}
                                    disabled={isLoading}
                                />
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    function renderDotsModal() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={isDotModel}
            >
                <TouchableWithoutFeedback
                    onPress={() => setIsDotModel(false)}
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
                            <View
                                style={{
                                    paddingHorizontal: SIZES.base,
                                    paddingVertical: SIZES.radius,
                                    alignItems: 'center',
                                }}
                            >
                                {   
                                    itemFromDot && itemFromDot?.user?.id != userInfo?.user?.id ? 
                                        <TouchableOpacity
                                            style={{
                                                flexDirection: 'row',
                                                width: '100%',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            disabled={itemFromDot && itemFromDot?.user?.blocked_user ? true : false}
                                            onPress={() => { setIsDotModel(false); setIsBlockModel(true); }}
                                        >
                                            <IconF5 
                                                name={'user-slash'} 
                                                size={26} 
                                                color={COLORS.black}
                                                style={{
                                                    marginRight: SIZES.base
                                                }}
                                            />
                                            <Text
                                                style={{ ...FONTS.h3, color: COLORS.black, paddingVertical: SIZES.radius, alignSelf: 'center' }}
                                            >
                                                {itemFromDot && itemFromDot?.user?.blocked_user ? `Blocked` : `Block user`}
                                            </Text>
                                        </TouchableOpacity>
                                    : 
                                        null
                                }
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: SIZES.base
                                    }}
                                    onPress={() => { setIsDotModel(false); handleReportPress(itemFromDot?.id, itemFromDot?.user?.username)}}
                                >
                                    <Icon 
                                        name={'exclamationcircleo'} 
                                        size={26} 
                                        color={COLORS.black}
                                        style={{
                                            marginRight: SIZES.base
                                        }}
                                    />
                                    <Text
                                        style={{ ...FONTS.h3, color: COLORS.black, paddingVertical: SIZES.radius, alignSelf: 'center' }}
                                    >
                                        Report
                                    </Text>
                                </TouchableOpacity>
                                {   
                                    itemFromDot && itemFromDot?.user?.id == userInfo?.user?.id ? 
                                        <TouchableOpacity
                                            style={{
                                                flexDirection: 'row',
                                                width: '100%',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: SIZES.base
                                            }}
                                            onPress={() => { setIsDotModel(false); setIsDeleteModelCom(true); }}
                                        >
                                            <Icon 
                                                name={'delete'} 
                                                size={26} 
                                                color={COLORS.black}
                                                style={{
                                                    marginRight: SIZES.base
                                                }}
                                            />
                                            <Text
                                                style={{ ...FONTS.h3, color: COLORS.black, paddingVertical: SIZES.radius, alignSelf: 'center' }}
                                            >
                                                Delete
                                            </Text>
                                        </TouchableOpacity>
                                    : 
                                        null
                                }
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
                                        onPress={() => setIsDotModel(false)}
                                        disabled={isLoading}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
    
    const handleConfirmBlock = async () => {
        
        if (!userInfo?.user?.id) {
            navigation.navigate('SignInInit', { navigateTo: { screen: 'post', data: { post_id: route.params.post_id }}});
            return;
        }

        try {
            setIsBlockModelConfirm(false);
            setIsLoading(true);
            const response = await axios.post(`${BASE_URL}/user/block`, { user_id: userInfo?.user?.id, blocked_user_id: itemFromDot?.user?.id });
            getPostComment();
        } catch (error) {
            setIsBlockModelConfirm(false);
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoading(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoading(false);
            }
        }
        
    }

    function renderBlockModal() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={isBlockModel}
            >
                <TouchableWithoutFeedback
                    onPress={() => setIsBlockModel(false)}
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
                                Are you sure you want to block this user?
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
                                        <Text style={{ color: COLORS.white, ...FONTS.h4 }}>Cancel</Text>
                                    }
                                    onPress={() => { setIsBlockModel(false); }}
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
                                    label={<Text style={{ color: COLORS.white, ...FONTS.h4 }}>Block</Text>}
                                    onPress={() => { setIsBlockModel(false); setIsBlockModelConfirm(true); }}
                                />
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    function renderBlockModalError() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={isBlockModelError}
            >
                <TouchableWithoutFeedback
                    onPress={() => setIsBlockModelError(false)}
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
                                paddingHorizontal: SIZES.radius,
                            }}
                        >
                            <Text
                                style={{ ...FONTS.h3, color: COLORS.black, paddingVertical: SIZES.padding, alignSelf: 'center' }}
                            >
                                {`${commonError}`}
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
                                    label={
                                        <Text style={{ color: COLORS.white, ...FONTS.h4 }}>Close</Text>
                                    }
                                    onPress={() => { setIsBlockModelError(false); }}
                                />
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    function renderBlockModalConfirm() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={isBlockModelConfirm}
            >
                <TouchableWithoutFeedback
                    onPress={() => setIsBlockModelConfirm(false)}
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
                                style={{ 
                                    ...FONTS.h2, 
                                    color: COLORS.black, 
                                    paddingVertical: SIZES.padding,
                                    alignSelf: 'center' 
                                }}
                            >
                                Block user
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                }}
                            >
                                <IconE
                                    name={'dot-single'}
                                    size={30}
                                    color={COLORS.black}
                                />
                                <Text
                                    style={{ 
                                        ...FONTS.h3, 
                                        color: COLORS.black, 
                                        // paddingTop: SIZES.padding, 
                                        paddingBottom: SIZES.base,
                                        flex: 1, 
                                        flexWrap: 'wrap' 
                                    }}
                                >
                                    This user will be blocked from replying to your comments
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                }}
                            >
                                <IconE
                                    name={'dot-single'}
                                    size={30}
                                    color={COLORS.black}
                                />
                                <Text
                                    style={{ 
                                        ...FONTS.h3, 
                                        color: COLORS.black, 
                                        paddingBottom: SIZES.padding,
                                        flex: 1, 
                                        flexWrap: 'wrap' 
                                    }}
                                >
                                    This user will be blocked from all of your posts
                                </Text>
                            </View>
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
                                        <Text style={{ color: COLORS.white, ...FONTS.h4 }}>Cancel</Text>
                                    }
                                    onPress={() => { setIsBlockModelConfirm(false); }}
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
                                    label={<Text style={{ color: COLORS.white, ...FONTS.h4 }}>Block</Text>}
                                    onPress={() =>  handleConfirmBlock()}
                                />
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    const handleDeleteApiCom = async () => {
        try {
            setIsDeleteModelCom(false);
            setIsLoading(true);
            const response = await axios.delete(`${BASE_URL}/post/comment/delete`, { data: { id: route.params.post_id, comment_id: itemFromDot.id } });
            await setIsLoading(false);
            await setItemFromDot(null);
            await setItemFromDotType(null);
            setTimeout(() => {
                navigation.push("post", { post_id: route.params.post_id });
            }, 500);
        } catch (error) {
            setIsDeleteModelCom(false);
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoading(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoading(false);
            }
        }
    }

    const handleDeleteApiComRep = async () => {
        try {
            setIsDeleteModelCom(false);
            setIsLoading(true);
            const response = await axios.delete(`${BASE_URL}/comment/reply/delete`, { data: { comment_id: itemFromDot.post_comment_id, reply_comment_id: itemFromDot.id } });
            setItemFromDot(null);
            setItemFromDotType(null);
            getPostComment();
        } catch (error) {
            setIsDeleteModelCom(false);
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoading(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoading(false);
            }
        }
    }

    const handleDotsPress = async (item, type) => {
        setItemFromDot(item);
        setItemFromDotType(type);
        setIsDotModel(true);
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

            { isDeleteModelCom ? renderConfirmDeleteModalCom() : null }
            { isDotModel ? renderDotsModal() : null }
            { isBlockModel ? renderBlockModal() : null }
            { isBlockModelConfirm ? renderBlockModalConfirm() : null }
            { isBlockModelError ? renderBlockModalError() : null }

            <View
                style={{
                    marginHorizontal: SIZES.base,
                    marginBottom: SIZES.radius,
                    borderRadius: SIZES.radius,
                    flex: 1
                }}
            >
                 {data && Object.keys(data).length > 0 ? 
                    <FlashList 
                        keyboardShouldPersistTaps='handled'
                        extraData={isListRefereshed}
                        data={data.post_comment_replies}
                        keyExtractor={x => `${x.id}`}
                        showsVerticalScrollIndicator={false}
                        onEndReachedThreshold={0.2}
                        disableAutoLayout={true}
                        estimatedItemSize={200}
                        onEndReached={() => {
                            if (count > 0 && count > data.post_comment_replies.length &&!isLoading &&!isLoadingExtra) {
                                getPostExtraCommentReplies(pageSize, currentPage + 1);
                            }
                        }}
                        ListHeaderComponent={
                            <View
                                style={{ 
                                    paddingTop: SIZES.base, 
                                    backgroundColor: COLORS.lightGray2, 
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingVertical: SIZES.base,
                                        paddingHorizontal: SIZES.base,
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            borderWidth: 1,
                                            borderColor: COLORS.black,
                                            borderRadius: 50,
                                            overflow: 'hidden',
                                            height: 32,
                                            width: 32
                                        }}
                                        onPress={() => navigation.push('Profile', { user_id: data.user.id })}
                                    >
                                        <FastImage
                                            source={{
                                                priority: FastImage.priority.high,
                                                uri: data.user.profile_pic ? data.user.profile_pic.startsWith("https://") ? `${data.user.profile_pic}` : `https://${data.user.profile_pic}` : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                                            }}
                                            style={{
                                                height: 30,
                                                width: 30
                                            }}
                                        />
                                    </TouchableOpacity>
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                height: 30
                                            }}
                                            onPress={() => navigation.push('Profile', { user_id: data.user.id })}
                                        >
                                            <Text
                                                style={{
                                                    ...FONTS.h4,
                                                    marginLeft: SIZES.base,
                                                    color: COLORS.gray,
                                                    alignSelf: 'center'
                                                }}
                                            >
                                                {`${data.user.username}`}
                                            </Text>
                                            <IconE
                                                name={'dot-single'}
                                                size={20}
                                                color={COLORS.black}
                                                style={{ alignSelf: 'center' }}
                                            />
                                            <Text
                                                style={{
                                                    ...FONTS.body4,
                                                    color: COLORS.gray,
                                                    alignSelf: 'center'
                                                }}
                                            >
                                                {`${handleDateFormat(data.createdAt)}`}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{
                                                width: 40,
                                                alignItems: 'center',
                                            }}
                                            onPress={() => handleDotsPress(data, 'com')}
                                        >
                                            <IconE
                                                name={'dots-three-vertical'}
                                                size={20}
                                                color={COLORS.black}
                                                style={{ alignSelf: 'center' }}
                                            />
                                            {/* <Icon 
                                                name={'exclamationcircleo'} 
                                                size={26} 
                                                color={COLORS.black}
                                            /> */}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Text
                                    style={{ 
                                        ...FONTS.body3, 
                                        flex: 1, 
                                        marginLeft: (40 + SIZES.base),
                                        paddingRight: SIZES.radius,
                                        color: COLORS.black 
                                    }}
                                >
                                    {`${data.content}`}
                                </Text>
                                <View
                                    style={{
                                        borderBottomWidth: 3,
                                        borderBottomColor: COLORS.black,
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            paddingVertical: SIZES.padding,
                                            marginLeft: (40 + SIZES.base), 
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <TouchableOpacity
                                                style={{
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    height: 40,
                                                    width: 40
                                                }}
                                                // disabled={isVoteLoading.loading && isVoteLoading.id == item.id}
                                                onPress={() => voteOnComment('up', data.id, 'com', data.id)}
                                            >
                                                {
                                                    data.post_com_rep_votes.some(x => x.user_id == userInfo?.user?.id && x.type == 'up') ?
                                                        <Icon 
                                                            name={'like1'}
                                                            size={24}
                                                            color={COLORS.black}
                                                        />
                                                    :  
                                                        <Icon 
                                                            name={'like2'}
                                                            size={24}
                                                            color={COLORS.black}
                                                        />
                                                }   
                                            </TouchableOpacity>
                                            <Text
                                                style={{
                                                    ...FONTS.h3,
                                                    marginHorizontal: SIZES.base,
                                                    color: COLORS.black,
                                                    height: 30,
                                                    alignSelf: 'center'
                                                }}
                                            >
                                                {`${abbreviateNumber(data.PostComVoteCountUp - data.PostComVoteCountDown)}`}
                                            </Text>
                                            <TouchableOpacity
                                                style={{
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: 40,
                                                    height: 40
                                                }}
                                                // disabled={isVoteLoading.loading && isVoteLoading.id == item.id}
                                                onPress={() => voteOnComment('down', data.id, 'com', data.id)}
                                            >
                                                {
                                                    data.post_com_rep_votes.some(x => x.user_id == userInfo?.user?.id && x.type == 'down') ?
                                                        <Icon 
                                                            name={'dislike1'}
                                                            size={24}
                                                            color={COLORS.black}
                                                        />
                                                    : 
                                                        <Icon 
                                                            name={'dislike2'}
                                                            size={24}
                                                            color={COLORS.black}
                                                        />
                                                }
                                            </TouchableOpacity>
                                        </View>
                                        {
                                            (!selectedCommentToReply || selectedCommentToReply?.id != data.id || !isCommentReply) ?
                                                    <TouchableOpacity
                                                        style={{
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: 60,
                                                            height: 40,
                                                            marginLeft: SIZES.base,
                                                            marginRight: SIZES.base
                                                        }}
                                                        onPress={() => { setSelectedCommentToReply(data); setSelectedReplyToReply(null); setIsCommentReply(true); setIsListRefereshed(`com-${data.id}`) }}
                                                    >
                                                        <Text
                                                            style={{
                                                                ...FONTS.h4,
                                                                color: COLORS.black,
                                                                height: 30
                                                            }}
                                                        >
                                                            {`Reply`}
                                                        </Text>
                                                    </TouchableOpacity>
                                                : 
                                                    null
                                        }
                                    </View>
                                    {
                                        !(!selectedCommentToReply || selectedCommentToReply?.id != data.id || !isCommentReply) ?
                                            userInfo && userInfo?.user && userInfo?.user?.id ?
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        flexDirection: 'row',
                                                        paddingHorizontal: SIZES.base,
                                                        paddingVertical: SIZES.base,
                                                        borderColor: COLORS.gray2,
                                                        borderWidth: 1,
                                                        borderRadius: SIZES.radius,
                                                        marginVertical: SIZES.base,
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            borderRadius: SIZES.radius,
                                                            backgroundColor: COLORS.lightGray2,
                                                            flex: 1
                                                        }}
                                                    >
                                                        <TextInput
                                                            ref={comment_input}
                                                            style={{
                                                                flex: 1,
                                                                ...FONTS.body3
                                                            }}
                                                            multiline
                                                            maxLength={3000}
                                                            value={commentReply}
                                                            onChangeText={(value) => {
                                                                setCommentReply(value);
                                                            }}
                                                            onLayout={() => {
                                                                // When the input size (textarea) changes, it updates the keyboard position.
                                                                if (Platform.OS == 'ios') {
                                                                    KeyboardManager.reloadLayoutIfNeeded();
                                                                }
                                                            }}
                                                            placeholder={'Add a reply...'}
                                                        />
                                                    </View>
                                                    <TouchableOpacity
                                                        onPress={() => handleCommentReply(commentReply, 'comment')}
                                                        style={{
                                                            height: Platform.OS == 'ios' ? 40 : 50,
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            marginHorizontal: SIZES.base
                                                        }}
                                                    >
                                                        <Icon
                                                            name={'rightcircle'}
                                                            size={30}
                                                            color={COLORS.black}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            :
                                                <TouchableOpacity
                                                    style={{
                                                        flex: 1,
                                                        flexDirection: 'row',
                                                        paddingHorizontal: SIZES.base,
                                                        paddingVertical: SIZES.base,
                                                        borderColor: COLORS.gray2,
                                                        borderWidth: 1,
                                                        borderRadius: SIZES.radius,
                                                        marginVertical: SIZES.base,
                                                        alignItems: 'center'
                                                    }}
                                                    onPress={() => navigation.navigate('SignInInit', { navigateTo: { screen: 'PostComReply', data: { post_id: route.params.post_id, comment_id: route.params.comment_id }}})}
                                                >
                                                    <View
                                                        style={{
                                                            borderRadius: SIZES.radius,
                                                            backgroundColor: COLORS.lightGray2,
                                                            flex: 1
                                                        }}
                                                        pointerEvents='none'
                                                    >
                                                        <TextInput
                                                            style={{
                                                                flex: 1,
                                                                ...FONTS.body3
                                                            }}
                                                            // editable={false}
                                                            placeholder={'Add a reply...'}
                                                        />
                                                    </View>
                                                    <View
                                                        style={{
                                                            height: Platform.OS == 'ios' ? 40 : 50,
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            marginHorizontal: SIZES.base
                                                        }}
                                                    >
                                                        <Icon
                                                            name={'rightcircle'}
                                                            size={30}
                                                            color={COLORS.black}
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                        : 
                                            null
                                    }
                                </View>
                            </View>
                        }
                        renderItem={({ item, index }) => {
                            return (
                                <>
                                    {/* {
                                        data.post.user_id == userInfo?.user?.id && item.user.blocked_user ? 
                                            null 
                                        :
                                        item.user.blocked_user ?
                                            null 
                                        : */}
                                            <View
                                                style={{
                                                    backgroundColor: COLORS.lightGray2,
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        borderBottomWidth: 1,
                                                        marginLeft: (40 + SIZES.base),
                                                        borderBottomColor: index == data.post_comment_replies.length || (index+1) % 10 == 0 ? 'transparent' : COLORS.gray2
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            paddingVertical: SIZES.base,
                                                            paddingHorizontal: SIZES.base,
                                                        }}
                                                    >
                                                        <TouchableOpacity
                                                            style={{
                                                                borderWidth: 1,
                                                                borderColor: COLORS.black,
                                                                borderRadius: 50,
                                                                overflow: 'hidden',
                                                                height: 32,
                                                                width: 32
                                                            }}
                                                            onPress={() => navigation.push('Profile', { user_id: item.user.id })}
                                                        >
                                                            <FastImage
                                                                source={{
                                                                    priority: FastImage.priority.high,
                                                                    uri: item?.user?.profile_pic ? item?.user?.profile_pic.startsWith("https://") ? `${item?.user?.profile_pic}` : `https://${item?.user?.profile_pic}` : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                                                                }}
                                                                style={{
                                                                    height: 30,
                                                                    width: 30
                                                                }}
                                                            />
                                                        </TouchableOpacity>
                                                        <View
                                                            style={{
                                                                flex: 1,
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                            }}
                                                        >
                                                            <TouchableOpacity
                                                                style={{
                                                                    flex: 1,
                                                                    alignItems: 'center',
                                                                    flexDirection: 'row',
                                                                    height: 30
                                                                }}
                                                                onPress={() => navigation.push('Profile', { user_id: item?.user?.id })}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        ...FONTS.h4,
                                                                        marginLeft: SIZES.base,
                                                                        color: COLORS.gray,
                                                                        alignSelf: 'center'
                                                                    }}
                                                                >
                                                                    {`${item?.user?.username}`}
                                                                </Text>
                                                                <IconE
                                                                    name={'dot-single'}
                                                                    size={20}
                                                                    color={COLORS.black}
                                                                    style={{ alignSelf: 'center' }}
                                                                />
                                                                <Text
                                                                    style={{
                                                                        ...FONTS.body4,
                                                                        color: COLORS.gray,
                                                                        alignSelf: 'center'
                                                                    }}
                                                                >
                                                                    {`${handleDateFormat(item.createdAt)}`}
                                                                </Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                style={{
                                                                    width: 40,
                                                                    alignItems: 'center',
                                                                }}
                                                                onPress={() => handleDotsPress(item, 'rep')}
                                                            >
                                                                <IconE
                                                                    name={'dots-three-vertical'}
                                                                    size={20}
                                                                    color={COLORS.black}
                                                                    style={{ alignSelf: 'center' }}
                                                                />
                                                                {/* <Icon 
                                                                    name={'exclamationcircleo'} 
                                                                    size={26} 
                                                                    color={COLORS.black}
                                                                /> */}
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    <View
                                                        style={{ marginLeft: SIZES.base, paddingRight: SIZES.radius }}
                                                    >
                                                        <Text
                                                            style={{ ...FONTS.body3, color: COLORS.black, }}
                                                        >
                                                            {   
                                                                item.reply_user ?
                                                                    <Text
                                                                        onPress={() => navigation.push('Profile', { user_id: item.reply_to_user_id })}
                                                                        style={{ ...FONTS.body3, color: COLORS.blue }}
                                                                    >
                                                                        {`@${item.reply_user.username} `}
                                                                    </Text>
                                                                : 
                                                                null
                                                            }
                                                            {`${item.content}`}
                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                            paddingVertical: SIZES.padding
                                                        }}
                                                    >
                                                        <View
                                                            style={{
                                                                flexDirection: 'row',
                                                                alignItems: 'center'
                                                            }}
                                                        >
                                                            <TouchableOpacity
                                                                style={{
                                                                    alignItems: 'center',
                                                                    marginLeft: SIZES.radius,
                                                                    width: 40,
                                                                    height: 40,
                                                                    justifyContent: 'center'
                                                                }}
                                                                onPress={() => voteOnComment('up', item.id, 'rep', route.params.comment_id)}
                                                            >
                                                                {
                                                                    item.post_com_rep_votes.some(x => x.user_id == userInfo?.user?.id && x.type == 'up') ?
                                                                        <Icon 
                                                                            name={'like1'}
                                                                            size={24}
                                                                            color={COLORS.black}
                                                                        />
                                                                    :  
                                                                        <Icon 
                                                                            name={'like2'}
                                                                            size={24}
                                                                            color={COLORS.black}
                                                                        />
                                                                }   
                                                            </TouchableOpacity>
                                                            <Text
                                                                style={{
                                                                    ...FONTS.h3,
                                                                    marginHorizontal: SIZES.base,
                                                                    color: COLORS.black,
                                                                    height: 30,
                                                                    alignSelf: 'center'
                                                                }}
                                                            >
                                                                {`${abbreviateNumber(item.PostComRepVoteCountUp - item.PostComRepVoteCountDown)}`}
                                                            </Text>
                                                            <TouchableOpacity
                                                                style={{
                                                                    alignItems: 'center',
                                                                    marginRight: SIZES.base,
                                                                    justifyContent: 'center',
                                                                    width: 40,
                                                                    height: 40
                                                                }}
                                                                // disabled={isVoteLoading.loading && isVoteLoading.id == elemRep.id}
                                                                onPress={() => voteOnComment('down', item.id, 'rep', route.params.comment_id)}
                                                            >
                                                                {
                                                                    item.post_com_rep_votes.some(x => x.user_id == userInfo?.user?.id && x.type == 'down') ?
                                                                        <Icon 
                                                                            name={'dislike1'}
                                                                            size={24}
                                                                            color={COLORS.black}
                                                                        />
                                                                    : 
                                                                        <Icon 
                                                                            name={'dislike2'}
                                                                            size={24}
                                                                            color={COLORS.black}
                                                                        />
                                                                }
                                                            </TouchableOpacity>
                                                        </View>
                                                        {
                                                            !selectedReplyToReply || selectedReplyToReply?.id != item.id ? 
                                                                    <TouchableOpacity
                                                                        style={{
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            width: 60,
                                                                            height: 40,
                                                                            marginLeft: SIZES.base,
                                                                            marginRight: SIZES.base
                                                                        }}
                                                                        onPress={() => { setCommentReply(''); setSelectedCommentToReply(null); setSelectedReplyToReply(item); setIsListRefereshed(`rep-${item.id}`); }}
                                                                    >
                                                                        <Text
                                                                            style={{
                                                                                ...FONTS.h4,
                                                                                color: COLORS.black
                                                                            }}
                                                                        >
                                                                            {`Reply`}
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                :
                                                                    null
                                                        }
                                                    </View>
                                                    {
                                                        !(!selectedReplyToReply || selectedReplyToReply?.id != item.id) ?
                                                            userInfo && userInfo?.user && userInfo?.user?.id ?
                                                                <View
                                                                    style={{
                                                                        flex: 1,
                                                                        flexDirection: 'row',
                                                                        paddingHorizontal: SIZES.base,
                                                                        paddingVertical: SIZES.base,

                                                                        borderColor: COLORS.gray2,
                                                                        borderWidth: 1,
                                                                        borderRadius: SIZES.radius,
                                                                        marginBottom: SIZES.base,
                                                                        alignItems: 'center'
                                                                    }}
                                                                >
                                                                    <View
                                                                        style={{
                                                                            borderRadius: SIZES.radius,
                                                                            backgroundColor: COLORS.lightGray2,
                                                                            flex: 1
                                                                        }}
                                                                    >
                                                                        <TextInput
                                                                            style={{
                                                                                flex: 1,
                                                                                ...FONTS.body3
                                                                            }}
                                                                            multiline
                                                                            maxLength={3000}
                                                                            onChangeText={(value) => {
                                                                                comRepTxt = value;
                                                                            }}
                                                                            onLayout={() => {
                                                                                // When the input size (textarea) changes, it updates the keyboard position.
                                                                                if (Platform.OS == 'ios') {
                                                                                    KeyboardManager.reloadLayoutIfNeeded();
                                                                                }
                                                                            }}
                                                                            placeholder={'Add a reply...'}
                                                                        />
                                                                    </View>
                                                                    <TouchableOpacity
                                                                        onPress={() => handleCommentReply(comRepTxt, 'reply_comment')}
                                                                        style={{
                                                                            height: Platform.OS == 'ios' ? 40 : 50,
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            marginHorizontal: SIZES.base
                                                                        }}
                                                                    >
                                                                        <Icon
                                                                            name={'rightcircle'}
                                                                            size={30}
                                                                            color={COLORS.black}
                                                                        />
                                                                    </TouchableOpacity>
                                                                </View>
                                                            :
                                                                <TouchableOpacity
                                                                    style={{
                                                                        flex: 1,
                                                                        flexDirection: 'row',
                                                                        paddingHorizontal: SIZES.base,
                                                                        paddingVertical: SIZES.base,
                                                                        borderColor: COLORS.gray2,
                                                                        borderWidth: 1,
                                                                        borderRadius: SIZES.radius,
                                                                        marginTop: SIZES.base,
                                                                        alignItems: 'center'
                                                                    }}
                                                                    onPress={() => navigation.navigate('SignInInit', { navigateTo: { screen: 'PostComReply', data: { post_id: route.params.post_id, comment_id: route.params.comment_id }}})}
                                                                >
                                                                    <View
                                                                        style={{
                                                                            borderRadius: SIZES.radius,
                                                                            backgroundColor: COLORS.lightGray2,
                                                                            flex: 1
                                                                        }}
                                                                        pointerEvents="none"
                                                                    >
                                                                        <TextInput
                                                                            style={{
                                                                                flex: 1,
                                                                                ...FONTS.body3
                                                                            }}
                                                                            // editable={false}
                                                                            placeholder={'Add a reply...'}
                                                                        />
                                                                    </View>
                                                                    <View
                                                                        style={{
                                                                            height: Platform.OS == 'ios' ? 40 : 50,
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            marginHorizontal: SIZES.base
                                                                        }}
                                                                    >
                                                                        <Icon
                                                                            name={'rightcircle'}
                                                                            size={30}
                                                                            color={COLORS.black}
                                                                        />
                                                                    </View>
                                                                </TouchableOpacity>
                                                        : null
                                                    }
                                                </View>
                                            </View>
                                    {/* } */}
                                    {/* {
                                        (index+1) % 10 == 0 ?
                                                <View
                                                    style={{
                                                        marginTop: SIZES.padding,
                                                        marginBottom: SIZES.padding,
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <BannerAd
                                                        unitId={adUnitIdB}
                                                        size={BannerAdSize.MEDIUM_RECTANGLE}
                                                        requestOptions={{
                                                            requestNonPersonalizedAdsOnly: true,
                                                        }}
                                                    />
                                                </View> 
                                            : 
                                                null
                                    }  */}
                                </>
                            )
                        }}
                        ListFooterComponent={
                            <View style={{ alignItems: 'center', backgroundColor: COLORS.lightGray2, paddingVertical: SIZES.padding }}>
                                {isLoadingExtra ? <ActivityIndicator /> : null}
                                {count <= data.post_comment_replies.length ? <Text>No more replies at the moment</Text> : null}
                            </View>
                        }
                    />
                    : null
                }
            </View>
            <View style={{ height: 10 }} />
        </KeyboardAvoidingView>
    )
}

export default PostComReply