import React, { useState, useContext, useEffect, useRef } from 'react';
import {
    View,
    SafeAreaView,
    Dimensions,
    ImageBackground
} from 'react-native';
import { FONTS, COLORS, SIZES, icons, images } from '../../constants';
import { Header, IconButton, SliderEntry } from '../../components';

import { AuthContext } from '../../Context/authContext';
import ImageView from "react-native-image-viewing";
import Sound from 'react-native-sound';
import Carousel from "react-native-reanimated-carousel";
import { ACCESS_TOKEN } from '../../config';

Sound.setCategory('Playback');

let audio;

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const Asset = ({ navigation, route }) => {

    const [imagesAsset, setImagesAsset] = useState([]);
    const [imagesIndex, setImagesIndex] = useState(0);
    const [visible, setIsVisible] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [loadedAudio, setLoadedAudio] = useState(false);

    const [imagesToUse, setImagesToUse] = useState([]);


    const flashListRef = useRef(null);

    const { userInfo } = useContext(AuthContext);

    const _renderItemWithParallax = ({ item, index }) => {
        return (
            <SliderEntry
                data={item}
                even={(index + 1) % 2 === 0}
                playVideo={(val) => playVideo(val)}
                playPause={() => playPause()}
                handleImagePress={(val) => handleImagePress(val)}
                audio={route.params.data.immutable_data.audio ? route.params.data.immutable_data.audio : null}
                video={route.params.data.immutable_data.video ? route.params.data.immutable_data.video : null}
            />
        );
    }

    useEffect(() => {
        let images = [];
        for (let index = 0; index < route.params.data.schema.format.length; index++) {
            let elem = route.params.data.schema.format[index];
            if (elem.type == 'image') {
                images.push({
                    illustration: route.params.data.immutable_data[`${elem.name}`].startsWith("https://") ? `${route.params.data.immutable_data[`${elem.name}`]}` : `https://solidcircle.mypinata.cloud/ipfs/${route.params.data.immutable_data[`${elem.name}`]}${ACCESS_TOKEN}`,
                });
            }
        }
        setImagesToUse(images);
    }, []);

    useEffect(() => {
        if (route.params.data.immutable_data.audio) {
            let url = route.params.data.immutable_data.audio.startsWith("https://") ? `${route.params.data.immutable_data.audio}` : `https://solidcircle.mypinata.cloud/ipfs/${route.params.data.immutable_data.audio}${ACCESS_TOKEN}`;
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
            uri: `${val}`,
        });

        setImagesAsset(imgs);
        setIsVisible(true);
        // setImagesIndex(ind);
    }

    const playVideo = (val) => {
        navigation.push('VideoPlayer', { url: val.startsWith("https://") ? `${val}` : `https://solidcircle.mypinata.cloud/ipfs/${val}${ACCESS_TOKEN}` })
    }

    const baseOptions = { vertical: false, width: viewportWidth, height: viewportHeight * 0.8 };

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
            
            <Carousel
                {...baseOptions}
                loop={false}
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.9,
                    parallaxScrollingOffset: 50,
                }}
                data={imagesToUse}
                renderItem={_renderItemWithParallax}
            />
        
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: SIZES.base,
                    height: 1,
                    backgroundColor: COLORS.black,
                    borderRadius: SIZES.radius,
                    marginHorizontal: SIZES.padding
                }}
            > 
            </View>
        </ImageBackground>
    )
}


export default Asset;