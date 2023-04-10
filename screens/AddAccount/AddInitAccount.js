import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    ImageBackground,
    TextInput
} from 'react-native';
import { Header, IconButton, FormInput, TextButton } from '../../components';
import { FONTS, SIZES, COLORS, icons, images } from '../../constants';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { AuthContext } from '../../Context/authContext';


const AddAccountInit = ({ navigation }) => {

    const [accountName, setAccountName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [commonError, setCommonError] = useState("");

    const { userInfo } = useContext(AuthContext);

    const renderHeader = () => {
        return (
            <Header
                title="Add Account"
                containerStyle={{
                    height: 50,
                    marginHorizontal: SIZES.base,
                    marginTop: 0,
                }}
                titleStyle={{
                    color: COLORS.white
                }}
                leftComponent={
                    <IconButton
                        icon={icons.cross}
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

    const handleAccountAdd = async (val) => {
        navigation.push('AddAccount', { type: val });
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
                { renderHeader() }
            </SafeAreaView>
            <View
                style={{
                    marginHorizontal: SIZES.radius,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Image
                    source={images.logo_02}
                    resizeMode='contain'
                    style={{
                        height: 250,
                        width: 250,
                        borderRadius: SIZES.radius,
                        marginBottom: SIZES.padding 
                    }}
                />
                
                <TextButton
                    label="Add PROTON Account"
                    buttonContainerStyle={{
                        height: 55,
                        alignItems: 'center',
                        marginTop: SIZES.padding,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.primary,
                        paddingHorizontal: SIZES.padding,
                        alignSelf: 'center'
                    }}
                    onPress={() => handleAccountAdd('PROTON')}
                />

                <Text
                    style={{
                        color: COLORS.white,
                        ...FONTS.body3,
                        alignSelf: 'center',
                        marginTop: SIZES.padding,
                    }}
                >
                    OR
                </Text>

                <TextButton
                    label="Add POLYGON Account"
                    buttonContainerStyle={{
                        height: 55,
                        alignItems: 'center',
                        marginTop: SIZES.padding,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.primary,
                        paddingHorizontal: SIZES.padding,
                        alignSelf: 'center'
                    }}
                    onPress={() => handleAccountAdd('POLYGON')}
                />
            </View>
        </ImageBackground>
    )
}

export default AddAccountInit