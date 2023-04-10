import React, { useEffect, useState } from "react";
import {
    View,
    Dimensions,
    ActivityIndicator,
    StyleSheet,
    Text,
    ImageBackground,
    TouchableOpacity,
    SafeAreaView,
    Pressable
} from "react-native";
import Animated from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { images, COLORS, SIZES, FONTS, icons } from "../../constants";
import { IconButton, Header, } from "../../components";
import axios from "axios";
import FastImage from "react-native-fast-image";
import ImageView from "react-native-image-viewing";
import { BASE_URL } from "../../config";


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const Polygon = ({ navigation, route }) => {

    const baseOptions = { vertical: false, width: viewportWidth, height: viewportHeight * 0.6 };
    // const baseOptions = { vertical: false, width: viewportWidth, height: viewportWidth * 0.6 };

    const [collectionList, setCollectionList] = React.useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [commonError, setCommonError] = useState("");

    const [imagesAsset, setImagesAsset] = useState([]);
    const [imagesIndex, setImagesIndex] = useState(0);
    const [visible, setIsVisible] = useState(false);

    useEffect(() => {
        getNftsUserCollections();
    }, []);

    const getNftsUserCollections = async () => {
        setIsLoading(true);
        setCollectionList([]);
        try {
            const response = await axios.get(`${BASE_URL}/nfts/polygon/${route?.params?.user_account}`);
            setIsLoading(false);
            setCollectionList(response.data.data.ownedNfts);
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
                title={``}
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
                        containerStyle={{
                            width: 40,
                            height: 40
                        }}
                    />
                }
            />
        )
    }

    const handleImagePress = (val) => {

        let imgs = [];
        imgs.push({
            uri: `${val}`,
        });

        setImagesAsset(imgs);
        setIsVisible(true);
        // setImagesIndex(ind);
    }

    return (
        <ImageBackground
            source={images.background}
            style={{
                flex: 1,
            }}
        >
            <SafeAreaView>
                {renderHeader()}
            </SafeAreaView>

            <ImageView
                images={imagesAsset}
                imageIndex={imagesIndex}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
            />

            {
                isLoading ?
                        <View style={{ alignItems: 'center', margin: SIZES.padding * 2 }}>
                            <ActivityIndicator />
                        </View>
                    : 
                        <Carousel
                            {...baseOptions}
                            loop={false}
                            mode="parallax"
                            modeConfig={{
                                parallaxScrollingScale: 0.9,
                                parallaxScrollingOffset: 50,
                            }}
                            data={collectionList}
                            renderItem={({ item, index }) => (
                                <Animated.View style={{ flex: 1 }}>
                                    <View 
                                        style={{
                                            flex: 1,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "#fff",
                                            borderRadius: 8,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                            }}
                                            onPress={() => handleImagePress(`${item.media[0].gateway}`)}
                                        >
                                            <ActivityIndicator size="small" />
                                            <FastImage
                                                key={index}
                                                style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    bottom: 0,
                                                    right: 0,
                                                }}
                                                source={{
                                                    uri: `${item.media[0].gateway}`,
                                                    priority: FastImage.priority.high
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <Text
                                            style={{
                                                color: COLORS.white,
                                                ...FONTS.h2,
                                                marginTop: SIZES.padding,
                                            }}
                                        >
                                            {`${item.title}`}
                                        </Text>
                                        <Text
                                            style={{
                                                color: COLORS.white,
                                                ...FONTS.body3,
                                                marginTop: SIZES.radius,
                                            }}
                                        >
                                            {`${item.description}`}
                                        </Text>
                                    </View>
                                </Animated.View>
                            )}
                        />
            }
        
            
        </ImageBackground>
    );
}


export default Polygon;