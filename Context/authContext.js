import React, { createContext, useEffect, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { InterstitialAd, BannerAd, BannerAdSize, TestIds, AdEventType } from 'react-native-google-mobile-ads';
const adUnitId = TestIds.INTERSTITIAL;
const adUnitIdB = TestIds.BANNER;

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing'],
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({});

    const [isStatusBarHidden, setIsStatusBarHiddenS] = useState(false);
   
    const login = async (token, user) => {
        let userInfoObj = { token, user, isLoggedIn: true }
        setUserInfo(userInfoObj);
        await Keychain.setGenericPassword(token, JSON.stringify(user), { service: 'lh-s-token' });
    };

    const logout = async () => {
        // if (Platform.OS == 'ios') {
        //     await Keychain.setGenericPassword('', '');
        // } else {
            await Keychain.resetGenericPassword({ service: 'lh-s-token' });
        //}
        setUserInfo({});
    };

    const isLoggedIn = async () => {
        try {
            // Retrieve the credentials
            const credentials = await Keychain.getGenericPassword({ service: 'lh-s-token' });
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
        const unsubscribeInterstitialEvents = loadInterstitialAds();
        isLoggedIn();
        return unsubscribeInterstitialEvents;
    }, []);

    const loadInterstitialAds = () => {
        const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
            // setLoaded(true);
        });

        const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
            // setLoaded(false);
            setIsStatusBarHiddenS(false);
            // navigation.push("post", { post_id: selectedPostToGo });

            try {
                interstitial.load();
            } catch (error) {
                interstitial.load();
                console.log('Error here: ', error)
            }
        });

        interstitial.load();

        return () => {
            unsubscribeClosed();
            unsubscribeLoaded();
        }
    }

    return (
        <AuthContext.Provider
            value={{
                userInfo,
                login,
                logout,
                interstitial,
                setIsStatusBarHidden
            }}>
            <StatusBar hidden={isStatusBarHidden} />
            {children}
        </AuthContext.Provider>
    );
};