import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Platform,
    FlatList,
    useWindowDimensions,
    Text,
    ImageBackground,
    ActivityIndicator,
    TouchableWithoutFeedback
} from 'react-native';
import Video from 'react-native-video';
import { BASE_URL } from '../../config';
import { images, icons, SIZES, COLORS } from '../../constants';
import { IconButton } from '../../components';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'; 

const ViewVideo = ({ navigation, route }) => {

    const window = useWindowDimensions();

    const [list, setList] = useState([]);

    const [paused, setPaused] = useState(list.map((_, index) => index !== 0));
    const [buffering, setBuffering] = useState(list.map(() => false));
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [endList, setEndList] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [commonError, setCommonError] = useState("");

    const refFlatList = useRef();

    const myViewableItemsChanged = useRef(event => {
        if (event.viewableItems.length === 1) {
            setSelectedIndex(event.viewableItems[0].index);
        }
    });

    useEffect(() => {
        setPaused(list.map((_, index) => index !== selectedIndex));
    }, [list, selectedIndex]);

    useEffect(() => {
        getThetaVideos();
    }, []);

    const getThetaVideos = async () => {
        setIsLoading(true);
        setList([]);
        try {
            const response = await axios.get(`${BASE_URL}/theta/videos/list/${encodeURIComponent(route.params.data)}`);
            setIsLoading(false);
            setList(response.data.data);
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
                    : <FlatList
                        ref={refFlatList}
                        data={list}
                        onViewableItemsChanged={myViewableItemsChanged.current}
                        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                        keyExtractor={item => `${item.id}`}
                        initialNumToRender={1}
                        maxToRenderPerBatch={1}
                        removeClippedSubviews={true}
                        pagingEnabled
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={() => {
                            return (
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: window.width,
                                        height: window.height,
                                    }}>
                                    <Text>{'No more videos yet...'}</Text>
                                </View>
                            );
                        }}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableWithoutFeedback>
                                    <View>
                                        {buffering[index] && (
                                            <ActivityIndicator
                                                style={{
                                                    position: 'absolute',
                                                    top: window.height / 2 - 10,
                                                    left: window.width / 2 - 10,
                                                    zIndex: 9999,
                                                }}
                                                color="#fff"
                                                size={'large'}
                                            />
                                        )}
                                        {
                                            paused[index] && (
                                                <Icon
                                                    name={"play"}
                                                    size={40}
                                                    color="#FFF"
                                                    style={{
                                                        position: 'absolute',
                                                        top: window.height / 2 - 10,
                                                        left: window.width / 2 - 10,
                                                        zIndex: 9999,
                                                    }}
                                                />
                                            )
                                        }
                                        <Video
                                            paused={paused[index]}
                                            onBuffer={event => {
                                                if (buffering[index] !== event.isBuffering) {
                                                    buffering[index] = event.isBuffering;
                                                    setBuffering([...buffering]);
                                                }
                                            }}
                                            onLoadStart={event => {
                                                buffering[index] = true;
                                                setBuffering([...buffering]);
                                            }}
                                            repeat={true}
                                            controls={true}
                                            style={{
                                                width: '100%',
                                                backgroundColor: 'black',
                                                height: Platform.OS === 'ios' ? window.height : window.height - 24,
                                            }}
                                            source={{ uri: item.playback_uri }}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        }}
                    />
            }

        </ImageBackground>
    );
};

export default ViewVideo;