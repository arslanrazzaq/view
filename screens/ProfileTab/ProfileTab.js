import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import { COLORS, SIZES, FONTS, icons } from '../../constants';
import { AuthContext } from '../../Context/authContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
                            tintColor: COLORS.black
                        }}
                    /> 
                :
                    <Icon
                        name={iconLib}
                        size={28}
                        color={COLORS.black}
                    />
            }
            <Text
                style={{
                    marginLeft: 15,
                    color: COLORS.black,
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

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.white,
                borderRadius: SIZES.radius,
                paddingHorizontal: SIZES.radius,
            }}
        >
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    marginTop: SIZES.radius,
                    backgroundColor: COLORS.black,
                    borderRadius: SIZES.radius
                }}
                onPress={() => { 
                    if (userInfo?.user?.id) { 
                        navigation.push("Profile", { user_id: userInfo?.user?.id }) 
                    } else {
                        navigation.push("SignInInit");
                    } 
                }}
            >
                <Image
                    source={{uri: userInfo.user?.profile_pic ? userInfo.user?.profile_pic : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"}}
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: SIZES.radius
                    }}
                />
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
                <CustomDrawerItem
                    label={'How it works?'}
                    iconLib={'help-outline'} 
                    onPress={() => { 
                        navigation.push("Faq"); 
                    }}
                />
                <CustomDrawerItem
                    label={'My email'}
                    iconLib={'alternate-email'}
                    onPress={() => { 
                        if (userInfo?.user?.id) { 
                            navigation.push("Paypal"); 
                        } else {
                            navigation.push("SignInInit"); 
                        } 
                    }}
                />
                <CustomDrawerItem
                    label={'Legal'}
                    iconLib={'description'}
                    onPress={() => { navigation.push("Legal"); }}
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
                { userInfo && userInfo.user && userInfo.user.id ? 
                    <CustomDrawerItem
                        label={'Delete Account'}
                        icon={icons.delete_icon}
                        onPress={() => navigation.push("DelAccount")}
                    /> : null 
                }
            </View>
        </View>
    )
}

export default ProfileTab;