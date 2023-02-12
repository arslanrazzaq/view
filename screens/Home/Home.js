import React, { useState, useContext, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Platform,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    TouchableWithoutFeedback,
    FlatList,
    StatusBar
} from 'react-native';
import { FONTS, SIZES, COLORS } from '../../constants';
import { PostCard, TextButton, TextIconButton, FormPicker } from '../../components';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { AuthContext } from '../../Context/authContext';
import CountDown from 'react-native-countdown-component';
import moment from 'moment';
import { BASE_URL } from '../../config';
import Share from 'react-native-share';
// import { InterstitialAd, BannerAd, BannerAdSize, TestIds, AdEventType } from 'react-native-google-mobile-ads';
import FilterModal from './FilterModal';
import FastImage from 'react-native-fast-image';
import { FlashList } from '@shopify/flash-list';
import * as Keychain from 'react-native-keychain';


// const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
// const adUnitId = TestIds.INTERSTITIAL;
// const adUnitIdB = TestIds.BANNER;

// const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
//     requestNonPersonalizedAdsOnly: true,
//     keywords: ['fashion', 'clothing'],
// });

// const banner = BannerAd.createForAdRequest(adUnitIdB, {
//     requestNonPersonalizedAdsOnly: true,
//     keywords: ['fashion', 'clothing'],
// });

let selectedUser = null;
let selectedPostToGo = null;
let filterApplied = {};
let firstRun = true;

