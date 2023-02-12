import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    Dimensions,
    Platform,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import { COLORS, SIZES, FONTS, icons } from '../../constants';
import { IconButton, Header, LineDivider, TextButton, TextIconButton, FormPicker } from '../../components';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Feather';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import AnimatedLoader from "react-native-animated-loader";
import moment from 'moment';
import { BASE_URL } from '../../config';
import FilterModal from './FilterModal';
import { FlashList } from '@shopify/flash-list';
import { AuthContext } from '../../Context/authContext';

const Item = ({ item, onPhotoPress }) => {
    return (
        item.post ? 
            <View
                style={{
                    paddingVertical: SIZES.base,
                    marginTop: SIZES.base,
                }}
            >
                <View
                    style={{
                        backgroundColor: COLORS.lightGray2,
                        borderRadius: SIZES.radius,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            paddingVertical: SIZES.base,
                            paddingHorizontal: SIZES.base,
                            flexDirection: 'row',
                        }}
                    >
                        <Icon2 
                            name='corner-up-right'
                            size={28}
                            color={COLORS.black}
                        />
                        <Text
                            style={{
                                marginLeft: SIZES.padding,
                                ...FONTS.h3,
                                color: COLORS.black
                            }}
                        >
                            {dateFormatHeader(item?.createdAt)}
                        </Text>
                    </View>
                    <TouchableWithoutFeedback
                        onPress={onPhotoPress}
                        style={{
                            // paddingVertical: SIZES.base,
                            borderRadius: SIZES.radius
                        }}
                    >
                        <FastImage 
                            source={{ priority: FastImage.priority.high, uri: item?.post?.post_images[0]?.url?.startsWith("https://") ? `${item?.post?.post_images[0]?.url}` : `https://${item?.post?.post_images[0]?.url}`  }}
                            resizeMode={FastImage.resizeMode.contain}
                            style={{
                                //height: Dimensions.get('window').width - 20,
                                height: 495,
                                width: Dimensions.get('window').width - (SIZES.base * 2),
                                borderRadius: SIZES.radius
                            }}
                        /> 
                    </TouchableWithoutFeedback>
                </View>
            </View>
        : null
    )
}

const ItemLeaderboard = ({ item, userImageStyle, onUserPress }) => {
    return (
        item ? <View
            style={{
                backgroundColor: COLORS.lightGray2,
                borderRadius: SIZES.radius,
                marginTop: SIZES.base,
            }}
        >
            <TouchableOpacity
                onPress={onUserPress}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: SIZES.base,
                    paddingHorizontal: SIZES.base,
                }}
            >   
                <View 
                    style={{
                        flex: 1, 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        paddingVertical: SIZES.base,
                        paddingHorizontal: SIZES.base, 
                    }}
                >
                    <View 
                        style={{
                            borderWidth: 1,
                            borderColor: COLORS.gray2,
                            borderRadius: 50,
                            overflow: 'hidden',
                        }}
                    >
                        <FastImage 
                            source={{ 
                                priority: FastImage.priority.high, 
                                uri: item.profile_pic ? item.profile_pic.startsWith("https://") ? `${item.profile_pic}` : `https://${item.profile_pic}` : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" 
                            }}
                            style={userImageStyle}
                        />
                    </View>
                    <Text
                        style={{
                            color: COLORS.black,
                            ...FONTS.body3,
                            paddingHorizontal: SIZES.radius
                        }}
                    >
                        {item.username}
                    </Text>
                </View>
                <Icon
                    name={'heart'}
                    size={18}
                    color={COLORS.red}
                />
                <Text
                    style={{
                        color: COLORS.black,
                        ...FONTS.body4,
                        paddingHorizontal: SIZES.radius
                    }}
                >
                    {abbreviateNumber(item.totalVoteCount)}
                </Text>
            </TouchableOpacity>
        </View> : null
    )
}

const dateFormatHeader = (time) => {
    // let diff = moment.duration(moment(new Date()).diff(moment(time)));
    // let days = parseInt(diff.asDays());
    // if (days == 1) {
    //     return '1 day ago';
    // } else if (days < 5) {
    //     return moment(time).fromNow();
    // } else {
        return moment(time).format('MMMM Do YYYY');
    // }
}

