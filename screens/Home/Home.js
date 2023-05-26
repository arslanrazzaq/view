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
    SafeAreaView,
    StatusBar,
    ImageBackground,
    Image
} from 'react-native';
import { FONTS, COLORS, SIZES, icons, images } from '../../constants';
import { PostCard, TextButton, Header, IconButton, TextIconButton, FormPicker } from '../../components';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Feather';
import axios from 'axios';
import moment from 'moment';
import { BASE_URL } from '../../config';
// import FilterModal from './FilterModal';
import FastImage from 'react-native-fast-image';
import { FlashList } from '@shopify/flash-list';
import { AuthContext } from '../../Context/authContext';
import {DrawerActions} from '@react-navigation/native';
import ViewIconSvg from '../../assets/svgs/view-svg2.svg';
import CliptosIconSvg from '../../assets/svgs/cliptos-svg1.svg';

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

    const { userInfo, logout } = useContext(AuthContext);


    useEffect(() => {
       getNftsUser(currentPage, sortFilter, isFilterApplied);
    }, []);

    const getNftsUser = async (current, filter, isFilterApply) => {
        setIsLoading(true);
        setMenuList([]);
        try {
            const response = await axios.get(`${BASE_URL}/nfts/user/list/${userInfo?.user?.id}`);
            let newRes = response.data.data.filter((value, index, self) => index === self.findIndex((t) => (t.id === value.id)));
            setIsLoading(false);
            setMenuList(newRes);
            flashListRef.current?.scrollToIndex(0);
            // if (newRes.length < pageSize) {
                setCount(newRes.length);                
            // } else {
            //     setCount(response.data.count);
            // }
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

    function renderHeader() {
        return (
            <Header
                title={<CliptosIconSvg width={100} height={70} />}
                titleStyle={{
                    color: COLORS.white,
                }}
                containerStyle={{
                    height: 50,
                    marginTop: 0,
                    alignItems: 'center',
                    paddingHorizontal: SIZES.base,
                }}
                leftComponent={
                    <IconButton
                        icon={icons.menu}
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
                            tintColor: COLORS.gold,
                        }}
                        onPress={() => {  
                            // navigation.dispatch(DrawerActions.openDrawer())
                            //  navigation.openDrawer()       
                            //logout(navigation)
                            navigation.push('ProfileTab');
                        }}
                    />
                }
                rightComponent={
                    <IconButton
                        icon={icons.plus}
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
                            tintColor: COLORS.gold,
                        }}
                        onPress={() => navigation.push('AddAccountInit')}
                    />
                }
            />
        )
    }


    const handleAccountSwitch = (item) => {
        if (item.type == 'proton') {
            navigation.push('Collections', { user_account: item.username })
        } else {
            navigation.push('Polygon', { user_account: item.username })
        }

    }

    return (
        <ImageBackground 
            source={images.background} 
            style={{ flex : 1 }}
        >
            {/* {   showFilterModal ? 
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
            } */}
           
            <SafeAreaView>
                {renderHeader()}
            </SafeAreaView>
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
                        //getExtraPosts(pageSize, currentPage + 1, sortFilter, isFilterApplied);
                    }
                }}
                disableAutoLayout={true}
                estimatedItemSize={100}
                ListHeaderComponent={
                    <View>
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
                            <TouchableWithoutFeedback
                                onPress={() => handleAccountSwitch(item)}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingVertical: SIZES.radius,
                                        paddingHorizontal: SIZES.base,
                                        borderBottomColor: COLORS.gray2,
                                        borderBottomWidth: 1
                                    }}
                                >
                                    <View 
                                        style={{
                                            borderWidth: 1,
                                            borderColor: COLORS.gray2,
                                            borderRadius: SIZES.radius,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <FastImage 
                                            source={{ priority: FastImage.priority.high, uri: item?.user?.profile_pic ? post?.user?.profile_pic.startsWith('https://') ? post?.user?.profile_pic : `https://${post?.user?.profile_pic}` : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" }}
                                            style={{
                                                height: 60,
                                                width: 60
                                            }}
                                            resizeMode={FastImage.resizeMode.contain}
                                        />
                                    </View>
                                    <View 
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            paddingHorizontal: SIZES.base
                                        }}
                                    >
                                        <View
                                            style={{
                                                flex: 1,
                                                flexWrap: 'wrap',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{...FONTS.h3, fontSize: 18, width: '100%', color: COLORS.white }}
                                            >
                                                {item.username}
                                            </Text>
                                            <Text
                                                style={{...FONTS.h5, width: '100%', color: COLORS.gray2 }}
                                            >
                                                {item.type.toUpperCase()}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            width: 40,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Icon 
                                            name={'right'} 
                                            size={30} 
                                            color={COLORS.gray2}
                                        />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
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
                                    onPress={() => getNftsUser(currentPage, sortFilter, isFilterApplied)}
                                />
                            : 
                                null
                        }
                        <View style={{ height: 200 }} />
                    </View>
                }
            /> 
            </ImageBackground>
    )
}


export default Home;