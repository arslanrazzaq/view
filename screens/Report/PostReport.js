import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    SafeAreaView,
    StyleSheet
} from 'react-native';
import { Header, IconButton, TextButton } from '../../components';
import { FONTS, SIZES, COLORS, icons } from '../../constants';
import AnimatedLoader from "react-native-animated-loader";
import axios from 'axios';
import { AuthContext } from '../../Context/authContext';
import { BASE_URL } from '../../config';

const PostReport = ({ navigation, route }) => {

    const [reason, setReason] = useState("");
    const [reasonError, setReasonError] = useState("");
    const [commonError, setCommonError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { userInfo } = useContext(AuthContext);

    const isEnabledSignIn = () => {
        return reason != "" && reasonError == ""
    }

    const renderHeader = () => {
        return (
            <Header
                title="Report"
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

    const handleReportPost = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${BASE_URL}/report/post/create`, {
                reason: `${route.params.reported_username} ${reason}`,
                post_id: route.params.post_id,
                user_id: route.params.user_id || userInfo?.user?.id
            });
            setIsLoading(false);
            navigation.goBack();
        } catch (error) {
            if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                setCommonError(error.response.data.msg);
                setIsLoading(false);
            } else {
                setCommonError('Unknown Error, Try again later');
                setIsLoading(false);
            }
        }
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}
        >
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
                <Text
                    style={{
                        color: COLORS.gray,
                        ...FONTS.body3
                    }}
                >
                    Please tell us why you want to report this one.  
                </Text>
                <View
                    style={{
                        height: 200,
                        paddingHorizontal: SIZES.radius,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.lightGray2,
                        marginTop: SIZES.padding,
                    }}
                >
                    <Text
                        style={{
                            marginTop: SIZES.radius,
                            marginLeft: SIZES.radius,
                            textAlignVertical: 'top',
                            ...FONTS.body3
                        }}
                    >
                        {`${route.params.reported_username}`}
                    </Text>
                    <TextInput
                        style={{
                            flex: 1,
                            marginLeft: SIZES.radius,
                            marginVertical: SIZES.radius,
                            ...FONTS.body3,
                            textAlignVertical: "top"
                        }}
                        multiline
                        maxLength={3000}
                        onChangeText={(value) => {
                            setReason(value);
                        }}
                        placeholder={'Type here...'}
                    />
                </View>
                <TextButton
                    label="Submit"
                    disabled={isEnabledSignIn() ? false : true}
                    buttonContainerStyle={{
                        height: 55,
                        alignItems: 'center',
                        marginTop: SIZES.padding,
                        borderRadius: SIZES.radius,
                        backgroundColor: isEnabledSignIn() ? COLORS.primary : COLORS.transparentPrimary
                    }}
                    onPress={() => handleReportPost()}
                />
                {commonError ? <Text
                    style={{
                        color: COLORS.red,
                        ...FONTS.body4,
                        marginTop: SIZES.base,
                        textAlign: 'center'
                    }}
                >
                    {commonError}
                </Text> : null
                }
            </View>
        </View>
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

export default PostReport