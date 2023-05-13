import React, { useEffect, useState, useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';

import {
    SignIn,
    SignUp,
    ForgotPassword,
    // Otp,
    // DelAccount,
    // Faq,
    // Profile,
    // Paypal,
    // Legal,
    ContactUs, 
    Home,
    AddAccount,
    AddAccountInit,
    Collections,
    Assets,
    Asset,
    VideoPlayer,
    // PostReport,
    // Post,
    // PostComReply,
    // Search,
    SignInInit,
    // SelectGender,
    // SelectDOB,
    // SelectNationality,
    // EditProfile,
    // DeleteAccount,
    // DeleteAccountConfirmation,
    ChangePassword,
    // DailyContest,
    // DailyContestStep1,
    // DailyContestStep2,
    // DailyContestStep3,
    // DailyContestInit,
    // DailyContestChoosePhotos,
    MainLayout,
    ProfileTab,
    Polygon
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
                            component={Home}
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
                
                        
            
                        {/* <Stack.Screen
                            name="ChangePassword"
                            component={ChangePassword}
                        /> */}
                        {/* <Stack.Screen 
                            name="DailyContestChoosePhotos"
                            component={DailyContestChoosePhotos}
                        />
                        <Stack.Screen 
                            name="DailyContestStep1"
                            component={DailyContestStep1}
                        />
                        <Stack.Screen 
                            name="DailyContestStep2"
                            component={DailyContestStep2}
                        />
                        <Stack.Screen 
                            name="DailyContestStep3"
                            component={DailyContestStep3}
                        />
                        <Stack.Screen 
                            name="DailyContestInit"
                            component={DailyContestInit}
                        />  
                        <Stack.Screen
                            name="Paypal"
                            component={Paypal}
                        />
                        <Stack.Screen
                            name="Legal"
                            component={Legal}
                        />
                        <Stack.Screen
                            name="PostReport"
                            component={PostReport}
                        />
                        <Stack.Screen
                            name="post"
                            component={Post}
                        />
                        <Stack.Screen
                            name="PostComReply"
                            component={PostComReply}
                        />
                        <Stack.Screen
                            name="Search"
                            component={Search}
                        /> 
                        <Stack.Screen
                            name="Faq"
                            component={Faq}
                        />
                        <Stack.Screen
                            name="DeleteAccount"
                            component={DeleteAccount}
                        />
                        <Stack.Screen
                            name="DelAccount"
                            component={DelAccount}
                        />
                        <Stack.Screen
                            name="DeleteAccountConfirmation"
                            component={DeleteAccountConfirmation}
                        />
                        <Stack.Screen
                            name="Profile"
                            component={Profile}
                        />
                        <Stack.Screen
                            name="SelectGender"
                            component={SelectGender}
                        />
                        <Stack.Screen
                            name="SelectDOB"
                            component={SelectDOB}
                        />
                        <Stack.Screen
                            name="SelectNationality"
                            component={SelectNationality}
                        />
                        <Stack.Screen
                            name="EditProfile"
                            component={EditProfile}
                        />
                        <Stack.Screen
                            name="Otp"
                            component={Otp}
                        /> */}
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