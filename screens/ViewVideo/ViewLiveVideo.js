import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Platform,
    FlatList,
    useWindowDimensions,
    Text,
    ImageBackground,
    ActivityIndicator,
    SafeAreaView,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import Video from 'react-native-video';
import { BASE_URL } from '../../config';
import { images, icons, SIZES, COLORS, FONTS } from '../../constants';
import { IconButton, Header } from '../../components';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'; 

const ViewLiveVideo = ({ navigation, route }) => {

    const window = useWindowDimensions();

    const [list, setList] = useState([]);

    const [buffering, setBuffering] = useState(list.map(() => false));

    const [isLoading, setIsLoading] = useState(false);
    const [commonError, setCommonError] = useState("");

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

    return (
        <ImageBackground
            source={images.background}
            style={{ flex: 1 }}
        >
            <View
                style={{
                    position: 'absolute',
                    top: 70,
                    left: 20,
                    zIndex: 3, // works on ios
                    elevation: 3, // works on android
                }}
            >
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
            </View>
            {
                isLoading ?
                    <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator />
                    </View>
                    : 
                    <View>
                        <View>
                            {buffering[0] && (
                                <ActivityIndicator
                                    style={{
                                        position: 'absolute',
                                        top: window.height / 2 - 10,
                                        left: window.width / 2 - 10,
                                        z0: 9999,
                                    }}
                                    color="#fff"
                                    size={'large'}
                                />
                            )}
                            <Video
                               
                                onBuffer={event => {
                                    if (buffering[0] !== event.isBuffering) {
                                        buffering[0] = event.isBuffering;
                                        setBuffering([...buffering]);
                                    }
                                }}
                                onLoadStart={event => {
                                    buffering[0] = true;
                                    setBuffering([...buffering]);
                                }}
                                repeat={false}
                                style={{
                                    width: '100%',
                                    backgroundColor: 'black',
                                    height: Platform.OS === 'ios' ? window.height : window.height - 24,
                                }}
                                source={{ uri: route.params.data.playback_url }}
                            />
                        </View>
                    </View>
            }

        </ImageBackground>
    );
};

export default ViewLiveVideo;