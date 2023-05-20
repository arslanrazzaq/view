import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    Alert,
    Dimensions,
    Image,
    ImageBackground,
    SafeAreaView
} from 'react-native';
import { Header, IconButton, TextButton } from '../../components';
import { FONTS, SIZES, COLORS, icons, images } from '../../constants';
import { AuthContext } from '../../Context/authContext';
import { BASE_URL } from '../../config';
import axios from "axios";
import AnimatedLoader from "react-native-animated-loader";


const DeleteAccountConfirmation = ({ navigation }) => {

    const { userInfo, logout } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteUser = async () => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`${BASE_URL}/user/delete`, { data: { id: userInfo.user.id, status: true } });
            setIsLoading(false);
            logout();
            Alert.alert('Delete Account', `Your Account has been deleted successfully`);
            //navigation.push('Home');
        } catch (error) {
            setIsLoading(false);
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                Alert.alert('Delete Account', `${error.response.data.msg}`);
            } else {
                Alert.alert('Delete Account', `Unknown Error, Try again later'`);
            }
        }
    }

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
                flex: 1,
            }}
        >
            <SafeAreaView>
                {renderHeader()}
            </SafeAreaView>
            <AnimatedLoader
                visible={isLoading}
                overlayColor="rgba(255,255,255,0.75)"
                source={require("../../constants/loader.json")}
                animationStyle={{
                    width: 300,
                    height: 300
                }}
                speed={1}
            />
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
                        ...FONTS.h2
                    }}
                >
                    Are you sure you want to
                </Text>
                <Text
                    style={{
                        color: COLORS.white,
                        ...FONTS.h2
                    }}
                >
                    delete your account?
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
                        flexDirection: 'row'
                    }}
                >
                    <TextButton
                        buttonContainerStyle={{
                            height: 40,
                            flex: 1,
                            marginLeft: SIZES.base,
                            borderRadius: SIZES.radius,
                            borderColor: SIZES.black,
                            borderWidth: 1,
                            backgroundColor: COLORS.white
                        }}
                        labelStyle={{
                            color: COLORS.black,
                            ...FONTS.h4
                        }}
                        label={'No'}
                        onPress={() => navigation.goBack()}
                    />
                    <TextButton
                        buttonContainerStyle={{
                            height: 40,
                            flex: 1,
                            marginLeft: SIZES.base,
                            borderRadius: SIZES.radius,
                            backgroundColor: COLORS.red
                        }}
                        labelStyle={{
                            color: COLORS.white,
                            ...FONTS.h4
                        }}
                        label={'Yes'}
                        onPress={() => { handleDeleteUser() }}
                    />
                </View>
            </View>
        </ImageBackground>
    )
}

export default DeleteAccountConfirmation;