const Home = ({ navigation }) => {

    const [menuList, setMenuList] = React.useState([]);
    const [showFilterModal, setShowFilterModal] = React.useState(false);
    const [sortFilter, setSortFilter] = React.useState('Today');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingExtra, setIsLoadingExtra] = useState(false);
    const [commonError, setCommonError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [count, setCount] = useState(0);
    const [loaded, setLoaded] = useState(false);
    
    const [ageValues, setAgeValues] = useState([0, 100]);
    const [nationality, setNationality] = useState('ALL');
    const [isMale, setIsMale] = useState(true);
    const [isFemale, setIsFemale] = useState(true);
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [postLayout, setPostLayout] = useState('post');
    const [firstVisit, setFirstVisit] = useState(false);
    const [countdownTime, setCountdowntime] = useState(0);

    const [isTime, setIsTime] = useState(true);
    const flashListRef = useRef(null);
    // const [isStatusBarHidden, setIsStatusBarHidden] = useState(false);

    const { userInfo, interstitial, setIsStatusBarHidden } = useContext(AuthContext);

    const isLoggedIn = async () => {
        try {
            // Retrieve the credentials
            const credentials = await Keychain.getGenericPassword({ service: 'lh-s-token' });
            if (credentials && credentials.username && credentials.password) {
                return { token: credentials.username, user: JSON.parse(credentials.password), isLoggedIn: true };
            } else {
                return { token: null, user: {}, isLoggedIn: false };
            }
        } catch (error) {
            return { token: null, user: {}, isLoggedIn: false };
        }
    };

    useEffect(() => {
        getPosts(currentPage, sortFilter, isFilterApplied);
        setTimeout(() => {
            setIsTime(false);
            setCountdowntime(getTimeCountDown());   
            setIsTime(true);        
        }, 500);
        //countdownTime = getTimeCountDown();
    }, []);

    const getPosts = async (current, filter, isFilterApply) => {
        setIsLoading(true);
        setMenuList([]);
        try {
            let bodyObj = {};
            if (filter === 'New' || filter === 'All Time') {
                bodyObj = {
                    page_size: pageSize,
                    current_page: current,
                    filter: filter
                }
            } else if (filter === 'Week') {
                let currentd = moment();
                let next = moment(currentd).subtract(7, 'd');
                bodyObj = {
                    page_size: pageSize,
                    current_page: current,
                    filter: 'Past Week',
                    next: next,
                    current: currentd
                }
            } else if (filter === 'Month') {
                let currentd = moment();
                let next = moment(currentd).subtract(30, 'd');
                bodyObj = {
                    page_size: pageSize,
                    current_page: current,
                    filter: 'Past Month',
                    next: next,
                    current: currentd
                }
            } else if (filter === 'Today') {
                let currentd = moment();
                let next = moment(currentd).subtract(1, 'd');
                bodyObj = {
                    page_size: pageSize,
                    current_page: current,
                    filter: filter,
                    next: next,
                    current: currentd
                }
            } else if (filter === 'Yesterday') {
                let currentd = moment().subtract(1, 'days');
                let next = moment(currentd).subtract(1, 'days');
                bodyObj = {
                    page_size: pageSize,
                    current_page: current,
                    filter: filter,
                    next: next,
                    current: currentd
                }
            }
            if (isFilterApply) {
                bodyObj.nationality = filterApplied.nationality;
                bodyObj.gender = filterApplied.gender;
                let val1 = moment().subtract(filterApplied.ageValues[0], 'years').endOf('year');
                let val2 = moment().subtract(filterApplied.ageValues[1], 'years').startOf('year');
                bodyObj.age = [val1, val2];
                bodyObj.isFilterApply = true;
            } else {
                bodyObj.isFilterApply = false;
            }
            const response = await axios.post(`${BASE_URL}/post/list`, bodyObj);
            let newRes = response.data.data.filter((value, index, self) => index === self.findIndex((t) => (t.id === value.id)));
            setIsLoading(false);
            setMenuList(newRes);
            flashListRef.current?.scrollToIndex(0);
            if (newRes.length < pageSize) {
                setCount(newRes.length);                
            } else {
                setCount(response.data.count);
            }
            if (newRes.length <= 0) {
                firstRun = false;
                setFirstVisit(true);
            } else {
                firstRun = false;
                setFirstVisit(false);
            }
        } catch (error) {
            console.log('called err: ', error);
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoading(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoading(false);
            }
            if (firstRun) {
                firstRun = false;
                setFirstVisit(true);
            } else {
                firstRun = false;
                setFirstVisit(false);
            }
        }
    }

    const getExtraPosts = async (page, current, filter, isFilterApply) => {
        setIsLoadingExtra(true);
        try {
            let bodyObj = {};
            if (filter === 'New' || filter === 'All Time') {
                bodyObj = {
                    page_size: pageSize,
                    current_page: current,
                    filter: filter
                }
            } else if (filter === 'Week') {
                let currentd = moment();
                let next = moment(currentd).subtract(7, 'd');
                bodyObj = {
                    page_size: pageSize,
                    current_page: current,
                    filter: 'Past Week',
                    next: next,
                    current: currentd
                }
            } else if (filter === 'Month') {
                let currentd = moment();
                let next = moment(currentd).subtract(30, 'd');
                bodyObj = {
                    page_size: pageSize,
                    current_page: current,
                    filter: 'Past Month',
                    next: next,
                    current: currentd
                }
            } else if (filter === 'Today') {
                let currentd = moment();
                let next = moment(currentd).subtract(1, 'd');
                bodyObj = {
                    page_size: pageSize,
                    current_page: current,
                    filter: filter,
                    next: next,
                    current: currentd
                }
            } else if (filter === 'Yesterday') {
                let currentd = moment().subtract(1, 'days');
                let next = moment(currentd).subtract(1, 'days');
                bodyObj = {
                    page_size: pageSize,
                    current_page: current,
                    filter: filter,
                    next: next,
                    current: currentd
                }
            }
            if (isFilterApply) {
                bodyObj.nationality = filterApplied.nationality;
                bodyObj.gender = filterApplied.gender;
                let val1 = moment().subtract(filterApplied.ageValues[0], 'years').endOf('year');
                let val2 = moment().subtract(filterApplied.ageValues[1], 'years').startOf('year');
                bodyObj.age = [val1, val2];
                bodyObj.isFilterApply = true;
            } else {
                bodyObj.isFilterApply = false;
            }
            const response = await axios.post(`${BASE_URL}/post/list`, bodyObj);
            let combine = [...menuList, ...response.data.data];
            let newRes = combine.filter((value, index, self) => index === self.findIndex((t) => (t.id === value.id)));
            setMenuList(newRes);
            if (response.data.data.length <= 0) {
                setCount(menuList.length);
            } else {
                setCount(response.data.count);
            }
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

    function renderFiltersButtons() {
        return (
            <View
                style={{
                    marginHorizontal: SIZES.base,
                    marginTop: SIZES.radius,
                    paddingBottom: SIZES.base,
                    borderBottomWidth: 2,
                    borderBottomColor: COLORS.lightGray1
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <TextIconButton 
                        containerStyle={{
                            height: 40,
                            flex: 1,
                            alignItems: 'center',
                            borderRadius: SIZES.radius,
                            backgroundColor: COLORS.lightGray1,
                            // borderWidth: 1,
                            // borderColor: COLORS.g,
                            marginRight: SIZES.base
                        }}
                        icon={
                            <>
                                <Icon1 name={'sliders'} size={24} color={COLORS.black} />
                                {   Object.keys(filterApplied).length > 0 && isFilterApplied ? 
                                        filterApplied?.nationality == 'ALL' && filterApplied?.ageValues[0] == 0 && filterApplied?.ageValues[1] == 100 && filterApplied?.gender == 'both' ?
                                            null 
                                        :
                                            <View 
                                                style={{
                                                    marginLeft: SIZES.base,
                                                    top: -8
                                                }}>
                                                <Icon1 name={'circle'} size={12} color={COLORS.red} /> 
                                            </View>
                                    :
                                        null
                            }
                            </>
                        }
                        iconPosition="RIGHT"
                        iconStyle={{
                            tintColor: COLORS.black
                        }}
                        label={"Filter"}
                        labelStyle={{
                            marginRight: SIZES.radius,
                            color: COLORS.black,
                            ...FONTS.h3
                        }}
                        onPress={() => setShowFilterModal(true)}
                    />
                    <View
                        style={{
                            flex: 1,
                            // borderWidth: 1,
                            // borderColor: COLORS.black,
                            borderRadius: SIZES.radius,
                            backgroundColor: COLORS.lightGray1,
                            justifyContent: 'center',
                            marginRight: SIZES.base
                        }}
                    >
                        <FormPicker
                            label=""
                            containerStyle={{
                                backgroundColor: COLORS.lightGray1,
                            }}
                            inputContainerStyle={{
                                backgroundColor: COLORS.lightGray1,
                                color: COLORS.black,
                                ...FONTS.h3,
                            }}
                            onChange={(value) => {
                                setSortFilter(value);
                                setCurrentPage(1);
                                getPosts(1, value, isFilterApplied);
                            }}
                            value={sortFilter}
                            modalVisible={modalVisible}
                            items={[
                                { label: 'New', value: 'New' },
                                { label: 'Today', value: 'Today' },
                                { label: 'Yesterday', value: 'Yesterday' },
                                { label: 'Week', value: 'Week' },
                                { label: 'Month', value: 'Month' },
                                { label: 'All Time', value: 'All Time' }
                            ]}
                            setModalVisible={(value) => setModalVisible(value)}
                            appendComponent={
                                <View
                                // onPress={() => setModalVisible(true)}
                                >
                                    {modalVisible ? <Icon
                                        name={'up'}
                                        size={24}
                                        color={COLORS.black}
                                    /> : <Icon
                                        name={'down'}
                                        size={24}
                                        color={COLORS.black}
                                    />}
                                </View>
                            }
                        />
                    </View>
                    <TouchableOpacity
                        style={{
                            height: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: SIZES.radius,
                            backgroundColor: COLORS.lightGray1,
                            // borderWidth: 1,
                            width: 50,
                            // borderColor: COLORS.black,
                            marginRight: SIZES.base
                        }}
                        onPress={() => { if (postLayout == 'post') { setIsTime(false); setCountdowntime(getTimeCountDown()); setIsTime(true); setPostLayout('image') } else { setIsTime(false); setCountdowntime(getTimeCountDown()); setIsTime(true); setPostLayout('post') } }}
                    >
                       {    
                            postLayout == 'post' ? 
                                <Icon2 name={'grid'} size={24} color={COLORS.black} />
                            : 
                                <Icon2 name={'book'} size={24} color={COLORS.black} />
                       } 
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const getTimeCountDown = () => {
        const scheduledDate = moment.utc().add(1, 'd').set({ hour: 1, minute: 0, second: 0, millisecond: 0 });
        let diff = moment.duration(scheduledDate.diff(moment().utc()));
        return diff.asSeconds();
    }

    function renderContestTimer() {
        return (
            <View
                style={{
                    marginVertical: SIZES.padding,
                    marginHorizontal: SIZES.base,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text
                    style={Platform.OS == 'ios' ? {
                        color: COLORS.black,
                        ...FONTS.body2,
                    } : {
                        color: COLORS.black,
                        ...FONTS.body3,
                    }}
                >
                    <Text style={Platform.OS == 'ios' ? {
                        color: COLORS.black,
                        ...FONTS.body2,
                        fontWeight: 'bold',
                    } : {
                        color: COLORS.black,
                        ...FONTS.h3,
                        fontWeight: 'bold',
                    }}>Today’s OOTD Challenge </Text>
                </Text>
                <Text
                    style={Platform.OS == 'ios' ? {
                        color: COLORS.black,
                        ...FONTS.body2,
                        marginBottom: SIZES.radius
                    } : {
                        color: COLORS.black,
                        ...FONTS.body3,
                        marginBottom: SIZES.radius
                    }}
                >
                    ends in
                </Text>
                {   
                    isTime ? <CountDown
                        size={30}
                        until={countdownTime}
                        digitStyle={{ borderWidth: 1, borderColor: COLORS.black }}
                        digitTxtStyle={{ color: COLORS.black }}
                        // timeLabelStyle={{ color: 'red', fontWeight: 'bold' }}
                        separatorStyle={{ color: COLORS.black }}
                        timeToShow={['H', 'M', 'S']}
                        timeLabels={{ m: null, s: null }}
                        showSeparator
                        onFinish={() => { setIsTime(false); setCountdowntime(getTimeCountDown()); setIsTime(true); }}
                    /> : null
                }
            </View>
        )
    }

    const handleVotePressedWithAds = async () => {
        try {
            // setIsLoading(true);
            let data = { post_id: selectedUser.post, user_id: selectedUser.user };
            console.log(data);
            const response = await axios.post(`${BASE_URL}/post/vote`, data);
            if (response.data.data) {
                for (let index = 0; index < selectedUser.menuList.length; index++) {
                    const elem = selectedUser.menuList[index];
                    if (elem.id == selectedUser.post) {
                        selectedUser.menuList[index] = response.data.data;
                        setMenuList(selectedUser.menuList.slice(0, selectedUser.menuList.length));
                        break;
                    }
                }
            } else {
                navigation.push('post', { post_id: response.data.post_id });
            }
            // setIsLoading(false);
        } catch (error) {
            console.log(error.response.data);
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                // setIsLoading(false);
                Alert.alert('Vote', error.response.data.msg);
            } else {
                setCommonError('Unknown Error, Try again later');
                // setIsLoading(false);
                Alert.alert('Vote', 'Unknown Error, Try again later');
            }
        }
    }

    const handleVotePressed = async (post_id) => {
        let isLog = await isLoggedIn();
        if (!userInfo?.user?.id && !isLog.user?.id) {
            navigation.navigate('SignInInit');
            return;
        }
        if (userInfo?.user?.id) {
            selectedUser = { user: userInfo.user.id, post: post_id, menuList: menuList };
        } else {
            selectedUser = { user: isLog.user.id, post: post_id, menuList: menuList };
        }
        handleVotePressedWithAds();
        // if (loaded) {
        //     interstitial.show();
        // } else {
        //     interstitial.load();
        // }
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
        let isLog = await isLoggedIn();
        if (userInfo?.user?.id || isLog?.user?.id) {
            navigation.push("PostReport", { post_id: id, user_id: userInfo?.user?.id || isLog?.user?.id, reported_username: `${username}@` });
        } else {
            navigation.push('SignInInit', { navigateTo: { screen: 'PostReport', data: { post_id: id, reported_username: `${username}@` } } });
        }
    }

    const handleImagePress = (id) => {
        if (interstitial.loaded) {
            selectedPostToGo = id;
            setIsStatusBarHidden(true);
            navigation.push("post", { post_id: id });
            interstitial.show();
        } else {
            setIsStatusBarHidden(false);
            interstitial.load();
            navigation.push("post", { post_id: id });
        }
    }

    const handleApplyFilter = () => {
        setIsFilterApplied(true);
        setSortFilter('Month');
        filterApplied = {
            nationality: nationality,
            ageValues: ageValues,
            gender: isMale && isFemale ? 'both' : isMale ? 'male' : isFemale ? 'female' : 'both'
        };
        setShowFilterModal(false);
        getPosts(1, 'Month', true);
    }

    const handleGender = (type, val) => {
        if (type == 'male') {
            if (!val == false && isFemale == false) {
                setIsFemale(true);
                setIsMale(!val);
            } else {
                setIsMale(!val);
            }
        } else {
            if (!val == false && isMale == false) {
                setIsMale(true);
                setIsFemale(!val);
            } else {
                setIsFemale(!val);
            }
        }
    }

    const abbreviateNumber = (value) => {
        let newValue = value;
        if (value >= 1 && value < 1000) {
            return `${value}`;
        } else if (value >= 1000) {
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

    return (
        <View
            style={{
                flex: 1,
            }}
        >
            {   showFilterModal ? 
                    <FilterModal 
                        isVisible={showFilterModal} 
                        ageValues={ageValues}
                        ageValuesFinish={(values) => { setAgeValues(values); }}
                        nationality={nationality}
                        setNationality={setNationality}
                        onApplyFilters={() => handleApplyFilter()}
                        onClose={() => setShowFilterModal(false)}
                        isMale={isMale}
                        isFemale={isFemale}
                        handleGender={handleGender}
                    /> 
                : 
                null 
            }
            {renderFiltersButtons()}
            {
                postLayout == 'post' ? 
                    <FlashList
                        key={0}
                        ref={flashListRef}
                        data={menuList}
                        keyExtractor={x => `#${x.id}`}
                        showsVerticalScrollIndicator={false}
                        onEndReachedThreshold={0.2}
                        initialScrollIndex={0}
                        onEndReached={() => {
                            if (count > 0 && count > menuList.length && !isLoading) {
                                getExtraPosts(pageSize, currentPage + 1, sortFilter, isFilterApplied);
                            }
                        }}
                        disableAutoLayout={true}
                        estimatedItemSize={100}
                        ListHeaderComponent={
                            <View>
                                {renderContestTimer()}
                                {
                                    isLoading ?
                                        <View style={{ alignItems: 'center', margin: SIZES.padding * 2 }}>
                                            <ActivityIndicator />
                                        </View>
                                        : null
                                }
                            </View>
                        }
                        renderItem={({ item, index }) => {
                            return (
                                !isLoading ?
                                        <View>
                                            <PostCard
                                                key={item.id}
                                                containerStyle={{
                                                    alignItems: 'center',
                                                    marginHorizontal: SIZES.base,
                                                    marginBottom: SIZES.radius
                                                }}
                                                imageStyle={{
                                                    height: 495,
                                                    width: Dimensions.get('window').width - (SIZES.base * 2),
                                                }}
                                                userImageStyle={{
                                                    height: 40,
                                                    width: 40
                                                }}
                                                post={item}
                                                is_voted={userInfo && userInfo.user && userInfo.user.id && item.post_votes.some(x => x.user_id == userInfo?.user?.id) ? true : false}
                                                onPress={() => navigation.push("Profile", { user_id: item.user_id })}
                                                onPressVote={() => handleVotePressed(item.id)}
                                                onSharePress={() => handleSharePress(item)}
                                                onReportPress={() => handleReportPress(item.id, item.user.username)}
                                                onImagePress={() => handleImagePress(item.id)}
                                                onTitlePress={() => handleImagePress(item.id)}
                                                childern={null}
                                                numberOfLines={3}
                                                titleHome={true}
                                            /> 
                                            {/* {
                                                (index+1) % 6 == 0 ?
                                                        <View
                                                            style={{
                                                                marginTop: SIZES.base,
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
                                            } */}
                                        </View>
                                    : 
                                        null
                            )
                        }}
                        ListFooterComponent={
                            <View style={{ alignItems: 'center' }}>
                                {isLoadingExtra && !isLoading ? <ActivityIndicator /> : null}
                                {   
                                    firstVisit && !isLoading && !isLoadingExtra ? 
                                        <TextIconButton 
                                            containerStyle={{
                                                paddingHorizontal: SIZES.padding,
                                                paddingVertical: SIZES.padding,
                                                flex: 1,
                                                alignItems: 'center',
                                                borderRadius: SIZES.radius,
                                                backgroundColor: COLORS.blue,
                                                marginBottom: SIZES.padding
                                            }}
                                            icon={<Icon1 name={'repeat'} size={30} color={COLORS.white} />}
                                            iconPosition="RIGHT"
                                            iconStyle={{
                                                tintColor: COLORS.white
                                            }}
                                            label={"Reload"}
                                            labelStyle={{
                                                marginRight: SIZES.radius,
                                                color: COLORS.white,
                                                ...FONTS.h1
                                            }}
                                            onPress={() => getPosts(currentPage, sortFilter, isFilterApplied)}
                                        />
                                    : 
                                        null
                                }
                                {count == menuList.length ? <Text style={{  ...FONTS.body4, color: COLORS.black }}>No more posts at the moment</Text> : null}
                                <View style={{ height: 200 }} />
                            </View>
                        }
                    />
                :
                    <FlatList
                        key={1}
                        data={menuList}
                        keyExtractor={x => `_${x.id}`}
                        horizontal={false}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        onEndReachedThreshold={0.2}
                        estimatedItemSize={316}
                        onEndReached={() => {
                            if (count > 0 && count > menuList.length && !isLoading) {
                                getExtraPosts(pageSize, currentPage + 1, sortFilter, isFilterApplied);
                            }
                        }}
                        ListHeaderComponent={
                            <View>
                                {renderContestTimer()}
                                {
                                    isLoading ?
                                        <View style={{ alignItems: 'center', margin: SIZES.padding * 2 }}>
                                            <ActivityIndicator />
                                        </View>
                                        : null
                                }
                            </View>
                        }
                        renderItem={({ item, index }) => (
                            <View
                                style={{
                                    marginTop: SIZES.base,
                                    borderRadius: SIZES.radius,
                                    marginRight: index % 2 != 0 ? SIZES.base : SIZES.base/2,
                                    marginLeft: index % 2 != 0 ? SIZES.base/2 : SIZES.base,
                                    flex: 0.5,
                                    overflow: 'hidden',
                                    backgroundColor: COLORS.lightGray2
                                }}
                            >
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: SIZES.base,
                                        paddingHorizontal: SIZES.base,
                                        minHeight: Platform.OS == 'ios' ? 60 : 70
                                    }}
                                    onPress={() => handleImagePress(item.id)}
                                >
                                    <Text 
                                        style={{ 
                                            ...FONTS.body4, 
                                            //fontSize: 17,
                                            color: COLORS.black
                                        }}
                                        numberOfLines={2} 
                                    >
                                        {item.post_title}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableWithoutFeedback
                                    onPress={() => handleImagePress(item.id)}
                                >
                                    <View
                                        style={{
                                            alignItems: 'center',
                                            borderRadius: SIZES.radius,
                                        }}
                                    >
                                        <FastImage
                                            source={{  
                                                uri: item.post_images[0].url.startsWith("https://") ? `${item.post_images[0].url}` : `https://${item.post_images[0].url}`,
                                                priority: FastImage.priority.high 
                                            }}
                                            resizeMode={FastImage.resizeMode.contain}
                                            style={{
                                                height: 250,
                                                width: "100%",
                                                aspectRatio: 1,
                                                borderRadius: SIZES.radius
                                            }}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        // paddingVertical: SIZES.radius,
                                        width: '100%',
                                        paddingHorizontal: SIZES.base,
                                        justifyContent: 'space-between'
                                    }}
                                >   
                                    <TouchableOpacity
                                        style={{
                                            // backgroundColor: COLORS.red,
                                            borderRadius: SIZES.radius,
                                            padding: SIZES.base,
                                            flexDirection: 'row'
                                        }}
                                        onPress={() => navigation.push('post', { post_id: item.id })}
                                    >
                                        {   userInfo && userInfo.user && userInfo.user.id && item.post_votes.some(x => x.user_id == userInfo?.user?.id) ? 
                                            <Icon 
                                                name={'heart'}
                                                size={20} 
                                                color={COLORS.red}
                                            /> :
                                            <Icon 
                                                name={'hearto'}
                                                size={20} 
                                                color={COLORS.black}
                                            /> 
                                        }
                                        <Text 
                                            style={{ 
                                                ...FONTS.body4, 
                                                fontSize: 14,
                                                color: COLORS.black, 
                                                marginHorizontal: SIZES.base,
                                            }}
                                        >
                                            {`${abbreviateNumber(item.PostVoteCount)}`}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row'
                                        }}
                                        onPress={() => navigation.push('post', { post_id: item.id })}
                                    >
                                        <Icon 
                                            name={'message1'} 
                                            size={20} 
                                            color={COLORS.black}
                                        />
                                        <Text
                                            style={{
                                                marginHorizontal: SIZES.base,
                                                color: COLORS.black,
                                                ...FONTS.body4,
                                                fontSize: 14,
                                            }}
                                        >
                                            {`${abbreviateNumber(item.PostCommentCount)}`}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        ListFooterComponent={
                            <View style={{ marginTop: SIZES.radius, alignItems: 'center' }}>
                                {isLoadingExtra && !isLoading ? <ActivityIndicator /> : null}
                                {count == menuList.length ? <Text style={{  ...FONTS.body4, color: COLORS.black }}>No more posts at the moment</Text> : null}
                                <View style={{ height: 200 }} />
                            </View>
                        }
                    />
            }
        </View>
    )
}


export default Home;