import React, { useState, useContext, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    TouchableWithoutFeedback,
    SafeAreaView,
    FlatList
} from 'react-native';
import { FONTS, COLORS, SIZES, icons } from '../../constants';
import { PostCard, TextButton, Header, IconButton, TextIconButton, FormPicker } from '../../components';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import moment from 'moment';
import { BASE_URL_API } from '../../config';
import FastImage from 'react-native-fast-image';
import { FlashList } from '@shopify/flash-list';
import { AuthContext } from '../../Context/authContext';


const Collections = ({ navigation, route }) => {

    const [collectionList, setCollectionList] = React.useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [commonError, setCommonError] = useState("");
    const flashListRef = useRef(null);
  
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
       getNftsUserCollections();
    }, []);

    const getNftsUserCollections = async () => {
        setIsLoading(true);
        setCollectionList([]);
        try {
            const response = await axios.get(`${BASE_URL_API}/atomicassets/v1/accounts/${route?.params?.user_account}`);
            setIsLoading(false);
            setCollectionList(response.data.data.collections);
            flashListRef.current?.scrollToIndex(0);
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

    function renderHeader() {
        return (
            <Header
                title={`${route?.params?.user_account} Collections`}
                titleStyle={{
                    color: COLORS.black
                }}
                containerStyle={{
                    height: 50,
                    marginTop: 0,
                    alignItems: 'center',
                    paddingHorizontal: SIZES.base,
                    backgroundColor: COLORS.white
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
                            borderColor: COLORS.black
                        }}
                        iconStyle={{
                            width: 30,
                            height: 20,
                            tintColor: COLORS.black,
                        }}
                        onPress={() => navigation.goBack()}
                    />
                }
                rightComponent={
                    <IconButton
                        containerStyle={{
                            width: 40,
                            height: 40
                        }}
                    />
                }
            />
        )
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}
        >
            <SafeAreaView>
                {renderHeader()}
            </SafeAreaView>
            <FlatList
                key={1}
                data={collectionList}
                keyExtractor={x => `_${x.collection.name}`}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                estimatedItemSize={316}
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
                            flex: 0.5,
                            overflow: 'hidden',
                            backgroundColor: COLORS.lightGray2
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() =>  navigation.push('Assets', { collection_name : item.collection.collection_name, user_account: route.params.user_account })}
                        >
                            <View
                                style={{
                                    alignItems: 'center',
                                    borderRadius: SIZES.radius,
                                }}
                            >
                                <FastImage
                                    source={{  
                                        uri: `https://solidcircle.mypinata.cloud/ipfs/${item.collection.img}`,
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
                                justifyContent: 'space-between',
                                paddingHorizontal: SIZES.base,
                                paddingVertical: SIZES.base
                            }}
                        >   
                            <Text
                                style={{
                                    marginHorizontal: SIZES.base,
                                    color: COLORS.black,
                                    ...FONTS.h3,
                                    flex: 1
                                }}
                            >
                                {`${item.collection.name}`}
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginHorizontal: SIZES.base,
                                }}
                            >
                                <Icon 
                                    name={'check'} 
                                    size={20} 
                                    color={COLORS.black}
                                />
                                <Text
                                    style={{
                                        color: COLORS.black,
                                        ...FONTS.h3,
                                    }}
                                >
                                    {`${item.assets}`}
                                </Text>
                            </View>
                            
                        </View>
                    </View>
                )}
                ListFooterComponent={
                    <View style={{ marginTop: SIZES.radius, alignItems: 'center' }}>
                        {/* {isLoadingExtra && !isLoading ? <ActivityIndicator /> : null}
                        {count == menuList.length ? <Text style={{  ...FONTS.body4, color: COLORS.black }}>No more posts at the moment</Text> : null} */}
                        <View style={{ height: 200 }} />
                    </View>
                }
            />
        </View>
    )
}


export default Collections;