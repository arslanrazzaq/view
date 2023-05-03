import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    SafeAreaView,
    Modal
} from 'react-native';
import { COLORS, SIZES, FONTS, icons, constants } from '../constants';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { connect } from 'react-redux';
import { setSelectedTab } from '../stores/tab/tabActions';
import {
    Home,
    Winners,
    ProfileTab
} from '../screens';
import { Header, TextButton } from '../components';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../Context/authContext';
// import AnimatedLoader from "react-native-animated-loader";
import axios from 'axios';
import { BASE_URL } from '../config';


const TabButton = ({ label, icon, isFocused, onPress, outerContainerStyle, innerContainerStyle }) => {
    return (
        <TouchableWithoutFeedback
            onPress={onPress}
        >
            <Animated.View
                style={[
                    {
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    },
                    outerContainerStyle
                ]}
            >
                <Animated.View
                    style={[
                        {
                            flexDirection: 'row',
                            width: '80%',
                            height: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 25,
                        },
                        innerContainerStyle
                    ]}
                >
                    <Icon
                        name={icon}
                        size={24}
                        color={isFocused ? COLORS.white : COLORS.black}
                    />
                </Animated.View>
            </Animated.View>
        </TouchableWithoutFeedback>
    )
}

const MainLayout = ({ drawerAnimationStyle, navigation, route, selectedTab, setSelectedTab }) => {

    const flatListRef = React.useRef();

    const homeTabFlex = useSharedValue(1);
    const homeTabColor = useSharedValue(COLORS.white);
    const searchTabFlex = useSharedValue(1);
    const searchTabColor = useSharedValue(COLORS.white);
    const cartTabFlex = useSharedValue(1);
    const cartTabColor = useSharedValue(COLORS.white);
    const userTabFlex = useSharedValue(1);
    const userTabColor = useSharedValue(COLORS.white);
    const notificationTabFlex = useSharedValue(1);
    const notificationTabColor = useSharedValue(COLORS.white);
    const { userInfo } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [commonError, setCommonError] = useState(false);


    const homeFlexStyle = useAnimatedStyle(() => {
        return {
            flex: homeTabFlex.value
        }
    });

    const homeColorStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: homeTabColor.value
        }
    });

    const searchFlexStyle = useAnimatedStyle(() => {
        return {
            flex: searchTabFlex.value
        }
    });

    const searchColorStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: searchTabColor.value
        }
    });

    const cartFlexStyle = useAnimatedStyle(() => {
        return {
            flex: cartTabFlex.value
        }
    });

    const cartColorStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: cartTabColor.value
        }
    });

    const userFlexStyle = useAnimatedStyle(() => {
        return {
            flex: userTabFlex.value
        }
    });

    const userColorStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: userTabColor.value
        }
    });

    const notificationFlexStyle = useAnimatedStyle(() => {
        return {
            flex: notificationTabFlex.value
        }
    });

    const notificationColorStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: notificationTabColor.value
        }
    });

    React.useEffect(() => {
        console.log(navigation)
        if (route?.params?.screen) {
            handleSelectTab(route.params.screen);
        } else {
            handleSelectTab(selectedTab);
        }
    }, [])

    const handleSelectTab = (tab) => {
        setSelectedTab(tab);
        if (tab == constants.screens.home) {
            flatListRef?.current?.scrollToIndex({
                index: 0,
                animated: false
            })
            homeTabFlex.value = withTiming(1, { duration: 500 })
            homeTabColor.value = withTiming(COLORS.primary, { duration: 500 })
        } else {
            homeTabFlex.value = withTiming(1, { duration: 500 })
            homeTabColor.value = withTiming(COLORS.white, { duration: 500 })
        }
        if (tab == constants.screens.search) {
            flatListRef?.current?.scrollToIndex({
                index: 1,
                animated: false
            })
            searchTabFlex.value = withTiming(1, { duration: 500 })
            searchTabColor.value = withTiming(COLORS.primary, { duration: 500 })
        } else {
            searchTabFlex.value = withTiming(1, { duration: 500 })
            searchTabColor.value = withTiming(COLORS.white, { duration: 500 })
        }
        if (tab == constants.screens.cart) {
            flatListRef?.current?.scrollToIndex({
                index: 2,
                animated: false
            })
            cartTabFlex.value = withTiming(1, { duration: 500 })
            cartTabColor.value = withTiming(COLORS.primary, { duration: 500 })
        } else {
            cartTabFlex.value = withTiming(1, { duration: 500 })
            cartTabColor.value = withTiming(COLORS.white, { duration: 500 })
        }
        if (tab == 'ProfileTab') {
            flatListRef?.current?.scrollToIndex({
                index: 3,
                animated: false
            })
            userTabFlex.value = withTiming(1, { duration: 500 })
            userTabColor.value = withTiming(COLORS.primary, { duration: 500 })
        } else {
            userTabFlex.value = withTiming(1, { duration: 500 })
            userTabColor.value = withTiming(COLORS.white, { duration: 500 })
        }
        if (tab == constants.screens.notification) {
            flatListRef?.current?.scrollToIndex({
                index: 4,
                animated: false
            })
            notificationTabFlex.value = withTiming(1, { duration: 500 })
            notificationTabColor.value = withTiming(COLORS.primary, { duration: 500 })
        } else {
            notificationTabFlex.value = withTiming(1, { duration: 500 })
            notificationTabColor.value = withTiming(COLORS.white, { duration: 500 })
        }
    }

    return (
        <Animated.View
            style={{
                flex: 1,
                backgroundColor: COLORS.white,
                ...drawerAnimationStyle
            }}
        >

            <SafeAreaView style={{ backgroundColor: COLORS.white }}>
                <Header
                    containerStyle={{
                        height: 50,
                        paddingHorizontal: SIZES.padding,
                        marginTop: 0,
                        alignItems: 'center'
                    }}
                    title={selectedTab.toUpperCase()}
                    leftComponent={
                        <TouchableOpacity
                            style={{
                                width: 50,
                                height: 40,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: COLORS.black,
                                borderRadius: SIZES.radius
                            }}
                            onPress={() => navigation.openDrawer()}
                        >
                            <Icon
                                name={'menu-fold'}
                                size={28}
                                color={COLORS.black}
                            />
                        </TouchableOpacity>
                    }
                    rightComponent={
                        !userInfo.token ? <TouchableOpacity
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: SIZES.radius
                            }}
                            onPress={() => navigation.navigate("SignInInit")}
                        >
                            <View
                                style={{
                                    alignItems: "center",
                                    justifyContent: 'center',
                                    width: 60,
                                    height: 40,
                                    borderWidth: 1,
                                    borderColor: COLORS.gray2,
                                    borderRadius: SIZES.radius,
                                }}
                            >
                                <Text
                                    style={{
                                        borderRadius: SIZES.radius,
                                        ...FONTS.body4,
                                        fontSize: 17,
                                        color: COLORS.darkGray,
                                    }}
                                >
                                    Login
                                </Text>
                            </View>
                        </TouchableOpacity> : null
                    }
                />
            </SafeAreaView>

            <View
                style={{
                    flex: 1
                }}
            >
                <View
                    style={{
                        height: SIZES.height,
                        width: SIZES.width
                    }}
                >
                    {selectedTab == 'Home' ? <Home navigation={navigation} /> : null}
                </View>
            </View>
        </Animated.View>
    )
}

function mapStateToProps(state) {
    return {
        selectedTab: state.tabReducer.selectedTab
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setSelectedTab: (selectedTab) => {
            return dispatch(setSelectedTab(selectedTab))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);