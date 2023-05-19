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
    ViewVideo
} from '../screens';
import { Header, TextButton } from '../components';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../Context/authContext';


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
                    { isFocused && <Text
                            numberOfLines={1}
                            style={{ 
                                marginLeft: SIZES.base,
                                color: COLORS.white,
                                ...FONTS.h3
                            }}
                        >
                        {label}    
                    </Text>}
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
        if (tab == 'ViewVideo') {
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
                    {selectedTab == 'ViewVideo' ? <ViewVideo navigation={navigation} /> : null}
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
                    {/* <TabButton
                        label={'Search'}
                        icon={'search1'}
                        outerContainerStyle={notificationFlexStyle}
                        innerContainerStyle={notificationColorStyle}
                        isFocused={selectedTab == 'search'}
                        onPress={() => {
                            navigation.navigate("Search");
                        }}
                    /> */}
                    {/* <TabButton
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
                    /> */}
                    {/* <TabButton
                        label={constants.screens.cart}
                        icon={'Trophy'}
                        outerContainerStyle={cartFlexStyle}
                        innerContainerStyle={cartColorStyle}
                        isFocused={selectedTab == constants.screens.cart}
                        onPress={() => handleSelectTab(constants.screens.cart)}
                    /> */}
                    <TabButton
                        label={'View'}
                        icon={'youtube'}
                        outerContainerStyle={userFlexStyle}
                        innerContainerStyle={userColorStyle}
                        isFocused={selectedTab == 'ViewVideo'}
                        onPress={() => handleSelectTab('ViewVideo')}
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