import React, { useEffect } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    Platform,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import { images, SIZES, FONTS, COLORS, icons } from "../../constants";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, IconButton } from "../../components";


const AuthLayout = ({ title, subTitle, titleContainerStyle, children, navigation, isLoading, isHeader }) => {

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
                            tintColor: COLORS.gray,
                        }}
                        onPress={() => navigation.goBack()}
                    />
                }
                rightComponent={null}
            />
        )
    }


    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}
        >
            <SafeAreaView style={{ backgroundColor: COLORS.white }}>
                {isHeader ? renderHeader() : null}
            </SafeAreaView>
            {   isLoading ? 
                    <View 
                        style={{ 
                            position: 'absolute', 
                            width: '100%', 
                            height: '100%',
                            zIndex: 3, // works on ios
                            elevation: 3, // works on android
                            backgroundColor: 'rgba(255,255,255,0.75)' 
                        }}
                    >
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator /> 
                        </View>
                    </View> 
                : null
            }
            <ScrollView
                style={{
                    flexGrow: 1
                }}
            >
                <KeyboardAwareScrollView
                    keyboardDismissMode="on-drag"
                    contentContainerStyle={{
                        flex: 1,
                        paddingHorizontal: SIZES.padding
                    }}
                    enableOnAndroid={true}
                    enableAutomaticScroll={Platform.OS === 'ios'}
                    keyboardShouldPersistTaps={"handled"}
                    enableResetScrollToCoords={false}
                >
                    
                    <View
                        style={{
                            alignItems: 'center',
                            marginTop: SIZES.radius
                        }}
                    >
                        <Image
                            source={images.logo_02}
                            resizeMode='contain'
                            style={{
                                height: 125,
                                width: 125,
                                borderRadius: SIZES.radius
                            }}
                        />
                    </View>
                    <View
                    style={{
                        marginTop: SIZES.padding,
                        ...titleContainerStyle
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            ...FONTS.h2,
                            color: COLORS.black
                        }}
                    >
                        {title}
                    </Text>
                    <Text
                        style={{
                            textAlign: 'center',
                            color: COLORS.darkGray,
                            marginTop: SIZES.base,
                            ...FONTS.body3
                        }}
                    >
                        {subTitle}
                    </Text>
                    </View>
                    {
                        children
                    }
                </KeyboardAwareScrollView>
            </ScrollView>
        </View>

    )
}

export default AuthLayout;