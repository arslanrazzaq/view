import React, { createContext, useEffect, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import * as Keychain from 'react-native-keychain';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [userInfo, setUserInfo] = useState({});
    const [isStatusBarHidden, setIsStatusBarHiddenS] = useState(false);
    const [isLoadingContext, setIsLoadingContext] = useState(false);
   
    const login = async (token, user) => {
        setIsLoadingContext(true);
        let userInfoObj = { token, user, isLoggedIn: true }
        setUserInfo(userInfoObj);
        await Keychain.setGenericPassword(token, JSON.stringify(user), { service: 'view-s-token' });
        setIsLoadingContext(false);
    };

    const logout = async (navigation) => {
        setIsLoadingContext(true);
        // if (Platform.OS == 'ios') {
        //     await Keychain.setGenericPassword('', '');
        // } else {
            await Keychain.resetGenericPassword({ service: 'view-s-token' });
            //navigation.push('SignInInit');
        //}
        setUserInfo({});
        setIsLoadingContext(false);
    };

    const isLoggedIn = async () => {
        try {
            // Retrieve the credentials
            setIsLoadingContext(true);
            const credentials = await Keychain.getGenericPassword({ service: 'view-s-token' });
            if (credentials && credentials.username && credentials.password) {
                let reCredentials = { token: credentials.username, user: JSON.parse(credentials.password), isLoggedIn: true };
                setUserInfo(reCredentials);
                setIsLoadingContext(false);
            } else {
                setUserInfo({ token: null, user: {}, isLoggedIn: false });
                setIsLoadingContext(false);
            }
        } catch (error) {
            setUserInfo({ token: null, user: {}, isLoggedIn: false });
            setIsLoadingContext(false);
        }
    };

    const setIsStatusBarHidden = (val) => {
        setIsStatusBarHiddenS(val);
    }

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                userInfo,
                login,
                logout,
                isLoadingContext,
                setIsStatusBarHidden
            }}>
            <StatusBar hidden={isStatusBarHidden} />
            {children}
        </AuthContext.Provider>
    );
};