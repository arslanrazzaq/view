import React, { useEffect, useState, useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
// import { AuthContext } from "../Context/authContext";

import {
    // SignIn,
    // SignUp,
    // ForgotPassword,
    // Otp,
    // DelAccount,
    // Faq,
    // Profile,
    // Paypal,
    // Legal,
    ContactUs,
    // PostReport,
    // Post,
    // PostComReply,
    // Search,
    // SignInInit,
    // SelectGender,
    // SelectDOB,
    // SelectNationality,
    // EditProfile,
    // DeleteAccount,
    // DeleteAccountConfirmation,
    // ChangePassword,
    // DailyContest,
    // DailyContestStep1,
    // DailyContestStep2,
    // DailyContestStep3,
    // DailyContestInit,
    // DailyContestChoosePhotos,
    // MainLayout
} from '../screens';

const Stack = createStackNavigator();

const Navigator = () => {

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: false
                }}
                initialRouteName={'ContactUs'}
            >
                {/* <Stack.Screen
                    name="Home"
                    component={MainLayout}
                />
                <Stack.Screen 
                    name="DailyContest"
                    component={DailyContest}
                />
                <Stack.Screen 
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
                /> */}
                <Stack.Screen
                    name="ContactUs"
                    component={ContactUs}
                />
                {/* <Stack.Screen
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
                    name="ChangePassword"
                    component={ChangePassword}
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
                <Stack.Screen
                    name="Otp"
                    component={Otp}
                /> */}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigator