import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    ImageBackground,
    Dimensions
} from 'react-native';
import { Header, IconButton, TextButton } from '../../components';
import { FONTS, SIZES, COLORS, icons, images } from '../../constants';


const DeleteAccount = ({ navigation }) => {

    const renderHeader = () => {
        return (
            <Header
                title=""
                containerStyle={{
                    height: 50,
                    marginHorizontal: SIZES.base,
                    marginTop: 0,
                }}
                leftComponent={
                    <IconButton
                        icon={icons.back}
                        containerStyle={{
                            width: 50,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderRadius: SIZES.radius,
                            borderColor: COLORS.gray2
                        }}
                        iconStyle={{
                            width: 30,
                            height: 20,
                            tintColor: COLORS.gold,
                        }}
                        onPress={() => navigation.goBack()}
                    />
                }
                rightComponent={null}
            />
        )
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
            <View
                style={{
                    marginHorizontal: SIZES.padding,
                    marginTop: SIZES.radius,
                    borderRadius: SIZES.radius,
                    flex: 1,
                    alignItems: 'center'
                }}
            >
                <Text
                    style={{
                        color: COLORS.white,
                        ...FONTS.h2,
                    }}
                >
                    Delete My Account
                </Text>
                <Image
                    source={images.logo_02}
                    resizeMode='contain'
                    style={{
                        height: 350,
                        width: Dimensions.get('window').width,
                        borderRadius: SIZES.radius,
                        marginVertical: SIZES.padding * 2
                    }}
                />
                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <TextButton
                        buttonContainerStyle={{
                            height: 40,
                            flex: 1,
                            marginLeft: SIZES.base,
                            borderRadius: SIZES.radius,
                            // borderColor: SIZES.black,
                            // borderWidth: 1,
                            backgroundColor: COLORS.white
                        }}
                        labelStyle={{
                            color: COLORS.black,
                            ...FONTS.h4
                        }}
                        label={'No'}
                        onPress={() => navigation.navigate("Home")}
                    />
                    <TextButton
                        buttonContainerStyle={{
                            height: 40,
                            flex: 1,
                            marginLeft: SIZES.base,
                            borderRadius: SIZES.radius,
                            // borderColor: SIZES.red,
                            // borderWidth: 1,
                            backgroundColor: COLORS.red
                        }}
                        labelStyle={{
                            color: COLORS.white,
                            ...FONTS.h4
                        }}
                        label={'Yes'}
                        onPress={() => navigation.navigate("DeleteAccountConfirmation")}
                    />
                </View>
            </View>

        </ImageBackground>
    )
}

export default DeleteAccount