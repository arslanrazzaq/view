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
import AnimatedLoader from "react-native-animated-loader";
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
    const [errorModelTwice, setErrorModelTwice] = useState(false);


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

    const checkAbleToPost = () => {
        setCommonError('');
        setIsLoading(true);
        axios.post(`${BASE_URL}/post/create/check`, { user_id: userInfo.user.id })
            .then(response => {
                setIsLoading(false);
                navigation.push("DailyContestStep1");
            })
            .catch(error => {
                if (error.response && error.response.status && (error.response.status === 404 || error.response.status === 400 || error.response.status === 401 || error.response.status === 500)) {
                    if (error.response.status === 401) {
                        setErrorModelTwice(true);
                    }
                    setCommonError(error.response.data.msg);
                    setIsLoading(false);
                } else {
                    setCommonError('Unknown Error, Try again later');
                    setIsLoading(false);
                }
            });
    }

    function renderErrorModalTwice() {

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={errorModelTwice}
            >
                <TouchableWithoutFeedback
                    onPress={() => setErrorModelTwice(false)}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)'
                        }}
                    >
                        <View
                            style={{
                                // height: 400,
                                width: SIZES.width * 0.8,
                                backgroundColor: COLORS.white,
                                borderRadius: SIZES.radius,
                                paddingBottom: SIZES.padding,
                                paddingHorizontal: SIZES.radius
                            }}
                        >
                            <Text
                                style={{ ...FONTS.h3, color: COLORS.black, paddingTop: SIZES.padding, paddingBottom: SIZES.radius, alignSelf: 'center' }}
                            >
                                {`${commonError}`}
                            </Text>
                            <Text
                                style={{ ...FONTS.h3, color: COLORS.black, paddingBottom: SIZES.padding, alignSelf: 'center' }}
                            >
                                {`Please try again when today’s OOTD Challenge ends.`}
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center'
                                }}
                            >
                                <TextButton
                                    buttonContainerStyle={{
                                        height: 40,
                                        width: 100,
                                        borderRadius: SIZES.radius,
                                        backgroundColor: COLORS.blue
                                    }}
                                    labelStyle={{
                                        color: COLORS.white,
                                        ...FONTS.h4
                                    }}
                                    label={'Close'}
                                    onPress={() => setErrorModelTwice(false)}
                                />
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
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
                {/* <Header
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
                /> */}
            </SafeAreaView>
            { errorModelTwice ? renderErrorModalTwice() : null }
            <AnimatedLoader
                visible={isLoading}
                overlayColor="rgba(255,255,255,0.75)"
                source={require("../constants/loader.json")}
                animationStyle={{
                    width: 300,
                    height: 300
                }}
                speed={1}
            />
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
                    {selectedTab == 'Winners' ? <Winners navigation={navigation} /> : null}
                    {selectedTab == 'ProfileTab' ? <ProfileTab navigation={navigation} /> : null}
                </View>
            </View>
            <View
                style={{
                    height: 60,
                    justifyContent: 'flex-end',
                }}
            >
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 4 }}
                    colors={[
                        COLORS.transparent,
                        COLORS.lightGray1
                    ]}
                    style={{
                        position: 'absolute',
                        top: -20,
                        left: 0,
                        right: 0,
                        height: 60,
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15
                    }}
                />
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        paddingHorizontal: SIZES.radius,
                        paddingTop: 10,
                        paddingBottom: 10,
                        // borderTopLeftRadius: 20,
                        // borderTopRightRadius: 20,
                        backgroundColor: COLORS.white,
                        borderTopWidth: 2,
                        borderTopColor: COLORS.lightGray1
                    }}
                >
                    <TabButton
                        label={constants.screens.home}
                        icon={'home'}
                        isFocused={selectedTab == constants.screens.home}
                        outerContainerStyle={homeFlexStyle}
                        innerContainerStyle={homeColorStyle}
                        onPress={() => handleSelectTab(constants.screens.home)}
                    />
                    <TabButton
                        label={'Search'}
                        icon={'search1'}
                        outerContainerStyle={notificationFlexStyle}
                        innerContainerStyle={notificationColorStyle}
                        isFocused={selectedTab == 'search'}
                        onPress={() => {
                            navigation.navigate("Search");
                        }}
                    />
                    <TabButton
                        label={constants.screens.search}
                        icon={'plus'}
                        outerContainerStyle={searchFlexStyle}
                        innerContainerStyle={searchColorStyle}
                        isFocused={selectedTab == constants.screens.search}
                        onPress={() => {
                            if (userInfo && userInfo.user && userInfo.user.id) {
                                checkAbleToPost();
                            } else {
                                navigation.navigate("SignInInit");
                            }
                        }}
                    />
                    <TabButton
                        label={constants.screens.cart}
                        icon={'Trophy'}
                        outerContainerStyle={cartFlexStyle}
                        innerContainerStyle={cartColorStyle}
                        isFocused={selectedTab == constants.screens.cart}
                        onPress={() => handleSelectTab(constants.screens.cart)}
                    />
                    <TabButton
                        label={'ProfileTab'}
                        icon={'user'}
                        outerContainerStyle={userFlexStyle}
                        innerContainerStyle={userColorStyle}
                        isFocused={selectedTab == 'ProfileTab'}
                        onPress={() => handleSelectTab('ProfileTab')}
                    />
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