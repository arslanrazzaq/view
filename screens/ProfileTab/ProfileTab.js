import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Linking,
    ImageBackground,
    SafeAreaView
} from 'react-native';
import { COLORS, SIZES, FONTS, icons, images } from '../../constants';
import { AuthContext } from '../../Context/authContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import { PostCard, TextButton, Header, IconButton, TextIconButton, FormPicker } from '../../components';

const CustomDrawerItem = ({ label, icon, iconLib, onPress }) => {
    return (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                paddingVertical: SIZES.padding,
                borderBottomColor: COLORS.lightGray1,
                borderBottomWidth: 1,
                alignItems: 'center',
                paddingLeft: SIZES.radius,
                borderRadius: SIZES.radius,
            }}
            onPress={onPress}
        >
            {   !iconLib ? 
                    <Image
                        source={icon}
                        style={{
                            width: 25,
                            height: 25,
                            tintColor: COLORS.white
                        }}
                    /> 
                :
                    <Icon
                        name={iconLib}
                        size={28}
                        color={COLORS.white}
                    />
            }
            <Text
                style={{
                    marginLeft: 15,
                    color: COLORS.white,
                    ...FONTS.h3,
                    fontSize: 20
                }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    )
}

const ProfileTab = ({ navigation }) => {


    const { userInfo, logout } = useContext(AuthContext);
    
    useEffect(() => {
    }, []);

    const renderHeader = () => {
        return (
            <Header
                title=""
                titleStyle={{
                    color: COLORS.white,
                }}
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
            style={{ flex : 1 }}
        >
            <SafeAreaView>
                {renderHeader()}
            </SafeAreaView>
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    marginTop: SIZES.radius,
                    backgroundColor: COLORS.black,
                    borderRadius: SIZES.radius
                }}
                onPress={() => { 
                    if (userInfo?.user?.id) { 
                        navigation.push("Home") 
                    } else {
                        navigation.push("SignInInit");
                    } 
                }}
            >
                <View 
                    style={{
                        borderWidth: 1,
                        borderColor: COLORS.gray2,
                        borderRadius: SIZES.radius,
                        overflow: 'hidden',
                    }}
                >
                    <FastImage 
                        source={{ priority: FastImage.priority.high, uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" }}
                        style={{
                            width: 100,
                            height: 100,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </View>
               
                <View
                    style={{
                        marginLeft: SIZES.radius
                    }}
                >
                    <Text
                        style={{
                            color: COLORS.white, ...FONTS.h3, fontSize: 18, paddingVertical: SIZES.radius
                        }}
                    >
                        { userInfo.user?.username ? `${userInfo.user?.username}` : 'Username' }
                    </Text>
                    <Text
                        style={{
                            color: COLORS.white,
                            ...FONTS.body3
                        }}
                    >
                        View your profile
                    </Text>
                </View>
            </TouchableOpacity>
            <View
                style={{
                    flex: 1,
                    marginTop: SIZES.padding
                }}
            >
                {/* <CustomDrawerItem
                    label={'How it works?'}
                    iconLib={'help-outline'} 
                    onPress={() => { 
                        navigation.push("Faq"); 
                    }}
                /> */}
                {/* <CustomDrawerItem
                    label={'My email'}
                    iconLib={'alternate-email'}
                    onPress={() => { 
                        if (userInfo?.user?.id) { 
                            navigation.push("Paypal"); 
                        } else {
                            navigation.push("SignInInit"); 
                        } 
                    }}
                /> */}
                <CustomDrawerItem
                    label={'Privacy Policy'}
                    iconLib={'description'}
                    onPress={() => { Linking.openURL(`http://solidcircle.tech/privacy`); }}
                />
                <CustomDrawerItem
                    label={'Contact Us'}
                    iconLib={'mail-outline'}
                    onPress={() => { navigation.push("ContactUs"); }}
                />
                { userInfo && userInfo.user && userInfo.user.id ?
                    <CustomDrawerItem
                        label={'Logout'}
                        iconLib={'logout'}
                        onPress={() => logout()}
                    /> 
                    : 
                    <CustomDrawerItem
                        label={'Login'}
                        iconLib={'login'}
                        onPress={() => { navigation.push('SignInInit') }}
                    /> 
                }
                {/* { userInfo && userInfo.user && userInfo.user.id ? 
                    <CustomDrawerItem
                        label={'Delete Account'}
                        icon={icons.delete_icon}
                        onPress={() => navigation.push("DelAccount")}
                    /> : null 
                } */}
            </View>
        </ImageBackground>
    )
}

export default ProfileTab;