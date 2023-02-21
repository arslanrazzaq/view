import React, { useState, useContext, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    TouchableWithoutFeedback,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
    FlatList
} from 'react-native';
import { FONTS, COLORS, SIZES, icons, images } from '../../constants';
import { PostCard, TextButton, Header, IconButton, TextIconButton, FormPicker } from '../../components';
import Icon from 'react-native-vector-icons/AntDesign';
import IconF from 'react-native-vector-icons/Feather';
import axios from 'axios';
import moment from 'moment';
import { BASE_URL_API } from '../../config';
import FastImage from 'react-native-fast-image';
import { FlashList } from '@shopify/flash-list';
import { AuthContext } from '../../Context/authContext';
import ImageView from "react-native-image-viewing";
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

let audio; 

const Asset = ({ navigation, route }) => {

    const [collectionList, setCollectionList] = React.useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [commonError, setCommonError] = useState("");

    const [isLoadingExtra, setIsLoadingExtra] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(true);

    const [imagesAsset, setImagesAsset] = useState([]);
    const [imagesIndex, setImagesIndex] = useState(0);
    const [visible, setIsVisible] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [loadedAudio, setLoadedAudio] = useState(false);

    const flashListRef = useRef(null);
  
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
    //    getNftsUserCollections();
    }, []);

    useEffect(() => { 
        if (route.params.data.immutable_data.audio) {
            let url = route.params.data.immutable_data.audio.startsWith("https://") ? `${route.params.data.immutable_data.audio}` : `https://solidcircle.mypinata.cloud/ipfs/${route.params.data.immutable_data.audio}`;
            audio = new Sound(
                url,
                null,
                error => {
                    if (error) {
                        console.log('failed to load the sound', error);
                        return;
                    }
                    // if loaded successfully
                    setLoadedAudio(true);
                    console.log(
                        'duration in seconds: ' +
                        audio.getDuration() +
                        'number of channels: ' +
                        audio.getNumberOfChannels(),
                    );
                },
            );
            audio.setVolume(1);
            return () => {
            audio.release();
            };
        }
      }, []);
   
    // const getNftsUserCollections = async () => {
    //     setIsLoading(true);
    //     setCollectionList([]);
    //     try {
    //         const response = await axios.get(`${BASE_URL_API}//atomicassets/v1/templates?collection_name=${route?.params?.collection_name}&page=1&limit=${pageSize}&order=desc&sort=created`);
    //         setIsLoading(false);
    //         setCollectionList(response.data.data);
    //         flashListRef.current?.scrollToIndex(0);
    //         if (response.data.data.length < pageSize) {
    //             setCount(false);                
    //         }
    //     } catch (error) {
    //         console.log('called err: ', error);
    //         if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
    //             setCommonError(error.response.data.msg);
    //             setIsLoading(false);
    //         } else {
    //             setCommonError('Unknown Error, Try again later');
    //             setIsLoading(false);
    //         }
    //     }
    // }

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

    const playPause = () => {
        if (loadedAudio) {
            if (audio.isPlaying()) {
                audio.pause();
                setPlaying(false);
                } else {
                setPlaying(true);
                audio.play(success => {
                    if (success) {
                    setPlaying(false);
                    console.log('successfully finished playing');
                    } else {
                    setPlaying(false);
                    console.log('playback failed due to audio decoding errors');
                    }
                });
            }
        }
      };

    const handleImagePress = (val) => {
    
        let imgs = [];
        imgs.push({
            uri: val.startsWith("https://") ? `${val}` : `https://solidcircle.mypinata.cloud/ipfs/${val}`,
        });

        setImagesAsset(imgs);
        setIsVisible(true);
        // setImagesIndex(ind);
    }

    const playVideo = (val) => {
        navigation.push('VideoPlayer', { url: val.startsWith("https://") ? `${val}` : `https://solidcircle.mypinata.cloud/ipfs/${val}`})
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

            <ImageView
                images={imagesAsset}
                imageIndex={imagesIndex}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
            />

            <View
                style={{
                    marginVertical: SIZES.base,
                    paddingHorizontal: SIZES.radius,
                    overflow: 'hidden'
                }}
            >
                <TouchableWithoutFeedback
                    onPress={() => handleImagePress(route.params.data.immutable_data.image)}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            overflow: 'hidden',
                            borderRadius: SIZES.radius,
                        }}
                    >
                        <FastImage
                            source={{  
                                uri: route.params.data.immutable_data.image.startsWith("https://") ? `${route.params.data.immutable_data.image}` : `https://solidcircle.mypinata.cloud/ipfs/${route.params.data.immutable_data.image}`,
                                priority: FastImage.priority.high 
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                            style={{
                                height: Dimensions.get('screen').height - 250,
                                width: "100%",
                                aspectRatio: 1,
                                borderRadius: SIZES.radius
                            }}
                        />
                        {
                            route.params.data.immutable_data.video ?
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        bottom: SIZES.radius,
                                        flexDirection: 'row',
                                        left: SIZES.radius,
                                        zIndex: 3, // works on ios
                                        elevation: 3,
                                        paddingHorizontal: SIZES.radius,
                                        paddingVertical: SIZES.base,
                                        borderRadius: SIZES.radius,
                                        backgroundColor: '#e8e8e8' 
                                    }}
                                    onPress={() => playVideo(route.params.data.immutable_data.video)}
                                >
                                    <IconF 
                                        name={'youtube'} 
                                        size={32} 
                                        color={COLORS.black}
                                    />
                                </TouchableOpacity>
                            : 
                                null
                        }
                        {   
                            route.params.data.immutable_data.audio ?
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
                                        width: 60,
                                        height: 60,
                                        borderRadius: 50,
                                        backgroundColor: '#e8e8e8'
                                    }}
                                    onPress={() => playPause()}
                                >
                                    <IconF 
                                        name={'music'} 
                                        size={32} 
                                        color={COLORS.black}
                                    />
                                </TouchableOpacity>
                            : 
                                null
                        }
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View
                style={{
                    // flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: SIZES.base,
                }}
            >   
                <TouchableOpacity
                    style={{
                        paddingHorizontal: SIZES.radius,
                        paddingVertical: SIZES.base,
                        borderColor: COLORS.white,
                        borderWidth: 1,
                        borderRadius: SIZES.radius,
                        marginRight: SIZES.radius
                    }}
                    onPress={() => handleImagePress(route.params.data.immutable_data.image)}
                >
                    <IconF 
                        name={'image'} 
                        size={32} 
                        color={COLORS.gold}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        paddingHorizontal: SIZES.radius,
                        paddingVertical: SIZES.base,
                        borderColor: COLORS.white,
                        borderWidth: 1,
                        borderRadius: SIZES.radius
                    }}
                >
                    <IconF 
                        name={'share-2'} 
                        size={32} 
                        color={COLORS.gold}
                    />
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}


export default Asset;