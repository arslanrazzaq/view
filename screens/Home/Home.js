import React, { useState, useContext, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    TouchableWithoutFeedback,
    SafeAreaView,
    ImageBackground,
    Image
} from 'react-native';
import { FONTS, COLORS, SIZES, icons, images } from '../../constants';
import { Header, IconButton, TextIconButton } from '../../components';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import moment from 'moment';
import { BASE_URL } from '../../config';
import FastImage from 'react-native-fast-image';
import { FlashList } from '@shopify/flash-list';
import { AuthContext } from '../../Context/authContext';

let filterApplied = {};
let firstRun = true;

const Home = ({ navigation }) => {

    const [menuList, setMenuList] = React.useState([]);
    const [sortFilter, setSortFilter] = React.useState('Today');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingExtra, setIsLoadingExtra] = useState(false);
    const [commonError, setCommonError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [count, setCount] = useState(0);
    
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [firstVisit, setFirstVisit] = useState(false);
    
    const flashListRef = useRef(null);

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

    function renderHeader() {
        return (
            <Header
                title={<Image source={images.cliptos} resizeMode='contain' style={{ width: 100, height: 70 }} />}
                titleStyle={{
                    color: COLORS.white,
                    justifyContent: 'center',
                    alignItems: 'center'
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
            <SafeAreaView>
                {renderHeader()}
            </SafeAreaView>
            <FlashList
                key={0}
                ref={flashListRef}
                data={menuList}
                keyExtractor={x => `#${x.id}`}
                showsVerticalScrollIndicator={false}
                initialScrollIndex={0}
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