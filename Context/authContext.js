import React, { createContext, useEffect, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import * as Keychain from 'react-native-keychain';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({});

    const [isStatusBarHidden, setIsStatusBarHiddenS] = useState(false);
   
    const login = async (token, user) => {
        let userInfoObj = { token, user, isLoggedIn: true }
        setUserInfo(userInfoObj);
        await Keychain.setGenericPassword(token, JSON.stringify(user), { service: 'view-s-token' });
    };

    const logout = async (navigation) => {
        // if (Platform.OS == 'ios') {
        //     await Keychain.setGenericPassword('', '');
        // } else {
            await Keychain.resetGenericPassword({ service: 'view-s-token' });
            navigation.push('SignInInit');
        //}
        setUserInfo({});
    };

    const isLoggedIn = async () => {
        try {
            // Retrieve the credentials
            const credentials = await Keychain.getGenericPassword({ service: 'view-s-token' });
            if (credentials && credentials.username && credentials.password) {
                let reCredentials = { token: credentials.username, user: JSON.parse(credentials.password), isLoggedIn: true };
                setUserInfo(reCredentials);
            } else {
                setUserInfo({ token: null, user: {}, isLoggedIn: false });
            }
        } catch (error) {
            setUserInfo({ token: null, user: {}, isLoggedIn: false });
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
                setIsStatusBarHidden
            }}>
            <StatusBar hidden={isStatusBarHidden} />
            {children}
        </AuthContext.Provider>
    );
};