import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

type ConnectionStatusWithRefreshProps = {
    connected: boolean;
    onRefresh?: () => Promise<void>;
};

const ConnectionStatusWithRefresh: React.FC<ConnectionStatusWithRefreshProps> = ({
    connected, 
    onRefresh
}) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshDisabled, setRefreshDisabled] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [isRefreshHovered, setIsRefreshHovered] = useState(false);
    const [isTooltipHovered, setIsTooltipHovered] = useState(false);
    const [refreshTooltip, setRefreshTooltip] = useState('Refresh data');
    const [refreshCooldown, setRefreshCooldown] = useState(0);
    const [showCountdown, setShowCountdown] = useState(false);

    const spinValue = new Animated.Value(0);
    const scaleValue = new Animated.Value(1);

    // Scale animation for press effect
    useEffect(() => {
        Animated.spring(scaleValue, {
            toValue: isPressed ? 0.9 : 1,
            useNativeDriver: true,
            tension: 40,
            friction: 7,
        }).start();
    }, [isPressed]);

    // Continuous rotation animation
    const startSpinAnimation = useCallback(() => {
        spinValue.setValue(0);
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        ).start();
    }, [spinValue]);

    // Handle countdown timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (refreshCooldown > 0) {
            setShowCountdown(true);
            interval = setInterval(() => {
                setRefreshCooldown((prev) => {
                    const newValue = prev - 1;
                    if (newValue <= 0) {
                        setRefreshDisabled(false);
                        setShowCountdown(false);
                        setRefreshTooltip('Refresh data');
                        return 0;
                    }
                    setRefreshTooltip(`Wait ${newValue}s`);
                    return newValue;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [refreshCooldown]);

    // Start spinning when refreshing starts
    useEffect(() => {
        if (isRefreshing) {
            startSpinAnimation();
        } else {
            spinValue.stopAnimation();
            spinValue.setValue(0);
        }
    }, [isRefreshing, startSpinAnimation]);

    const refreshData = async () => {
        if (refreshDisabled || isRefreshing) return;

        setIsRefreshing(true);

        try {
            if (onRefresh) {
                await onRefresh();
                console.log('Data refreshed successfully');
            }

            // Set cooldown
            setRefreshDisabled(true);
            setRefreshCooldown(60*5); // 30 seconds cooldown

        } catch (error) {
            console.error('Failed to refresh data:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const ClockIcon: React.FC<{ color: string }> = ({ color }) => (
        <Svg width="12" height="12" viewBox="0 0 36 36" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 6L12 12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
);

    const RefreshIcon: React.FC<{ color: string }> = ({ color }) => (
        <Svg width="12" height="12" viewBox="0 0 36 36" fill="none">
    <Path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M16 8L20 12L24 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M8 16L4 12L0 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
);

    return (
        <View style={styles.container}>
            <View style={styles.statusContainer}>
                <View style={styles.statusCard}>
                    <View style={[
                        styles.statusDot,
                        { backgroundColor: connected ? '#0FC257' : '#95A0C9' }
                    ]} />
                    <Text style={styles.statusText}>
                        {connected ? 'Connected' : 'Disconnected'}
                    </Text>

                    {/* Refresh Button with Countdown */}
                    <View style={styles.refreshContainer}>
                        <TouchableOpacity
                            style={[
                                styles.refreshButton,
                                {
                                    opacity: refreshDisabled ? 0.6 : 1,
                                    backgroundColor: isPressed ? '#FFFFFF14' : 'transparent',
                                    transform: [{ scale: isPressed ? 0.95 : 1 }],
                                }
                            ]}
                            onPress={refreshData}
                            onPressIn={() => setIsPressed(true)}
                            onPressOut={() => setIsPressed(false)}
                            disabled={refreshDisabled}
                        >
                            <Animated.View 
                                style={[
                                    styles.refreshIconContainer,
                                    { 
                                        transform: [
                                            { rotate: spin },
                                            { scale: scaleValue }
                                        ] 
                                    }
                                ]}
                            >
                                <Image
                                    source={require('../assets/logo/icon_refresh.png')}
                                    style={[
                                        styles.refreshIcon,
                                        { opacity: refreshDisabled ? 0.6 : 1 }
                                    ]}
                                />
                            </Animated.View>
                            {showCountdown && (
                                <Animated.Text style={[
                                    styles.countdownText,
                                    { transform: [{ scale: scaleValue }] }
                                ]}>
                                    {refreshCooldown}s
                                </Animated.Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 0,
        zIndex: 10,
    },
    statusContainer: {
        justifyContent: 'center',
    },
    statusCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF14',
        borderRadius: 20,
        gap: 12,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontWeight: '500',
        fontSize: 16,
        color: 'white',
    },
    refreshContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 4,
    },
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
        padding: 8,
        borderRadius: 50,
        gap: 4,
    },
    refreshIconContainer: {
        width: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    refreshIcon: {
        width: 16,
        height: 16,
        opacity: 1,
    },
    countdownText: {
        color: '#FFFFFF8F',
        fontSize: 12,
        marginLeft: 4,
        minWidth: 26,
        textAlign: 'left',
    },
});

export default ConnectionStatusWithRefresh;