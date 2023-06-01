import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ImageBackground,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    Alert
} from 'react-native';
import { FONTS, COLORS, SIZES, icons, images } from '../../constants';
import { Header, IconButton, TextButton } from '../../components';

import Carousel from "react-native-reanimated-carousel";
import axios from 'axios';
import IconF from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import Animated from "react-native-reanimated";

import { useIsFocused } from '@react-navigation/native';

import { BASE_URL } from '../../config';


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const baseOptions = { vertical: false, width: viewportWidth, height: 600 };

function wp(percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const itemHorizontalMargin = wp(1);


const ChannelsInit = ({ navigation, route }) => {

    const [list, setList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [commonError, setCommonError] = useState("");


    const isFocused = useIsFocused();

    function renderHeader() {
        return (
            <Header
                title={`${route.params.data}`}
                titleStyle={{
                    color: COLORS.white,
                    ...FONTS.h2
                }}
                containerStyle={{
                    height: 50,
                    marginTop: 0,
                    alignItems: 'center',
                    paddingHorizontal: SIZES.base,
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
                            width: 20,
                            height: 20,
                            tintColor: COLORS.gold,
                        }}
                        onPress={() => {
                            // navigation.dispatch(DrawerActions.openDrawer())
                            //  navigation.openDrawer()       
                            //logout(navigation)
                            navigation.goBack();
                        }}
                    />
                }
                rightComponent={
                    <IconButton
                        containerStyle={{
                            width: 40,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    />
                }
            />
        )
    }

    useEffect(() => {
        getThetaStream();
    }, [isFocused]);

    const getThetaStream = async () => {
        setIsLoading(true);
        setList([]);
        try {
            const response = await axios.get(`${BASE_URL}/theta/stream/list/${encodeURIComponent(route.params.data)}`);
            setIsLoading(false);
            setList([response.data.data[0]]);
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

    return (
        <ImageBackground
            source={images.background}
            style={{ flex: 1 }}
        >
            <SafeAreaView>
                {renderHeader()}
            </SafeAreaView>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly'
                }}
            >
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => { 
                        if (list[0].status == 'on') {
                            navigation.push('ViewLiveVideo', { data: list[0] })
                        } else {
                            Alert.alert(`${route.params.data}`, 'Channel is offline');
                        }
                    }}
                >
                    <Text
                        style={{
                            color: COLORS.white,
                            ...FONTS.h2,
                            marginRight: SIZES.base
                        }}
                    >
                        Live  
                    </Text>
                    <IconF
                        name={'video-wireless-outline'}
                        size={32}
                        color={COLORS.white}
                    />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => navigation.push('ViewVideo', { data: route.params.data })}
                >
                    <Text
                        style={{
                            color: COLORS.white,
                            ...FONTS.h2,
                            marginRight: SIZES.base
                        }}
                    >
                        Videos  
                    </Text>
                </TouchableOpacity>
            </View>
            <Carousel
                {...baseOptions}
                loop={false}
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.9,
                    parallaxScrollingOffset: 50,
                }}
                data={list}
                renderItem={({item, index}) => {
                    return (
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{
                                width: viewportWidth,
                                height: 600,
                                paddingHorizontal: itemHorizontalMargin,
                            }}
                            // onPress={() => handleImagePress(illustration)}
                        >
                            <Animated.View style={{ flex: 1 }}>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: COLORS.black,
                                        borderRadius: 8,
                                        overflow: "hidden",
                                    }}
                                >
                                    <ActivityIndicator size="small" />
                                    <FastImage
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                        }}
                                        source={images[route.params.image]}
                                    />
                                </View>
                            </Animated.View>
                            <View
                                style={{
                                    position: 'absolute',
                                    top: SIZES.radius,
                                    flexDirection: 'row',
                                    left: SIZES.radius,
                                    zIndex: 3, // works on ios
                                    elevation: 3,
                                    paddingHorizontal: SIZES.radius,
                                    paddingVertical: SIZES.base,
                                    borderRadius: SIZES.radius,
                                    backgroundColor: '#e8e8e8'
                                }}
                            >
                                <Text
                                    style={{
                                        color: item.status == 'on' ? COLORS.green : COLORS.darkGray2,
                                        ...FONTS.h3
                                    }}
                                > 
                                    { item.status == 'on' ? 'Online' : 'Offline'}
                                </Text>
                            </View>
                            {
                                item.status == 'on' ?
                                    <TouchableOpacity
                                        style={{
                                            position: 'absolute',
                                            bottom: SIZES.radius,
                                            flexDirection: 'row',
                                            right: SIZES.radius,
                                            zIndex: 3, // works on ios
                                            elevation: 3,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: 100,
                                            height: 50,
                                            borderRadius: SIZES.radius,
                                            backgroundColor: '#e8e8e8'
                                        }}
                                        onPress={() => navigation.push('ViewLiveVideo', { data: list[0] })}
                                    >
                                        <IconF
                                            name={'video-wireless-outline'}
                                            size={36}
                                            color={COLORS.green}
                                        />
                                    </TouchableOpacity>
                                :
                                    null
                            }
                        </TouchableOpacity>
                )}}
            />
           <TextButton
                label="Video Clips"
                buttonContainerStyle={{
                    height: 55,
                    alignItems: 'center',
                    borderRadius: SIZES.radius,
                    backgroundColor: COLORS.blue,
                    paddingHorizontal: SIZES.padding,
                    alignSelf: 'center'
                }}
                onPress={() => navigation.push('ViewVideo', { data: route.params.data })}
            />
        </ImageBackground>
    )
}


export default ChannelsInit;