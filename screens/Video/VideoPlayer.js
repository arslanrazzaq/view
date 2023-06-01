import React, { useContext, useEffect, useState } from 'react';
import {
    SafeAreaView,
    ActivityIndicator,
    ImageBackground
} from 'react-native';
import { FONTS, COLORS, SIZES, icons, images } from '../../constants';
import { Header, IconButton, TextIconButton } from '../../components';
import { AuthContext } from '../../Context/authContext';
import Video from 'react-native-video';
import Icon1 from 'react-native-vector-icons/FontAwesome';


const VideoPlayer = ({ navigation, route }) => {

    const { userInfo } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [showVideo, setShowVideo] = useState(true);

    useEffect(() => {
        // Do mounting stuff here
        const unsubscribe = navigation.addListener('willFocus', async () => {
            setShowVideo(true);
        });
        return unsubscribe;
    }, []);

    function renderHeader() {
        return (
            <Header
                title={``}
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

    return (
        <ImageBackground 
            source={images.background}
            style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}
        >
            <SafeAreaView>
                {renderHeader()}
            </SafeAreaView>
            {loading ? <ActivityIndicator /> : null}
            {   
                !loading && isError ? 
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
                        onPress={() => setIsError(false)}
                    />
                : 
                    null
            }
            {   
                route.params.url && !isError && showVideo ?
                    <Video  
                        source={{ uri: route.params.url }}
                        repeat={false}
                        controls={true}
                        onLoad={(e) => setLoading(false)}
                        onError={(err) => {
                            console.log('error: ', err);
                            setLoading(false);
                            setIsError(true);
                        }}
                        style={{
                            flex: 1,
                            backgroundColor: COLORS.lightGray2
                        }}
                    />
                : null
            }

        </ImageBackground>
    )
}


export default VideoPlayer;