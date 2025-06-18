import {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Button} from '@react-navigation/elements';
import {Image} from 'expo-image';
import {LoginWebView} from "../components/Login/LoginWebView";
import {RegisterWebView} from "../components/Login/RegisterWebView";
import React from "react";
import {tokenStorage} from "../service/storage/tokenStorage";
import {useAuth} from "../service/auth/useAuth";

const Login = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const initRef = useRef(false);

    const { token, isLoadingToken } = useAuth();

    function handleRedirect(linkType: 'auth' | 'register') {
        linkType === 'auth' ? setShowLogin(true) : setShowRegister(true);
    }

    useEffect(() => {
        // Prevent double execution in React Strict Mode
        if (initRef.current) return;
        initRef.current = true;

        console.log('Login component mounted');
    }, []);

    useEffect(() => {
        if (!isLoadingToken && token) {
            setShowLogin(true);
        }
    }, [isLoadingToken, token]);


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
                    <Text style={styles.secondaryButtonText}>Register with Email</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111A26',
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    logo: {
        height: 40,
        width: 100,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: -60,
    },
    button: {
        width: '100%',
        backgroundColor: '#8F4AE3',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    secondaryButton: {
        width: '100%',
        backgroundColor: 'transparent',
        padding: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#8F4AE3',
        alignItems: 'center',
        marginTop: 10,
    },
    secondaryButtonText: {
        color: '#8F4AE3',
        fontWeight: 'bold',
    },
});

export default Login;