const abbreviateNumber = (value) => {
    let newValue = value;
    if (value >= 1 && value <= 10) {
        return `${value}`;
    } else if (value > 10 && value <= 19) {
        return `10+`;
    } else if (value > 19 && value <= 29) {
        return `20+`;
    } else if (value > 29 && value <= 39) {
        return `30+`;
    } else if (value > 39 && value <= 49) {
        return `40+`;
    } else if (value > 49 && value <= 59) {
        return `50+`;
    } else if (value > 59 && value <= 69) {
        return `60+`;
    } else if (value > 69 && value <= 79) {
        return `70+`;
    } else if (value > 79 && value <= 89) {
        return `80+`;
    } else if (value > 89 && value <= 99) {
        return `90+`;
    } else if (value > 99 && value <= 199) {
        return `100+`;
    } else if (value > 199 && value <= 299) {
        return `200+`;
    } else if (value > 299 && value <= 399) {
        return `300+`;
    } else if (value > 399 && value <= 499) {
        return `400+`;
    } else if (value > 499 && value <= 599) {
        return `500+`;
    } else if (value > 599 && value <= 699) {
        return `600+`;
    } else if (value > 699 && value <= 799) {
        return `700+`;
    } else if (value > 799 && value <= 899) {
        return `800+`;
    } else if (value > 899 && value <= 999) {
        return `900+`;
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
    } else {
        return newValue;
    }
}

let filterApplied = {};

