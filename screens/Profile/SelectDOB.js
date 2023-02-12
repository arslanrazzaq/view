import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    KeyboardAvoidingView,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { Header, IconButton } from '../../components';
import { FONTS, SIZES, COLORS, icons } from '../../constants';
import AnimatedLoader from "react-native-animated-loader";
import { AuthContext } from '../../Context/authContext';
import DatePicker from 'react-native-date-picker';
import axios from 'axios';
import { BASE_URL } from '../../config';

const SelectDOB = ({ navigation, route }) => {

    const [commonError, setCommonError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { userInfo, login } = useContext(AuthContext);
    const [date, setDate] = useState(new Date('1990-01-01'));
    const [photo, setPhoto] = useState([]);

    useEffect(() => {
        if (route.params && route.params.dob) {
            setDate(new Date(route.params.dob));
        }
    }, []);

    const isEnabledSignIn = () => {
        return date != ''
    }

    const getSubtractYears = (date, years) => {
        return date.setFullYear(date.getFullYear() - years);;
    }

    const renderHeader = () => {
        return (
            <Header
                title={route.params.isEdit ? "Birthday" : "Step 2 of 4"}
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
                rightComponent={
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: SIZES.radius,

                        }}
                        onPress={() => handleDescription()}
                        disabled={isEnabledSignIn() ? false : true}
                    >
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: 'center',
                                width: 60,
                                height: 40,
                                borderRadius: SIZES.radius,
                                backgroundColor: isEnabledSignIn() ? COLORS.blue : COLORS.gray
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
                               {route.params.isEdit ? 'Save' : 'Next'}
                            </Text>
                        </View>
                    </TouchableOpacity> 
                }
            />
        )
    }

    const createFormData = (photo, body = {}) => {
        const data = new FormData();
        photo.forEach(elem => {
            data.append('photo', {
                name: 'profile-image',
                type: elem.mime,
                uri: elem.path
            });
        });

        Object.keys(body).forEach((key) => {
            data.append(key, body[key]);
        });

        return data;
    };

    const handleDescription = async () => {
        if (route.params.isEdit) {
            setIsLoading(true);
            try {
                let data = createFormData(photo, {
                    id: userInfo.user.id, 
                    firstName: userInfo.user.firstName, 
                    lastName: userInfo.user.lastName,
                    username: userInfo.user.username,
                    dob: JSON.stringify(date)
                });
            
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': "application/x-www-form-urlencoded",
                        'Accept': 'application/json'
                    },
                };
                const response = await axios.put(`${BASE_URL}/user/update`, data, config);
                setIsLoading(false);
                login(response.data.token, response.data.user);
                // navigation.push('Profile', { user_id: route.params.user_id });
                navigation.push('Home', { screen: 'Home' });
            } catch (error) {
                if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                    setCommonError(error.response.data.msg);
                    setIsLoading(false);
                } else {
                    setCommonError('Unknown Error, Try again later');
                    setIsLoading(false);
                }
            }
        } else {
            navigation.push('SelectNationality', { ...route.params, dob: date });
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : ""}
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
                        color: COLORS.black,
                        ...FONTS.h3,
                        alignSelf: 'center'
                    }}
                >
                   What's your date of birth?
                </Text>
                <View
                    style={{
                        marginTop: SIZES.padding,
                        backgroundColor: COLORS.lightGray2
                    }}
                >
                    <DatePicker 
                        style={{
                            width: Dimensions.get('screen').width - (SIZES.padding * 2)
                        }}
                        textColor={COLORS.black}
                        date={date} 
                        mode='date' 
                        onDateChange={(val) => { setDate(val); }} 
                        maximumDate={new Date(getSubtractYears(new Date(), 13))}
                    />
                </View>
                {   
                    commonError ? 
                        <Text
                            style={{
                                color: COLORS.red,
                                ...FONTS.body4,
                                marginTop: SIZES.base,
                                textAlign: 'center'
                            }}
                        >
                            {commonError}
                        </Text> 
                    : null
                }
            </View>
            <View style={{ height: 50 }} />
        </KeyboardAvoidingView>
    )
}

export default SelectDOB;