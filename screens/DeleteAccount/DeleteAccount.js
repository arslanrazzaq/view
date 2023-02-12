import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView
} from 'react-native';
import { Header, IconButton, TextButton } from '../../components';
import { FONTS, SIZES, COLORS, icons } from '../../constants';


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
                { renderHeader() }
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
                        color: COLORS.black,
                        ...FONTS.h2
                    }}
                >
                    Delete My Account
                </Text>
            </View>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center'
                }}
            >
                <View
                    style={{
                        marginHorizontal: SIZES.padding,
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
                        onPress={() => navigation.navigate("Home")}
                    />
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
                        label={'Yes'}
                        onPress={() => navigation.navigate("DeleteAccountConfirmation")}
                    />
                </View>
            </View>
        </View>
    )
}

export default DeleteAccount