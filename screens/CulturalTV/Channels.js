import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    SafeAreaView,
    ImageBackground,
} from 'react-native';
import { FONTS, COLORS, SIZES, icons, images } from '../../constants';
import { Header, IconButton} from '../../components';

import FastImage from 'react-native-fast-image';
import { FlashList } from '@shopify/flash-list';
import { AuthContext } from '../../Context/authContext';
import ViewIconSvg from '../../assets/svgs/view-svg2.svg';


const Channels = ({ navigation }) => {

    const [collectionList, setCollectionList] = useState([
        'Culture Dapp',
        'View',
        'Animation',
        'Just-Ice',
        'EBS_Ddot',
        'Earn Your Leisure',
        'Block Reports',
        'Jastin Martin',
        'Dub Digital',
        "Gracie's Corner",
        'BrandMan Network',
        "Godbody University",
        "The 2nd"
    ]);
   
    const { userInfo, logout } = useContext(AuthContext);


    function renderHeader() {
        return (
            <Header
                title={<ViewIconSvg width={100} height={70} />}
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
                keyExtractor={x => `_${x}`}
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
                                onPress={() => navigation.push('ViewVideo', { data: item })}
                            >
                                <View
                                    style={{
                                        alignItems: 'center',
                                        borderRadius: SIZES.radius,
                                        overflow: 'hidden'
                                    }}
                                >
                                    <FastImage
                                        source={{  
                                        // uri: item.immutable_data.image.startsWith("https://") ? `${item.immutable_data.image}` : `https://solidcircle.mypinata.cloud/ipfs/${item.immutable_data.image}`,
                                            uri:  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
                                            priority: FastImage.priority.high 
                                        }}
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
                                    {`${item}`}
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