const Winners = ({ navigation }) => {

    const [selectedOption, setSelectedOption] = useState('photo');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingWExtra, setIsLoadingWExtra] = useState(false);
    const [isLoadingLExtra, setIsLoadingLExtra] = useState(false);
    const [commonError, setCommonError] = useState('');
    const [postWinners, setPostWinners] = useState([]);
    const [leaderboards, setLeaderboards] = useState([]);
    const [postWinnersBox, setPostWinnersBox] = useState([]);
  
    const [winnersCount, setWinnersCount] = useState(0);
    const [currentPageWinners, setCurrentPageWinners] = useState(1);
    const [pageSizeWinners, setPageSizeWinners] = useState(6);
  
    const [leaderboardCount, setLeaderboardCount] = useState(0);
    const [currentPageLeaderboard, setCurrentPageLeaderboard] = useState(1);
    const [pageSizeLeaderboard, setPageSizeLeaderboard] = useState(10);

    const [showFilterModal, setShowFilterModal] = useState(false);
    const [sortFilter, setSortFilter] = useState('Today');
    const [modalVisible, setModalVisible] = useState(false);

    const [ageValues, setAgeValues] = useState([0, 100]);
    const [nationality, setNationality] = useState('ALL');
    const [isMale, setIsMale] = useState(true);
    const [isFemale, setIsFemale] = useState(true);
    const [isFilterApplied, setIsFilterApplied] = useState(false);

    const [loaded, setLoaded] = useState(false);
    
    const { userInfo, interstitial, setIsStatusBarHidden } = useContext(AuthContext);

    useEffect(() => {
        getWinnerPhoto();
    }, []);

    const getWinnerPhoto = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/post/winners/list/6/1`);
            let nWinnersWP = response.data.data.filter(x => x.post != null);
            // nWinnersWP.sort((a,b) => {
            //     return new Date(b.post.daily_contest.createdAt) - new Date(a.post.daily_contest.createdAt);
            // });
            setPostWinners(nWinnersWP);
            setPostWinnersBox(response.data.winnersPhotoBox);
            setWinnersCount(response.data.count);
            setCurrentPageWinners(1);
            setPageSizeWinners(6);
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
    
    const getWinnerPhotoExtra = async (page, current) => {
        setIsLoadingWExtra(true);
        try {
            const response = await axios.get(`${BASE_URL}/post/winners/list/${page}/${current}`);
            let combWinner = [...postWinners, ...response.data.data];
            let nWinnersWP = combWinner.filter(x => x.post != null);
            // nWinnersWP.sort((a,b) => {
            //     return new Date(b.post.daily_contest.createdAt) - new Date(a.post.daily_contest.createdAt);
            // });
            setPostWinners(nWinnersWP);
            setPostWinnersBox(response.data.winnersPhotoBox);
            if (response.data.data.length <= 0) {
                setWinnersCount(postWinners.length);
            } else {
                setWinnersCount(response.data.count);
            }
            setCurrentPageWinners(current);
            setPageSizeWinners(page);
            setIsLoadingWExtra(false);
        } catch (error) {
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoadingWExtra(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoadingWExtra(false);
            }
        }
    }
    
    const getLeaderboards = async (current, filter, isFilterApply) => {
        setIsLoading(true);
        try {
            let bodyObj = {};
            if (filter === 'All Time') {
                bodyObj = {
                    page_size: pageSizeLeaderboard,
                    current_page: current,
                    filter: filter
                }
            } else if (filter === 'This Week') {
                let currentd = moment();
                let next = moment(currentd).subtract(7, 'd');
                bodyObj = {
                    page_size: pageSizeLeaderboard,
                    current_page: current,
                    filter: filter,
                    next: next,
                    current: currentd
                }
            } else if (filter === 'This Month') {
                let currentd = moment();
                let next = moment(currentd).subtract(30, 'd');
                bodyObj = {
                    page_size: pageSizeLeaderboard,
                    current_page: current,
                    filter: filter,
                    next: next,
                    current: currentd
                }
            } else if (filter === 'Today') {
                let currentd = moment();
                let next = moment(currentd).subtract(1, 'd');
                bodyObj = {
                    page_size: pageSizeLeaderboard,
                    current_page: current,
                    filter: filter,
                    next: next,
                    current: currentd
                }
            }
            if (Object.keys(filterApplied).length > 0 && isFilterApply) {
                if ( filterApplied?.nationality == 'ALL' && filterApplied?.ageValues[0] == 0 && filterApplied?.ageValues[1] == 100 && filterApplied?.gender == 'both') {
                    bodyObj.isFilterApply = false;
                } else {
                    bodyObj.nationality = filterApplied.nationality;
                    bodyObj.gender = filterApplied.gender;
                    let val1 = moment().subtract(filterApplied.ageValues[0], 'years').endOf('year');
                    let val2 = moment().subtract(filterApplied.ageValues[1], 'years').startOf('year');
                    bodyObj.age = [val1, val2];
                    bodyObj.isFilterApply = true;
                }
            } else {
                bodyObj.isFilterApply = false;
            }
            setLeaderboards([]);
            const response = await axios.post(`${BASE_URL}/leaderboard/list`, bodyObj);
            // const response = await axios.get(`${BASE_URL}/leaderboard/list/10/1`);
            let newRes = response.data.data.filter((value, index, self) => index === self.findIndex((t) => (t.id === value.id )));
            setLeaderboards(newRes);
            if (response.data.data.length <= 0) {
                setLeaderboardCount(leaderboards.length);
            } else {
                setLeaderboardCount(response.data.count);
            }
            // setLeaderboardCount(response.data.count);
            setCurrentPageLeaderboard(1);
            setPageSizeLeaderboard(10);
            setIsLoading(false);
        } catch (error) {
            console.log('Error call: ', error);
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoading(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoading(false);
            }
        }
    }
    
    const getLeaderboardExtra = async (page, current, filter, isFilterApply) => {
        setIsLoadingLExtra(true);
        try {
            let bodyObj = {};
            if (filter === 'All Time') {
                bodyObj = {
                    page_size: pageSizeLeaderboard,
                    current_page: current,
                    filter: filter
                }
            } else if (filter === 'This Week') {
                let currentd = moment();
                let next = moment(currentd).subtract(7, 'd');
                bodyObj = {
                    page_size: pageSizeLeaderboard,
                    current_page: current,
                    filter: filter,
                    next: next,
                    current: currentd
                }
            } else if (filter === 'This Month') {
                let currentd = moment();
                let next = moment(currentd).subtract(30, 'd');
                bodyObj = {
                    page_size: pageSizeLeaderboard,
                    current_page: current,
                    filter: filter,
                    next: next,
                    current: currentd
                }
            } else if (filter === 'Today') {
                let currentd = moment().add(1, 'd');
                let next = moment(currentd).subtract(1, 'd');
                bodyObj = {
                    page_size: pageSizeLeaderboard,
                    current_page: current,
                    filter: filter,
                    next: next,
                    current: currentd
                }
            }

            if (Object.keys(filterApplied).length > 0 && isFilterApplied) {
                if ( filterApplied?.nationality == 'ALL' && filterApplied?.ageValues[0] == 0 && filterApplied?.ageValues[1] == 100 && filterApplied?.gender == 'both') {
                    bodyObj.isFilterApply = false;
                } else {
                    bodyObj.nationality = filterApplied.nationality;
                    bodyObj.gender = filterApplied.gender;
                    let val1 = moment().subtract(filterApplied.ageValues[0], 'years').endOf('year');
                    let val2 = moment().subtract(filterApplied.ageValues[1], 'years').startOf('year');
                    bodyObj.age = [val1, val2];
                    bodyObj.isFilterApply = true;
                }
            } else {
                bodyObj.isFilterApply = false;
            }

            const response = await axios.post(`${BASE_URL}/leaderboard/list`, bodyObj);
            let mixRes = [...leaderboards, ...response.data.data];
            let newRes = mixRes.filter((value, index, self) =>
                index === self.findIndex((t) => (
                t.id === value.id
                )));
            setLeaderboards(newRes);
            if (response.data.data.length <= 0) {
                setLeaderboardCount(leaderboards.length);
            } else {
                setLeaderboardCount(response.data.count);
            }
            setCurrentPageLeaderboard(current);
            setPageSizeLeaderboard(page);
            setIsLoadingLExtra(false);
        } catch (error) {
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoadingLExtra(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoadingLExtra(false);
            }
        }
    }

    function renderFiltersButtons() {
        return (
            <View
                style={{
                    paddingBottom: SIZES.base,
                    borderBottomColor: COLORS.lightGray1,
                    borderBottomWidth: 1
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
                            // borderColor: COLORS.black,
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
                            justifyContent: 'center'
                        }}
                    >
                        <FormPicker
                            label=""
                            containerStyle={{
                                // borderColor: COLORS.black
                            }}
                            inputContainerStyle={{
                                backgroundColor: COLORS.lightGray1,
                                ...FONTS.h3,
                            }}
                            onChange={(value) => {
                                setSortFilter(value);
                                setCurrentPageLeaderboard(1);
                                getLeaderboards(1, value, isFilterApplied); 
                                // getPosts(1, value, isFilterApplied);
                            }}
                            value={sortFilter}
                            modalVisible={modalVisible}
                            items={[
                                { label: 'Today', value: 'Today' },
                                { label: 'This Week', value: 'This Week' },
                                { label: 'This Month', value: 'This Month' },
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
                </View>
            </View>
        )
    }

    const handleApplyFilter = () => {
        setIsFilterApplied(true);
        setSortFilter('Today');
        filterApplied = {
            nationality: nationality,
            ageValues: ageValues,
            gender: isMale && isFemale ? 'both' : isMale ? 'male' : isFemale ? 'female' : 'both'
        };
        setShowFilterModal(false);
        getLeaderboards(1, 'Today', true);
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

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.white
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
            <View
                style={{
                    marginHorizontal: SIZES.base,
                    borderRadius: SIZES.radius,
                    flex: 1
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        marginVertical: SIZES.radius,
                        borderBottomColor: COLORS.lightGray1,
                        borderBottomWidth: 1
                    }}
                >
                    <TextButton
                        buttonContainerStyle={{
                            height: 40,
                            flex: 1,
                            marginRight: SIZES.base,
                            // borderRadius: SIZES.radius,
                            backgroundColor: COLORS.white,
                            borderBottomColor: COLORS.blue,
                            borderBottomWidth: selectedOption == 'photo' ? 3 : 0
                        }}
                        label={'Daily Winner'}
                        labelStyle={{ color:  selectedOption == 'photo' ? COLORS.blue : COLORS.black }}
                        onPress={() => { setSelectedOption('photo'); getWinnerPhoto() }}
                    />
                    <TextButton
                        buttonContainerStyle={{
                            height: 40,
                            flex: 1,
                            // borderRadius: SIZES.radius,
                            backgroundColor: COLORS.white,
                            borderBottomColor: COLORS.blue,
                            borderBottomWidth: selectedOption == 'leaderboard' ? 3 : 0
                        }}
                        label={'Ranking'}
                        labelStyle={{ color: selectedOption == 'leaderboard' ?  COLORS.blue : COLORS.black }}
                        onPress={() => {
                            setSelectedOption('leaderboard'); 
                            setSortFilter('Today');
                            setCurrentPageLeaderboard(1);
                            setIsFilterApplied(false); 
                            getLeaderboards(1, 'Today', false); 
                        }}
                    />
                </View>
                { selectedOption != 'photo' ? renderFiltersButtons() : null }
                {
                    ((postWinners && postWinners.length > 0 && selectedOption == 'photo') || (leaderboards && leaderboards.length > 0 && selectedOption == 'leaderboard')) ?
                        <FlashList
                            data={selectedOption == 'photo' ? postWinners : leaderboards}
                            keyExtractor={x => `${x.id}`}
                            vertical
                            horizontal={false}
                            showsVerticalScrollIndicator={false}
                            onEndReachedThreshold={0.2}
                            onEndReached={() => { 
                                if (winnersCount > 0 && winnersCount > postWinners.length && selectedOption == 'photo') {
                                    getWinnerPhotoExtra(pageSizeWinners, currentPageWinners + 1);
                                }
                                if (leaderboardCount > 0 && leaderboardCount > leaderboards.length && selectedOption == 'leaderboard') {
                                    getLeaderboardExtra(pageSizeLeaderboard, currentPageLeaderboard + 1, sortFilter, isFilterApplied);
                                }
                            }}
                            estimatedItemSize={530}
                            ListHeaderComponent={
                                <View
                                    style={{
                                        paddingVertical: SIZES.base,
                                        backgroundColor: COLORS.lightGray2,
                                        borderRadius: SIZES.radius,
                                        marginVertical: SIZES.base,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: COLORS.black,
                                            ...FONTS.body4,
                                            paddingHorizontal: SIZES.radius
                                        }}
                                    >
                                        {`${postWinnersBox?.discription}`}
                                    </Text>
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
                                    selectedOption == 'photo' ? 
                                    <>
                                        <Item
                                            item={item}
                                            key={item.post_id}
                                            onPhotoPress={() => { 
                                                if (interstitial.loaded) {
                                                    setIsStatusBarHidden(true);
                                                    navigation.push("post", { post_id: item.post_id });
                                                    interstitial.show();
                                                } else {
                                                    setIsStatusBarHidden(false);
                                                    interstitial.load();
                                                    navigation.push("post", { post_id: item.post_id });
                                                }
                                            }}
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
                                    </> :
                                    <ItemLeaderboard
                                        item={item}
                                        key={item.post_id}
                                        userImageStyle={{ height: 60, width: 60 }}
                                        onUserPress={() => navigation.push("Profile", { user_id: item.id })}
                                    />
                                )
                            }}
                            ListFooterComponent={
                                selectedOption == 'photo' ?
                                    <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                                        { isLoadingWExtra ? <ActivityIndicator /> : null }
                                        { winnersCount == postWinners.length ? <Text>No more record at the moment</Text> : null }
                                    </View> 
                                : 
                                    <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                                        { isLoadingLExtra ? <ActivityIndicator /> : null }
                                        { leaderboardCount == leaderboards.length ? <Text>No more record at the moment</Text> : null }
                                    </View>
                            }
                        />
                    :   <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        > 
                            <View
                                style={{
                                    paddingVertical: SIZES.base,
                                    backgroundColor: COLORS.lightGray2,
                                    borderRadius: SIZES.radius,
                                    marginVertical: SIZES.base,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Text
                                    style={{
                                        color: COLORS.black,
                                        ...FONTS.body4,
                                        paddingHorizontal: SIZES.radius
                                    }}
                                >
                                    {`${postWinnersBox?.discription}`}
                                </Text>
                            </View>
                            <Text
                                style={{
                                    color: COLORS.black,
                                    ...FONTS.body4,
                                    paddingHorizontal: SIZES.radius,
                                    flex: 1
                                }}
                            >
                                {isLoading ? `Loading...` : `No Record Available`}
                            </Text>
                        </View>
                }
            </View>
            <View style={{ height: Platform.OS === 'ios' ? 100 : 60 }} />
        </View>
    )
}

export default Winners;