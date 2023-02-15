import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    TextInput
} from 'react-native';
import { Header, IconButton, FormInput, TextButton } from '../../components';
import { FONTS, SIZES, COLORS, icons, images } from '../../constants';


const AddAccount = ({ navigation }) => {

    const [accountName, setAccountName] = useState('');

    const renderHeader = () => {
        return (
            <Header
                title="Add Account"
                containerStyle={{
                    height: 50,
                    marginHorizontal: SIZES.base,
                    marginTop: 0,
                }}
                leftComponent={
                    <IconButton
                        icon={icons.cross}
                        containerStyle={{
                            width: 50,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderRadius: SIZES.radius,
                            borderColor: COLORS.black
                        }}
                        iconStyle={{
                            width: 30,
                            height: 20,
                            tintColor: COLORS.black,
                        }}
                        onPress={() => navigation.goBack()}
                    />
                }
                rightComponent={
                    <IconButton 
                        containerStyle={{
                            width: 50,
                            height: 40
                        }}
                    />
                }
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
                <Text
                    style={{
                        color: COLORS.black,
                        ...FONTS.body3,
                        alignSelf: 'center'
                    }}
                >
                    Add a PROTON account below to get started. Only enter your account name. No public or private keys are needed to track your accounts.
                </Text>
                <FormInput 
                    label=""
                    containerStyle={{
                        marginTop: SIZES.radius,
                    }}
                    inputContainerStyle={{
                        paddingHorizontal: SIZES.radius,
                        width: '100%'
                    }}
                    inputStyle={{
                        marginVertical: SIZES.base,
                        ...FONTS.body3
                    }}
                    value={accountName}
                    onChange={(value) => {
                        setAccountName(value);
                    }}
                    placeholder={'PROTON account name'}
                />
                <TextButton
                    label="Add Account"
                    buttonContainerStyle={{
                        height: 55,
                        alignItems: 'center',
                        marginTop: SIZES.padding,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.primary,
                        paddingHorizontal: SIZES.padding,
                        alignSelf: 'center'
                    }}
                    onPress={() => console.log('clicked')}
                />
            </View>
        </View>
    )
}

export default AddAccount