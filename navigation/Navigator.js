import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';

import {
    SignIn,
    SignUp,
    ForgotPassword,
    ContactUs,
    AddAccount,
    AddAccountInit,
    Collections,
    Assets,
    Asset,
    VideoPlayer,
    SignInInit,
    DeleteAccount,
    DeleteAccountConfirmation,
    MainLayout,
    ProfileTab,
    Polygon,
    ViewVideo,
    Channels,
    ChannelsInit,
    ViewLiveVideo
} from '../screens';
import { AuthContext } from "../Context/authContext";
import { View, ActivityIndicator } from 'react-native';

const Stack = createStackNavigator();

const Navigator = () => {

    const { isLoadingContext, userInfo } = useContext(AuthContext);

    if (isLoadingContext) {
        return (
            <View 
                style={{ 
                    position: 'absolute', 
                    width: '100%', 
                    height: '100%',
                    zIndex: 3, // works on ios
                    elevation: 3, // works on android
                    backgroundColor: 'rgba(255,255,255,0.75)'
                }}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size={'large'} /> 
                </View>
            </View> 
        )
    }

    return (
        <NavigationContainer>
            { 
                userInfo && userInfo.user && userInfo.user.id ? 
                    <Stack.Navigator
                        screenOptions={{
                            headerShown: false,
                            gestureEnabled: false
                        }}
                        initialRouteName={'home'}
                    >
                        <Stack.Screen
                            name="Home"
                            component={MainLayout}
                        />
                        <Stack.Screen 
                            name="Channels"
                            component={Channels}
                        />
                        <Stack.Screen 
                            name="ChannelsInit"
                            component={ChannelsInit}
                        />
                        <Stack.Screen 
                            name="ViewLiveVideo"
                            component={ViewLiveVideo}
                        />
                        <Stack.Screen 
                            name="ViewVideo"
                            component={ViewVideo}
                        />
                        <Stack.Screen 
                            name="Polygon"
                            component={Polygon}
                        />
                        <Stack.Screen 
                            name="AddAccount"
                            component={AddAccount}
                        />
                        <Stack.Screen 
                            name="AddAccountInit"
                            component={AddAccountInit}
                        />
                        <Stack.Screen
                            name="Collections"
                            component={Collections}
                        />
                        <Stack.Screen
                            name="Assets"
                            component={Assets}
                        />
                        <Stack.Screen 
                            name="Asset"
                            component={Asset}
                        />
                        <Stack.Screen 
                            name="VideoPlayer"
                            component={VideoPlayer}
                        />
                        <Stack.Screen
                            name="ContactUs"
                            component={ContactUs}
                        />
                         <Stack.Screen
                            name="ProfileTab"
                            component={ProfileTab}
                        />
                        <Stack.Screen
                            name="DeleteAccount"
                            component={DeleteAccount}
                        />
                        <Stack.Screen
                            name="DeleteAccountConfirmation"
                            component={DeleteAccountConfirmation}
                        />
                    </Stack.Navigator>
                : 
                    <Stack.Navigator
                        screenOptions={{
                            headerShown: false,
                            gestureEnabled: false
                        }}
                        initialRouteName={'SignInInit'}
                    >
                        <Stack.Screen
                            name="SignInInit"
                            component={SignInInit}
                        /> 
                        <Stack.Screen
                            name="SignIn"
                            component={SignIn}
                        />
                        <Stack.Screen
                            name="SignUp"
                            component={SignUp}
                        />
                        <Stack.Screen
                            name="ForgotPassword"
                            component={ForgotPassword}
                        />
                    </Stack.Navigator>
            }
        </NavigationContainer>
    )
}

export default Navigator