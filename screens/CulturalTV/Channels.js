import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    SafeAreaView,
    ImageBackground,
    Image
} from 'react-native';
import { FONTS, COLORS, SIZES, icons, images } from '../../constants';
import { Header, IconButton} from '../../components';

import FastImage from 'react-native-fast-image';
import { FlashList } from '@shopify/flash-list';
import { AuthContext } from '../../Context/authContext';


const Channels = ({ navigation }) => {

    const [collectionList, setCollectionList] = useState([
       { name: 'Just-Ice', image: 'justIce' },
       { name: 'EBS_Ddot', image: 'ebsDdot' },
       { name: 'Earn Your Leisure', image: 'earn' },
       { name: 'Block Reports', image: 'blockReports' },
       { name: 'Jastin Martin', image: 'justinMartin' },
       { name: 'Dub Digital', image: 'dubDigital' },
       { name: "Gracie's Corner", image: 'gracies' },
       { name: "The 2nd", image: 'the2nd' }, 
       { name: 'BrandMan Network', image: 'brandman' },
       { name: "Godbody University", image: 'godBody' }
    ]);
   
    const { userInfo, logout } = useContext(AuthContext);


    function renderHeader() {
        return (
            <Header
                title={<Image source={images.views} resizeMode='contain' style={{ width: 100, height: 70 }} />}
                titleStyle={{
                    color: COLORS.white,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                containerStyle={{
                    height: 50,
                    marginTop: 0,
                    alignItems: 'center',
                    paddingHorizontal: SIZES.base,
                }}
                leftComponent={
                    <IconButton
                        icon={icons.menu}
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
                            navigation.push('ProfileTab');
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
            style={{ flex : 1 }}
        >
            <SafeAreaView>
                {renderHeader()}
            </SafeAreaView>
            <FlashList
                key={1}
                data={collectionList}
                keyExtractor={x => `_${x.name}`}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                estimatedItemSize={316}
                initialScrollIndex={0}
                renderItem={({ item, index }) => {
                    return (
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
                                onPress={() => navigation.push('ChannelsInit', { data: item.name, image: item.image })}
                            >
                                <View
                                    style={{
                                        alignItems: 'center',
                                        borderRadius: SIZES.radius,
                                        overflow: 'hidden'
                                    }}
                                >
                                    <FastImage
                                        source={images[item.image]}
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
                                    {`${item.name}`}
                                </Text>
                            </View>
                        </View>
                        )
                    }}
                    ListFooterComponent={
                        <View style={{ alignItems: 'center' }}>
                            <View style={{ height: 200 }} />
                        </View>
                    }
            /> 
            </ImageBackground>
    )
}


export default Channels;