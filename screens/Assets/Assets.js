import React, { useState, useContext, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    TouchableWithoutFeedback,
    SafeAreaView,
    ImageBackground,
    FlatList
} from 'react-native';
import { FONTS, COLORS, SIZES, icons, images } from '../../constants';
import { PostCard, TextButton, Header, IconButton, TextIconButton, FormPicker } from '../../components';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import moment from 'moment';
import { BASE_URL_API } from '../../config';
import FastImage from 'react-native-fast-image';
import { FlashList } from '@shopify/flash-list';
import { AuthContext } from '../../Context/authContext';


const Assets = ({ navigation, route }) => {

    const [collectionList, setCollectionList] = React.useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [commonError, setCommonError] = useState("");

    const [isLoadingExtra, setIsLoadingExtra] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(true);

    const flashListRef = useRef(null);
  
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
       getNftsUserCollections();
    }, []);
   
    const getNftsUserCollections = async () => {
        setIsLoading(true);
        setCollectionList([]);
        try {
            const response = await axios.get(`${BASE_URL_API}//atomicassets/v1/templates?collection_name=${route?.params?.collection_name}&page=1&limit=${pageSize}&order=desc&sort=created`);
            setIsLoading(false);
            setCollectionList(response.data.data);
            flashListRef.current?.scrollToIndex(0);
            if (response.data.data.length < pageSize) {
                setCount(false);                
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
        }
    }

    const getNftsUserCollectionsExtra = async (page, current, filter, isFilterApply) => {
        setIsLoadingExtra(true);
        try {
            const response = await axios.get(`${BASE_URL_API}/atomicassets/v1/templates?collection_name=${route?.params?.collection_name}&page=${current}&limit=${page}&order=desc&sort=created`);
            let combine = [...collectionList, ...response.data.data];
            setCollectionList(combine);
            if (response.data.data.length < pageSize) {
                setCount(false);
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
                title={`${route?.params?.collection_name} Assets`}
                titleStyle={{
                    color: COLORS.white
                }}
                containerStyle={{
                    height: 50,
                    marginTop: 0,
                    alignItems: 'center',
                    paddingHorizontal: SIZES.base
                }}
                leftComponent={
                    <IconButton
                        icon={icons.back}
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
                            width: 30,
                            height: 20,
                            tintColor: COLORS.gold,
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
                            tintColor: COLORS.gold,
                        }}
                        onPress={() => navigation.push('Home')}
                    />
                }
            />
        )
    }

    return (
        <ImageBackground 
            source={images.background} 
            style={{
                flex: 1
            }}
        >
            <SafeAreaView>
                {renderHeader()}
            </SafeAreaView>
            <FlashList
                key={1}
                data={collectionList}
                keyExtractor={x => `_${x.template_id}`}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                estimatedItemSize={316}
                onEndReachedThreshold={0.2}
                initialScrollIndex={0}
                onEndReached={() => {
                    if (count && !isLoading) {
                        getNftsUserCollectionsExtra(pageSize, currentPage + 1);
                    }
                }}
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
                renderItem={({ item, index }) => (
                    <View
                        style={{
                            marginTop: SIZES.base,
                            borderRadius: SIZES.radius,
                            marginRight: index % 2 != 0 ? SIZES.base : SIZES.base/2,
                            marginLeft: index % 2 != 0 ? SIZES.base/2 : SIZES.base,
                            flex: 1,
                            overflow: 'hidden',
                            borderColor: COLORS.white,
                            paddingHorizontal: SIZES.base,
                            paddingTop: SIZES.base,
                            borderWidth: 1
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => navigation.push('Asset', { data: item, collection_name: route.params.collection_name, user_account: route.params.user_account })}
                        >
                            <View
                                style={{
                                    alignItems: 'center',
                                    borderRadius: SIZES.radius,
                                    overflow: 'hidden'
                                }}
                            >
                                <FastImage
                                    source={{  
                                        uri: item.immutable_data.image.startsWith("https://") ? `${item.immutable_data.image}` : `https://solidcircle.mypinata.cloud/ipfs/${item.immutable_data.image}`,
                                        priority: FastImage.priority.high 
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                    style={{
                                        height: 200,
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
                                justifyContent: 'space-between',
                                paddingHorizontal: SIZES.base,
                                paddingVertical: SIZES.base
                            }}
                        >   
                            <Text
                                style={{
                                    marginHorizontal: SIZES.base,
                                    color: COLORS.white,
                                    ...FONTS.h3,
                                    flex: 1
                                }}
                            >
                                {`${item.immutable_data.name}`}
                            </Text>
                        </View>
                    </View>
                )}
                ListFooterComponent={
                    <View style={{ marginTop: SIZES.radius, alignItems: 'center' }}>
                        {isLoadingExtra && !isLoading ? <ActivityIndicator /> : null}
                        { !count ? <Text style={{  ...FONTS.body4, color: COLORS.white }}>No more data at the moment</Text> : null}
                        <View style={{ height: 200 }} />
                    </View>
                }
            />
        </ImageBackground>
    )
}


export default Assets;