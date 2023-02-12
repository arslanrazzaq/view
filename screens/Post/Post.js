import React, { useEffect, useState, useContext, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Platform,
    TextInput,
    FlatList,
    Dimensions,
    SafeAreaView,
    ActivityIndicator,
    Modal,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard
} from 'react-native';
import { COLORS, SIZES, FONTS, icons } from '../../constants';
import { IconButton, Header, PostCard, TextButton } from '../../components';
import Icon from 'react-native-vector-icons/AntDesign';
import IconE from 'react-native-vector-icons/Entypo';
import IconF5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import AnimatedLoader from "react-native-animated-loader";
import { BASE_URL } from '../../config';
import Share from 'react-native-share';
import { AuthContext } from '../../Context/authContext';
import FastImage from 'react-native-fast-image';
import ImageView from "react-native-image-viewing";
import moment from 'moment';
import { FlashList } from '@shopify/flash-list';
import { utils } from '../../utils';
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
const adUnitIdB = TestIds.BANNER;

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing'],
});

const ExpandableViewReply = ({ 
    navigation,
    itemR, 
    comment_id
}) => {
    return (
        <View
            style={{
                // marginLeft: SIZES.padding,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.gray2
            }}
        >
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingBottom: SIZES.radius
                }}
                onPress={() => { navigation.push('PostComReply', { post_id: itemR.post_id, comment_id: comment_id }) }}
            >
                <Icon
                    name={'plus'}
                    size={30}
                    color={COLORS.blue}
                />
                <Text
                    style={{
                        ...FONTS.body3,
                        flex: 1,
                        marginLeft: SIZES.base,
                        color: COLORS.blue
                    }}
                >
                    {`${itemR.PostComReplyCount} replies`}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

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

