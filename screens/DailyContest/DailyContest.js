import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView
} from 'react-native';
import { COLORS, SIZES, FONTS, icons } from '../../constants';
import { Header, IconButton } from '../../components';
import AnimatedLoader from "react-native-animated-loader";
import { AuthContext } from '../../Context/authContext';

const DailyContest = ({ navigation, route }) => {

    const { userInfo } = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);
    const [commonError, setCommonError] = useState("");

    const [stylingTips, setStylingTips] = useState("");


    useEffect(() => {
        if (route.params && route.params.data) {
            setStylingTips(route.params.data.styling_tips || '');
        }
    }, []);

    function renderHeader() {
        return (
            <Header
                title="OOTD Challenge"
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
                        onPress={() => { navigation.navigate('DailyContestStep3', { data: { ...route.params.data, styling_tips: stylingTips } }); }}
                    />
                }
                rightComponent={
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: SIZES.radius,
                        }}
                        onPress={() => { navigation.navigate('DailyContestInit', { data: { ...route.params.data, styling_tips: stylingTips } }); }}
                    >
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: 'center',
                                width: 60,
                                height: 40,
                                borderRadius: SIZES.radius,
                                backgroundColor: COLORS.blue
                            }}
                        >
                            <Text
                                style={{
                                    borderRadius: SIZES.radius,
                                    ...FONTS.body4,
                                    fontSize: 17,
                                    color: COLORS.white,
                                }}
                            >
                                Next
                            </Text>
                        </View>
                    </TouchableOpacity>
                }
            />
        )
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : ""}
            style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}
        >
            <SafeAreaView style={{ backgroundColor: COLORS.white }}>
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
                    flex: 1
                }}
            >
                <Text
                    style={{
                        color: COLORS.black,
                        ...FONTS.h3
                    }}
                >
                    [Step 4 of 4]
                </Text>
                <Text
                    style={{
                        color: COLORS.black,
                        ...FONTS.h3
                    }}
                >
                    Please share your styling tips
                </Text>
                <Text style={{ color: COLORS.gray, ...FONTS.body3 }}>
                    (optional)
                </Text>
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: SIZES.radius,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.lightGray2,
                        marginTop: SIZES.base,
                    }}
                >
                    <TextInput
                        style={{
                            marginLeft: SIZES.radius,
                            marginVertical: SIZES.radius,
                            ...FONTS.body3,
                            textAlignVertical: "top"
                        }}
                        maxLength={3000}
                        multiline
                        value={stylingTips}
                        onChangeText={(value) => {
                            setStylingTips(value);
                        }}
                        placeholder={'Type here...'}
                    />
                </View>
                <View
                    style={{
                        marginTop: SIZES.radius
                    }}
                >
                    {commonError ? <Text
                        style={{
                            color: COLORS.red,
                            ...FONTS.h3,
                            textAlign: 'center'
                        }}
                    >
                        {commonError}
                    </Text> : null
                    }
                </View>
                <View style={{ height: 50 }} />
            </View>
        </KeyboardAvoidingView>
    )
}

export default DailyContest