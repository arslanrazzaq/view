import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Dimensions,
    KeyboardAvoidingView,
    TouchableOpacity
} from 'react-native';
import { Header, IconButton } from '../../components';
import { FONTS, SIZES, COLORS, icons } from '../../constants';
import AnimatedLoader from "react-native-animated-loader";
import { AuthContext } from '../../Context/authContext';
import countries from '../../utils/countries';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { BASE_URL } from '../../config';

const SelectNationality = ({ navigation, route }) => {

    const [commonError, setCommonError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { userInfo, login } = useContext(AuthContext);
    const [photo, setPhoto] = useState([]);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [items, setItems] = useState(countries.countries);
    
    useEffect(() => {
        if (route.params && route.params.nationality) {
            setValue(route.params.nationality);
        }
    }, []);

    const isEnabledSignIn = () => {
        return value != ''
    }

    const renderHeader = () => {
        return (
            <Header
                title={route.params.isEdit ? "Nationality" : "Step 3 of 4"}
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
                    nationality: value
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
            navigation.push('EditProfile', { ...route.params, nationality: value });
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
                    }}
                >
                    What is your Nationality?
                </Text>
                {/* <Text
                    style={{
                        color: COLORS.black,
                        ...FONTS.body3,
                        marginTop: SIZES.base
                    }}
                >
                    * Once you select your Nationality,
                </Text>
                <Text
                    style={{
                        color: COLORS.black,
                        ...FONTS.body3
                    }}
                >
                    you cannot change it in the feature
                </Text> */}
                <View
                    style={{
                        flex: 1,
                        marginTop: SIZES.padding,
                    }}
                >
                    <DropDownPicker
                        schema={{
                            label: 'name',
                            value: 'name'
                        }}
                        searchable={true}
                        searchPlaceholder="Search..."
                        dropDownDirection="BOTTOM"
                        listMode="FLATLIST"
                        itemSeparator={true}
                        flatListProps={{
                            initialNumToRender: 20
                        }}
                        closeOnBackPressed={true}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        multiple={false}
                        maxHeight={Dimensions.get('screen').height - 300}
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

export default SelectNationality;