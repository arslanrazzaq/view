import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Dimensions
} from 'react-native';
import { COLORS, SIZES, FONTS, icons } from '../../constants';
import { Header, IconButton } from '../../components';
import { AuthContext } from '../../Context/authContext';

const DailyContestStep2 = ({ navigation, route }) => {

    const { userInfo } = useContext(AuthContext);
    const [commonError, setCommonError] = useState("");
    const [myHeight, setMyHeight] = useState("");

    useEffect(() => {
        if (route.params && route.params.data && route.params.data.myHeight) {
            setMyHeight(route.params.data.myHeight);
        }
    }, []);

    const isEnabledSignIn = () => {
        return myHeight != "" && myHeight.trim().length > 0 && userInfo.user && userInfo.user.id
    }

    const handleUploadPhoto = () => {
        setCommonError("");
        let data = route.params.data;
        data.myHeight = myHeight;
        navigation.navigate("DailyContestStep3", { data: data });
    };

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
                        onPress={() => navigation.navigate('DailyContestStep1', { data: {...route.params.data, myHeight: myHeight}  })}
                    />
                }
                rightComponent={
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: SIZES.radius,
                        }}
                        disabled={isEnabledSignIn() ? false : true}
                        onPress={() => handleUploadPhoto()}
                    >
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: 'center',
                                width: 60,
                                height: 40,
                                borderRadius: SIZES.radius,
                                backgroundColor: isEnabledSignIn() ? COLORS.blue : COLORS.transparentPrimary
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
                {/* <ScrollView
                    style={{
                        flexGrow: 1,
                    }}
                > */}
                    <Text 
                        style={{
                            color: COLORS.black, 
                            ...FONTS.h3
                        }}
                    >
                       [Step 2 of 4]
                    </Text>
                    <Text
                        style={{
                            color: COLORS.black,
                            ...FONTS.h3
                        }}
                    >
                        Where are you going in this outfit? 
                    </Text>
                    <Text style={{ color: COLORS.gray, ...FONTS.body3 }}>
                        (On a date, out for dinner with friends, to a movie, etc)
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
                                //height: Dimensions.get('window').height - 250,
                                marginLeft: SIZES.radius,
                                marginVertical: SIZES.radius,
                                ...FONTS.body3,
                                textAlignVertical: "top"
                            }}
                            maxLength={3000}
                            multiline
                            value={myHeight}
                            onChangeText={(value) => {
                                setMyHeight(value);
                            }}
                            placeholder={`Type here...`}
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
                {/* </ScrollView> */}
            </View>
        </KeyboardAvoidingView>
    )
}

export default DailyContestStep2