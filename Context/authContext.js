import React, { createContext, useEffect, useState, useMemo } from 'react';
import { Platform, StatusBar } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { Web3Modal, useWeb3Modal } from '@web3modal/react-native';
import { ethers } from 'ethers';

const projectId = '140577ad27b8d39b4c4048984391e380';

const providerMetadata = {
  name: 'View',
  description: 'Cultural DApp',
  url: 'https://walletconnect.com/',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [userInfo, setUserInfo] = useState({});
    const [isStatusBarHidden, setIsStatusBarHiddenS] = useState(false);
    const [isLoadingContext, setIsLoadingContext] = useState(false);

    const web3Provider = useMemo(
        () => (provider ? new ethers.providers.Web3Provider(provider) : undefined),
        [provider]
    );

    const { isConnected, provider } = useWeb3Modal();
   
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
        await provider.abortPairingAttempt();
        await provider.disconnect();
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
            } else if (isConnected) {
                console.log('here: ', isConnected);
                const signer = web3Provider.getSigner();
                const address = await signer.getAddress();
                let reCredentials = { token: 'WalletConnect', user: { id: address }, isLoggedIn: true };
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
            <Web3Modal projectId={projectId} providerMetadata={providerMetadata} />
            {children}
        </AuthContext.Provider>
    );
};