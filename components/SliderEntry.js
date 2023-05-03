import React, { Component } from 'react';
import {
    View,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { COLORS, SIZES } from '../constants';
import Icon from 'react-native-vector-icons/AntDesign';
import IconF from 'react-native-vector-icons/Feather';
import FastImage from 'react-native-fast-image';
import Animated from "react-native-reanimated";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const itemHorizontalMargin = wp(1);

export default class SliderEntry extends Component {

    render() {
        const { data: { illustration }, playPause, playVideo, video, audio, handleImagePress } = this.props;

        return (
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    width: viewportWidth,
                    height: viewportHeight * 0.725,
                    paddingHorizontal: itemHorizontalMargin,
                }}
                onPress={() => handleImagePress(illustration)}
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
                            source={{
                                uri: `${illustration}`,
                                priority: FastImage.priority.high
                            }}
                        />
                    </View>
                </Animated.View>
                {
                    video ?
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
                            onPress={() => playVideo(video)}
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
                    audio ?
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
            </TouchableOpacity>
        );
    }
}