const Post = ({ navigation, route }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [comment, setComment] = useState('');
    const [commonError, setCommonError] = useState("");
    const [commonErrorDel, setCommonErrorDel] = useState("");
    
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

    const comment_input = useRef(null);
    const [images, setImages] = useState([]);
    const [imagesIndex, setImagesIndex] = useState(0);
    const [visible, setIsVisible] = useState(false);

    const [loaded, setLoaded] = useState(false);
    const [itemFromDot, setItemFromDot] = useState(null);
    const [isDeleteModel, setIsDeleteModel] = useState(false);
    const [isDeleteModelCom, setIsDeleteModelCom] = useState(false);
    const [isDotModel, setIsDotModel] = useState(false);
    const [isVoteLoading, setIsVoteLoading] = useState({ loading: false, id: null, type: null });
    const [selectedComFilter, setSelectedComFilter] = useState('top');

    const [isListRefereshed, setIsListRefereshed] = useState('');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const [isBlockModel, setIsBlockModel] = useState(false);
    const [isBlockModelError, setIsBlockModelError] = useState(false);
    const [isBlockModelConfirm, setIsBlockModelConfirm] = useState(false);


    const isEnabledComment = () => {
        return comment != "" && commentError == "" && userInfo?.user && userInfo?.user?.id
    }

    let listViewRef;
    
    function renderHeader() {
        return (
            <Header
                title="Post"
                titleStyle={{
                    color: COLORS.white
                }}
                containerStyle={{
                    height: 50,
                    marginTop: 0,
                    alignItems: 'center',
                    paddingHorizontal: SIZES.base,
                    backgroundColor: COLORS.black
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
                            borderColor: COLORS.white
                        }}
                        iconStyle={{
                            width: 30,
                            height: 20,
                            tintColor: COLORS.white,
                        }}
                        onPress={() => navigation.goBack()}
                    />
                }
                rightComponent={
                    <IconButton
                        icon={icons.home}
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
                            width: 20,
                            height: 20,
                            tintColor: COLORS.white,
                        }}
                        onPress={() => navigation.push('Home', { screen: 'Home' })}
                    />
                }
            />
        )
    }

    useEffect(() => {
        getPost();

        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            },
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            },
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };

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

    const getPost = async (isLoad=true, filter=selectedComFilter) => {
        setIsLoading(isLoad);
        if (isLoad) {
            setData({});
        }
        try {
            let user_id_to_send = null;
            if (userInfo?.user?.id) {
                user_id_to_send = userInfo.user.id
            }
            const response = await axios.get(`${BASE_URL}/single/post/${route.params.post_id}/10/1/${filter}/${user_id_to_send}`);
            setIsLoading(false);
            let dataToShow = response.data.data;
            for (let index = 0; index < dataToShow.post_comments.length; index++) {
                let elem = dataToShow.post_comments[index];
                elem.showHideComment = false;
            }
            let com = dataToShow.post_comments.filter((value, index, self) => index === self.findIndex((t) => (t.id === value.id)));
            let newRes = Object.assign({}, dataToShow);
            newRes.post_comments = com;
            if (newRes.post_comments.length < pageSize) {
                setCount(newRes.post_comments.length);
            } else {
                setCount(newRes.PostCommentCount);
            }
            setData(newRes);
            setPageSize(10);
            setCurrentPage(1);
        } catch (error) {
            if (error.response && error.response.status && (error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoading(false);
            } else if (error.response && error.response.status && error.response.status === 404) {
                setCommonErrorDel(error.response.data.msg);
                setIsLoading(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoading(false);
            }
        }
    }

    const getPostExtraComments = async (page, current, filter=selectedComFilter) => {
        setIsLoadingExtra(true);
        try {
            let user_id_to_send = null;
            if (userInfo?.user?.id) {
                user_id_to_send = userInfo.user.id
            }
            const response = await axios.get(`${BASE_URL}/single/post/${route.params.post_id}/${page}/${current}/${filter}/${user_id_to_send}`);
            let newResult = data;
            let combine = [...data.post_comments, ...response.data.data.post_comments];
            let newRes = combine.filter((value, index, self) => index === self.findIndex((t) => (t.id === value.id)));
            newResult.post_comments = newRes;
            newResult.PostCommentCount = response.data.data.PostCommentCount;
            newResult.PostVoteCount = response.data.data.PostVoteCount;
            for (let index = 0; index < newResult.post_comments.length; index++) {
                let elem = newResult.post_comments[index];
                if (!elem.hasOwnProperty('showHideComment')) {
                    elem.showHideComment = false
                }
            }
            if (response.data.data.post_comments.length <= 0 || response.data.data.post_comments.length < pageSize) {
                setCount(newResult.post_comments.length);
            } else {
                setCount(newResult.PostCommentCount);
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

    const handleShowHideComment = (val, index) => {
        let newResult = data;
        newResult.post_comments[index].showHideComment = val;
        setData(newResult);
    }

    const handleVotePressedWithAds = async () => {
        try {
            // setIsLoading(true);
            const response = await axios.post(`${BASE_URL}/post/vote`, { post_id: route.params.post_id, user_id: userInfo?.user?.id });
            getPost(false);
        } catch (error) {
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                // setIsLoading(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                // setIsLoading(false);
            }
        }
    }

    const voteOnComment = async (type, com_id, type_com_rep, main_com_id) => {
        let isLog = await utils.isLoggedIn();
        if (!userInfo?.user?.id && !isLog?.user?.id) {
            navigation.navigate('SignInInit', { navigateTo: { screen: 'post', data: { post_id: route.params.post_id }}});
            return;
        }
        setIsVoteLoading({ loading: true, id: com_id, type: type_com_rep });
        try {
            let dataObj = { 
                post_id: route.params.post_id,
                user_id:  userInfo?.user?.id || isLog?.user?.id,
                type: type, 
                type_com_rep: type_com_rep, 
                page_size: data.post_comments.length, 
                current_page: 1
            };
            
            if (type_com_rep == 'com') {
                dataObj.post_comment_id = com_id;
            } else if (type_com_rep == 'rep') {
                dataObj.post_comment_id = main_com_id;
                dataObj.post_comment_reply_id = com_id;
            }
            
            const response = await axios.post(`${BASE_URL}/post/vote/com`, dataObj);
            let dataToShow = response.data.data;
            let dataManuplate = {...data};
            let postCommentsToShow = dataManuplate.post_comments;
            for (let index = 0; index < postCommentsToShow.length; index++) {
                let elem = postCommentsToShow[index];
                if (elem.id == dataToShow.id) {
                    dataToShow.showHideComment = false;
                    postCommentsToShow[index] = dataToShow;
                }
                elem.showHideComment = false;
            }
            dataManuplate.post_comments = postCommentsToShow.slice(0, postCommentsToShow.length);
            setData({...dataManuplate});
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

    const handleVotePressed = async (post_id) => {
        if (!userInfo?.user?.id) {
            navigation.navigate('SignInInit', { navigateTo: { screen: 'post', data: { post_id: route.params.post_id }}});
            return;
        }
        handleVotePressedWithAds();
        //interstitial.show();
    }

    const handleSharePress = (post) => {

        const options = {
            title: `${post.post_title}`,
            url: `lhunt://post/${post.id}`,
        };

        Share.open(options)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                err && console.log(err);
            });
    }

    const handleReportPress = async (id, username) => {
        let isLog = await utils.isLoggedIn();
        if (!userInfo?.user?.id && !isLog?.user?.id) {
            navigation.push('SignInInit', { navigateTo: { screen: 'PostReport', data: { post_id: route.params.post_id, reported_username: `${username}@` }}});
        } else {
            navigation.push("PostReport", { post_id: route.params.post_id, user_id: userInfo?.user?.id || isLog?.user?.id, reported_username: `${username}@` });
        }
    }

    const handleDotsPress = async (item) => {
        setItemFromDot(item);
        setIsDotModel(true);
    }

    const handleFocusToTextInput = async () => {
        // if (comment_input && comment_input.current) {
        //     comment_input.current.focus();
        // }
        listViewRef.scrollToIndex({ index: 0, animated: true, viewOffset: 300 });
    }

    const handleDateFormat = (time) => {
        let output = moment(time).fromNow(true);
        return output;
    }

    const handleImagePress = (val, ind) => {
        let imgs = [];
        for (let index = 0; index < val.post_images.length; index++) {
            let elem = val.post_images[index];
            imgs.push({
                uri: elem.url.startsWith("https://") ? `${elem.url}` : `https://${elem.url}`
            });
        }
        setImages(imgs);
        setIsVisible(true);
        setImagesIndex(ind);
    }

    const handleCommentReply = async (val, type) => {
        if (!userInfo?.user?.id) {
            navigation.navigate('SignInInit', { navigateTo: { screen: 'post', data: { post_id: route.params.post_id }}});
            return;
        }

        try {
            setIsLoading(true);
            let data = {};
            if (type == 'comment') {
                data = { post_comment_id: selectedCommentToReply.id, user_id: userInfo?.user?.id, content: val }; 
            } else {
                data = { post_comment_id: selectedCommentToReply.id, reply_to_user_id: selectedReplyToReply.user_id, user_id: userInfo?.user?.id, content: val };
            }
            const response = await axios.post(`${BASE_URL}/comment/reply/create`, data);
            comRepTxt = '';
            setIsListRefereshed('');
            setComment('');
            setCommentReply('');
            setSelectedCommentToReply(null);
            setSelectedReplyToReply(null);
            getPost();
        } catch (error) {
            setIsListRefereshed('');
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoading(false);
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

    const handleReplyCommentNext = async (val) => {
        let isLog = await utils.isLoggedIn();
        if (!userInfo?.user?.id && !isLog?.user?.id) {
            navigation.navigate('SignInInit', { navigateTo: { screen: 'PostComReply', data: { post_id: route.params.post_id, comment_id: val.id, focusToComment: true }}});
            return;
        } else {
            navigation.push('PostComReply', { post_id: route.params.post_id, comment_id: val.id, focusToComment: true });
        }
    }
    
    const handleComment = async () => {
        if (!userInfo?.user?.id) {
            navigation.navigate('SignInInit', { navigateTo: { screen: 'post', data: { post_id: route.params.post_id }}});
            return;
        }
        try {
            setIsLoading(true);
            const response = await axios.post(`${BASE_URL}/comment/post/create`, { post_id: route.params.post_id, post_user_id: data?.user?.id, user_id: userInfo?.user?.id, content: comment });
            setIsListRefereshed('');
            setComment('');
            setCommentReply('');
            setSelectedCommentToReply(null);
            comRepTxt = '';
            getPost();
        } catch (error) {
            setIsListRefereshed('');
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoading(false);
                setSelectedCommentToReply(null);
                setComment('');
                comRepTxt = '';
                setCommentReply('')
            } else if (error.response && error.response.status && error.response.status === 401) {
                setCommonError(error.response.data.msg);
                setIsLoading(false);
                setIsBlockModelError(true);
                setComment('');
                comRepTxt = '';
                setCommentReply('');
                setSelectedCommentToReply(null);
            }  else {
                setCommonError('Unknown Error, Try again later');
                setIsLoading(false);
                setSelectedCommentToReply(null);
                setComment('');
                comRepTxt = '';
                setCommentReply('');
            }
        }
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

    const handleDelete = () => {
        setIsDeleteModel(true);
    }

    function renderConfirmDeleteModal() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={isDeleteModel}
            >
                <TouchableWithoutFeedback
                    onPress={() => setIsDeleteModel(false)}
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
                                Do you want to delete this?
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
                                    onPress={() => handleDeleteApi()}
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
                                    onPress={() => setIsDeleteModel(false)}
                                    disabled={isLoading}
                                />
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
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
                                    onPress={() => handleDeleteApiCom()}
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
                                                justifyContent: 'center'
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
                            </View>
                           
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
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    const handleDeleteApi = async () => {
        try {
            setIsDeleteModel(false);
            setIsLoading(true);
            const response = await axios.delete(`${BASE_URL}/post/delete`, { data: { id: route.params.post_id } });
            setIsLoading(false);
            navigation.navigate('Home');
        } catch (error) {
            setIsDeleteModel(false);
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoading(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoading(false);
            }
        }
    }

    const handleConfirmBlock = async () => {
        
        if (!userInfo?.user?.id) {
            navigation.navigate('SignInInit', { navigateTo: { screen: 'post', data: { post_id: route.params.post_id }}});
            return;
        }

        try {
            setIsBlockModelConfirm(false);
            setIsLoading(true);
            const response = await axios.post(`${BASE_URL}/user/block`, { user_id: userInfo?.user?.id, post_user_id: data.user_id, is_post_user: data.user_id == userInfo?.user?.id ? 1 : 0, blocked_user_id: itemFromDot?.user?.id });
            getPost();
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

    const handleDeleteApiCom = async () => {
        try {
            setIsDeleteModelCom(false);
            setIsLoading(true);
            const response = await axios.delete(`${BASE_URL}/post/comment/delete`, { data: { id: route.params.post_id, comment_id: itemFromDot.id } });
            setItemFromDot(null);
            getPost();
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

    const handleComFilter = async (val) => {
        setSelectedComFilter(val);
        getPost(true, val);
    } 

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : ""}
            style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}
        >
            <SafeAreaView> 
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
            
            { isDeleteModel ? renderConfirmDeleteModal() : null }
            { isDeleteModelCom ? renderConfirmDeleteModalCom() : null }
            { isDotModel ? renderDotsModal() : null }
            { isBlockModel ? renderBlockModal() : null }
            { isBlockModelConfirm ? renderBlockModalConfirm() : null }
            { isBlockModelError ? renderBlockModalError() : null }
            
            <ImageView
                images={images}
                imageIndex={imagesIndex}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
            />
            <View
                style={{
                    marginHorizontal: SIZES.base,
                    marginBottom: SIZES.radius,
                    borderRadius: SIZES.radius,
                    flex: 1
                }}
            >
                {   data && Object.keys(data).length > 0 ? 
                        <FlashList 
                            ref={(ref) => {
                                listViewRef = ref;
                            }}
                            keyboardShouldPersistTaps='handled'
                            extraData={isListRefereshed}
                            data={data.post_comments}
                            keyExtractor={x => `${x.id}`}
                            showsVerticalScrollIndicator={false}
                            onEndReachedThreshold={0.2}
                            disableAutoLayout={true}
                            estimatedItemSize={200}
                            onEndReached={() => {
                                if (count > 0 && count > data.post_comments.length &&!isLoading &&!isLoadingExtra) {
                                    console.log('called');
                                    getPostExtraComments(pageSize, currentPage + 1);
                                }
                            }}
                            ListHeaderComponent={
                                <PostCard
                                    containerStyle={{
                                        alignItems: 'center',
                                    }}
                                    imageStyle={{
                                        //height: Dimensions.get('window').width + 30,
                                        height: 495,
                                        width: Dimensions.get('window').width - (SIZES.base * 2),
                                    }}
                                    userImageStyle={{
                                        height: 40,
                                        width: 40
                                    }}
                                    isShowDelete={userInfo?.user?.id == data?.user?.id}
                                    onDeletePress={() => handleDelete()}
                                    post={data}
                                    is_voted={userInfo && userInfo?.user && userInfo?.user?.id && data.post_votes.some(x => x.user_id == userInfo?.user?.id) ? true : false}
                                    onPress={() => navigation.push("Profile", { user_id: data.user_id })}
                                    onPressVote={() => handleVotePressed(data.id)}
                                    onSharePress={() => handleSharePress(data)}
                                    onReportPress={() => handleReportPress(data.id, data.user.username)}
                                    onImagePress={(index) => handleImagePress(data, index)}
                                    onTitlePress={() => { return; }}
                                    isLightBoxEnabled={true}
                                    childern={
                                        <View
                                            style={{
                                                flex: 1,
                                                width: '100%',
                                                paddingHorizontal: SIZES.radius,
                                                paddingBottom: SIZES.radius
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flex: 1,
                                                    paddingVertical: SIZES.padding * 2,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: COLORS.gray2
                                                }}
                                            >
                                                <Text
                                                    style={{ ...FONTS.h3, color: COLORS.black, marginBottom: SIZES.base }}
                                                >
                                                    {`1. Where are you going in this outfit?`}
                                                </Text>
                                                <Text
                                                    style={{ ...FONTS.body3, color: COLORS.black }}
                                                >
                                                    {`${data.my_height || ''}`}
                                                </Text>
                                            </View>
                                            <View
                                                style={{
                                                    flex: 1,
                                                    paddingTop: SIZES.radius,
                                                    paddingBottom: SIZES.padding * 2,
                                                    borderBottomColor: COLORS.gray2,
                                                    borderBottomWidth: data.styling_tips && data.styling_tips.trim().length > 0 ? 1 : 0
                                                }}
                                            >
                                                <Text
                                                    style={{ ...FONTS.h3, color: COLORS.black, marginBottom: SIZES.base }}
                                                >
                                                    {`2. Why did you choose this outfit?`}
                                                </Text>
                                                <Text
                                                    style={{ ...FONTS.body3, color: COLORS.black }}
                                                >
                                                    {`${data.outfit || ''}`}
                                                </Text>
                                            </View>
                                            {   data.styling_tips && data.styling_tips.trim().length > 0 ? 
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                            paddingTop: SIZES.radius,
                                                            paddingBottom: SIZES.padding * 2
                                                        }}
                                                    >
                                                        <Text
                                                            style={{ ...FONTS.h3, color: COLORS.black, marginBottom: SIZES.base }}
                                                        >
                                                            {`3. Please share your styling tips`}
                                                        </Text>
                                                        <Text
                                                            style={{ ...FONTS.body3, color: COLORS.black }}
                                                        >
                                                            {`${data.styling_tips || ''}`}
                                                        </Text>
                                                    </View> 
                                                : 
                                                    null 
                                            }
                                            <View
                                                style={{
                                                    flex: 1,
                                                    paddingBottom: SIZES.base,
                                                }}
                                            >
                                                <Text
                                                    style={{ ...FONTS.h2, fontWeight: 'bold', color: COLORS.black }}
                                                >
                                                    {`Feedback on this outfit`}
                                                </Text>
                                                {/* <Text
                                                    style={{ ...FONTS.body3, color: COLORS.red }}
                                                >
                                                    (Strictly no hateful feedback, no advertising, 
                                                        no spam. Rulebreakers will be banned)
                                                </Text> */}
                                            </View>
                                            { 
                                                userInfo && userInfo?.user && userInfo?.user?.id ?
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                            flexDirection: 'row',
                                                            paddingHorizontal: SIZES.base,
                                                            paddingVertical: SIZES.base,
                                                            borderColor: COLORS.gray2,
                                                            borderWidth: 1,
                                                            borderRadius: SIZES.radius
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
                                                                onLayout={() => {
                                                                    // When the input size (textarea) changes, it updates the keyboard position.
                                                                    if (Platform.OS == 'ios') {
                                                                        KeyboardManager.reloadLayoutIfNeeded();
                                                                    }
                                                                }}
                                                                maxLength={3000}
                                                                value={comment}
                                                                onChangeText={(value) => {
                                                                    setComment(value)
                                                                }}
                                                                placeholder={'Give your feedback...'}
                                                            />
                                                        </View>
                                                        <TouchableOpacity
                                                            onPress={() => handleComment()}
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
                                                            borderRadius: SIZES.radius
                                                        }}
                                                        onPress={() => navigation.navigate('SignInInit', { navigateTo: { screen: 'post', data: { post_id: route.params.post_id }}})}
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
                                                                placeholder={'Give your feedback...'}
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
                                            }
                                            <View
                                                style={{
                                                    marginTop: SIZES.padding,
                                                    marginBottom: SIZES.radius,
                                                    flexDirection: 'row'
                                                }}
                                            >
                                                <TextButton
                                                    buttonContainerStyle={{
                                                        height: 40,
                                                        width: 100,
                                                        borderRadius: SIZES.padding,
                                                        marginRight: SIZES.radius,
                                                        backgroundColor: selectedComFilter == 'top' ? COLORS.black : COLORS.lightGray1
                                                    }}
                                                    labelStyle={{
                                                        color: COLORS.white,
                                                        ...FONTS.h4
                                                    }}
                                                    label={
                                                        <Text style={{ color: selectedComFilter == 'top' ? COLORS.white : COLORS.black, ...FONTS.h3 }}>Top</Text>
                                                    }
                                                    onPress={() => handleComFilter('top')}
                                                    disabled={isLoading}
                                                />
                                                <TextButton
                                                    buttonContainerStyle={{
                                                        height: 40,
                                                        width: 100,
                                                        borderRadius: SIZES.padding,
                                                        backgroundColor: selectedComFilter == 'new' ? COLORS.black : COLORS.lightGray1
                                                    }}
                                                    labelStyle={{
                                                        color: COLORS.white,
                                                        ...FONTS.h4
                                                    }}
                                                    label={
                                                        <Text style={{ color: selectedComFilter == 'new' ? COLORS.white : COLORS.black, ...FONTS.h3 }}>New</Text>
                                                    }
                                                    onPress={() => handleComFilter('new')}
                                                    disabled={isLoading}
                                                />
                                            </View>
                                        </View>
                                    }
                                />
                            }
                            renderItem={({ item, index }) => {
                                return (
                                    item.user ? 
                                        <>
                                            {/* {
                                                data.user_id == userInfo?.user?.id && item.user.blocked_user ? 
                                                        null 
                                                    :
                                                    item.user.blocked_user ? 
                                                        null
                                                    : */}
                                                        <View
                                                            key={item.id}
                                                            style={{ 
                                                                paddingTop: SIZES.base, 
                                                                backgroundColor: COLORS.lightGray2, 
                                                                paddingHorizontal: SIZES.base
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
                                                                    onPress={() => navigation.push('Profile', { user_id: item?.user?.id })}
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
                                                                        justifyContent: 'space-between'
                                                                    }}
                                                                >
                                                                    <TouchableOpacity
                                                                        style={{
                                                                            flex: 1,
                                                                            flexDirection: 'row',
                                                                            alignItems: 'center',
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
                                                                        onPress={() => handleDotsPress(item)}
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
                                                                style={{ ...FONTS.body3, flex: 1, marginLeft: SIZES.base, color: COLORS.black }}
                                                            >
                                                                {`${item.content}`}
                                                            </Text>
                                                            <View
                                                                style={{
                                                                    borderBottomWidth: (data.post_comments.length - 1 === index || item.PostComReplyCount > 0 || (index+1) % 10 == 0) ? 0 : 1,
                                                                    borderBottomColor: COLORS.gray2
                                                                }}
                                                            >
                                                                <View
                                                                    style={{
                                                                        flexDirection: 'row',
                                                                        justifyContent: 'space-between',
                                                                        paddingVertical: SIZES.padding,
                                                                    }}
                                                                >
                                                                    <View
                                                                        style={{
                                                                            flexDirection: 'row',
                                                                            alignItems: 'center',
                                                                        }}
                                                                    >
                                                                        <TouchableOpacity
                                                                            style={{
                                                                                justifyContent: 'center',
                                                                                alignItems: 'center',
                                                                                marginLeft: SIZES.radius,
                                                                                width: 40,
                                                                                height: 40
                                                                            }}
                                                                            // disabled={isVoteLoading.loading && isVoteLoading.id == item.id}
                                                                            onPress={() => voteOnComment('up', item.id, 'com', item.id)}
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
                                                                            {`${abbreviateNumber(item.PostComVoteCountUp - item.PostComVoteCountDown)}`}
                                                                        </Text>
                                                                        <TouchableOpacity
                                                                            style={{
                                                                                justifyContent: 'center',
                                                                                alignItems: 'center',
                                                                                marginRight: SIZES.base,
                                                                                width: 40,
                                                                                height: 40,
                                                                            }}
                                                                            // disabled={isVoteLoading.loading && isVoteLoading.id == item.id}
                                                                            onPress={() => voteOnComment('down', item.id, 'com', item.id)}
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
                                                                        {/* {isVoteLoading.loading && isVoteLoading.id == item.id && isVoteLoading.type == 'com' ? <ActivityIndicator /> : null} */}
                                                                    </View>
                                                                    {
                                                                        (!selectedCommentToReply || selectedCommentToReply?.id != item.id || !isCommentReply) ?
                                                                                <TouchableOpacity
                                                                                    style={{
                                                                                        alignItems: 'center',
                                                                                        justifyContent: 'center',
                                                                                        height: 40,
                                                                                        width: 60,
                                                                                        marginRight: SIZES.base,
                                                                                        marginLeft: SIZES.base
                                                                                    }}
                                                                                    onPress={() => { 
                                                                                        handleReplyCommentNext(item);
                                                                                        //setSelectedCommentToReply(item); setIsCommentReply(true); setIsListRefereshed(`com-${item.id}`) 
                                                                                    }}
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
                                                                    !(!selectedCommentToReply || selectedCommentToReply?.id != item.id || !isCommentReply) ?
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
                                                                                        style={{
                                                                                            flex: 1,
                                                                                            ...FONTS.body3
                                                                                        }}
                                                                                        multiline
                                                                                        maxLength={3000}
                                                                                        // value={comRepTxt}
                                                                                        onChangeText={(value) => {
                                                                                            setCommentReply(value);
                                                                                            comRepTxt = value;
                                                                                        }}
                                                                                        placeholder={'Add a reply...'}
                                                                                    />
                                                                                </View>
                                                                                <TouchableOpacity
                                                                                    onPress={() => handleCommentReply(comRepTxt, 'comment')}
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
                                                                                onPress={() => navigation.navigate('SignInInit', { navigateTo: { screen: 'post', data: { post_id: route.params.post_id }}})}
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
                                                            {
                                                                item.PostComReplyCount ?
                                                                    <ExpandableViewReply
                                                                        itemR={item}
                                                                        comment_id={item.id}
                                                                        navigation={navigation}
                                                                    />
                                                                    : null
                                                            }
                                                        </View>
                                                    
                                            {/* } */}
                                        </> 
                                    : 
                                        null
                                )
                            }}
                            ListFooterComponent={
                                <View style={{ alignItems: 'center' }}>
                                    {isLoadingExtra ? <ActivityIndicator /> : null}
                                    {count == data.post_comments.length || data.post_comments.length == 0 ? <Text style={{ paddingVertical: SIZES.padding }} >No more comments at the moment</Text> : null}
                                </View>
                            }
                        />
                    : commonErrorDel && commonErrorDel.length > 0 ? 
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    ...FONTS.h3,
                                    color: COLORS.black,
                                }}
                            >
                                {`${commonErrorDel}`}
                            </Text>
                        </View>
                    : null
                }
            </View>
            {   !isKeyboardVisible && data?.post_comments?.length > 0 ? 
                        <View>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: COLORS.blueTwitter,
                                    width: 50,
                                    height: 50,
                                    borderRadius: 33,
                                    justifyContent: 'center',
                                    alignItems:'center',
                                    position: 'absolute',
                                    bottom: 20,
                                    right: 20
                                }}
                                onPress={() => handleFocusToTextInput()}
                            >
                                <Icon
                                    name={'message1'}
                                    size={30}
                                    color={COLORS.white}
                                />
                            </TouchableOpacity>
                        </View>
                    :   
                        null
                }
            <View style={{ height: 10 }} />
        </KeyboardAvoidingView>
    )
}

export default Post