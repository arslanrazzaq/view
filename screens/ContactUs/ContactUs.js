import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ImageBackground
} from 'react-native';
import { Header, IconButton } from '../../components';
import { FONTS, SIZES, COLORS, icons, images } from '../../constants';


const ContactUs = ({ navigation }) => {

    const renderHeader = () => {
        return (
            <Header
                title="Contact Us"
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
                { renderHeader() }
            </SafeAreaView>
            <View
                style={{
                    marginHorizontal: SIZES.padding,
                    marginTop: SIZES.radius,
                    borderRadius: SIZES.radius,
                    flex: 1
                }}
            >
                <Text
                    style={{
                        color: COLORS.white,
                        ...FONTS.body2,
                        paddingBottom: SIZES.radius
                    }}
                >
                    Contact Us
                </Text>
                <Text
                    style={{
                        color: COLORS.white,
                        ...FONTS.body3
                    }}
                >
                    admin@solidcircle.tech
                </Text>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    cartItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SIZES.radius,
        paddingHorizontal: SIZES.radius,
        borderRadius: SIZES.radius
    }
})

export default ContactUs