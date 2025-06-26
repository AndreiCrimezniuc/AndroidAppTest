import {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Dimensions} from 'react-native';
import {Button} from '@react-navigation/elements';
import {Image} from 'expo-image';
import {LoginWebView} from "../components/Login/LoginWebView";
import {RegisterWebView} from "../components/Login/RegisterWebView";
import React from "react";
import {tokenStorage} from "../service/storage/tokenStorage";
import {useAuth} from "../service/auth/useAuth";

const {width: screenWidth} = Dimensions.get('window');

const Login = () => {
    const { token, isLoadingToken } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const initRef = useRef(false);

    function handleRedirect(linkType: 'auth' | 'register') {
        linkType === 'auth' ? setShowLogin(true) : setShowRegister(true);
    }

    useEffect(() => {
        // Prevent double execution in React Strict Mode
        if (initRef.current) return;
        initRef.current = true;
        console.log('Login component mounted');
    }, []);

    if (showLogin) {
        return (
            <LoginWebView />
        );
    }

    if (showRegister) {
        return (
            <RegisterWebView />
        );
    }

    return (
        <View style={styles.container}>
            <Image source="bg" style={styles.backgroundImage}/>
            <View style={styles.logoContainer}>
                <Image source="logo" style={styles.logo}/>
            </View>
            <View style={styles.buttonContainer}>
                <Button style={styles.button} onPress={() => handleRedirect('auth')}>
                    Login
                </Button>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => handleRedirect('register')}>
                    <Text style={styles.secondaryButtonText}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111A26',
        position: 'relative',
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 56, // Equivalent to mt-14 (14 * 4 = 56)
        zIndex: 10,
    },
    logo: {
        height: 40, // Equivalent to h-10
        width: 100, // Adjust based on your logo aspect ratio
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24, // Equivalent to px-6
        marginTop: -64, // Equivalent to -mt-16 (-16 * 4 = -64)
        zIndex: 10,
    },
    button: {
        width: Math.min(screenWidth * 0.7, 384), // Equivalent to w-[70vw] max-w-md
        backgroundColor: '#8F4AE3',
        paddingVertical: 12, // Equivalent to py-3
        borderRadius: 6, // Equivalent to rounded-md
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '800', // Extra bold
        fontSize: 16,
    },
    secondaryButton: {
        width: Math.min(screenWidth * 0.7, 384), // Equivalent to w-[70vw] max-w-md
        backgroundColor: 'transparent',
        paddingVertical: 12, // Equivalent to py-3
        borderRadius: 6, // Equivalent to rounded-md
        borderWidth: 1,
        borderColor: '#8F4AE3',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20, // Equivalent to mt-5
    },
    secondaryButtonText: {
        color: '#8F4AE3',
        fontWeight: '800', // Extra bold
        fontSize: 16,
    },
});

export default Login;