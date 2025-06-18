import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

type ConnectionStatusWithRefreshProps = {
    connected: boolean;
};

const ConnectionStatusWithRefresh: React.FC<ConnectionStatusWithRefreshProps> = ({connected}) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshDisabled, setRefreshDisabled] = useState(false);
    const [isRefreshHovered, setIsRefreshHovered] = useState(false);
    const [isTooltipHovered, setIsTooltipHovered] = useState(false);
    const [refreshTooltip, setRefreshTooltip] = useState('Refresh data');
    const [refreshCooldown, setRefreshCooldown] = useState(0);

    const spinValue = new Animated.Value(0);
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (refreshCooldown > 0) {
            interval = setInterval(() => {
                setRefreshCooldown((prev) => {
                    const newValue = prev - 1;
                    if (newValue <= 0) {
                        setRefreshDisabled(false);
                        setRefreshTooltip('Refresh data');
                        return 0;
                    }
                    setRefreshTooltip(`Wait ${newValue}s`);
                    return newValue;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [refreshCooldown]);

    const startSpinAnimation = () => {
        spinValue.setValue(0);
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        ).start();
    };

    const stopSpinAnimation = () => {
        spinValue.stopAnimation();
    };

    const showTooltip = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const hideTooltip = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const refreshData = async () => {
        if (refreshDisabled || isRefreshing) return;

        setIsRefreshing(true);
        startSpinAnimation();

        try {
            // Replace with your actual refresh logic
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simulate data refresh
            console.log('Data refreshed successfully');

            // Set cooldown
            setRefreshDisabled(true);
            setRefreshCooldown(30); // 30 seconds cooldown

        } catch (error) {
            console.error('Failed to refresh data:', error);
        } finally {
            setIsRefreshing(false);
            stopSpinAnimation();
        }
    };

    const shouldShowTooltip = (): boolean => {
        return isRefreshHovered || isTooltipHovered;
    };

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const ClockIcon: React.FC<{ color: string }> = ({ color }) => (
        <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 6L12 12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
);

    const RefreshIcon: React.FC<{ color: string }> = ({ color }) => (
        <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M16 8L20 12L24 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M8 16L4 12L0 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
);

    return (
        <View style={styles.container}>
            {/* Connected status */}
            <View style={styles.statusContainer}>
    <View style={styles.statusCard}>
    <View style={[
            styles.statusDot,
    { backgroundColor: connected ? '#0FC257' : '#95A0C9' }
]} />
    <Text style={styles.statusText}>
        {connected ? 'Connected' : 'Disconnected'}
        </Text>

    {/* Refresh Button */}
    <View style={styles.refreshContainer}>
    <TouchableOpacity
        style={[
            styles.refreshButton,
    {
        opacity: refreshDisabled ? 0.6 : 1,
            backgroundColor: refreshDisabled ? '#3F3B63' : 'transparent',
    }
]}
    onPress={refreshData}
    disabled={refreshDisabled}
    onPressIn={() => setIsRefreshHovered(true)}
    onPressOut={() => setIsRefreshHovered(false)}
>
    <Animated.View style={{ transform: [{ rotate: isRefreshing ? spin : '0deg' }] }}>
    <Image
        source={require('../assets/logo/refresh.png')}
    style={[
            styles.refreshIcon,
    { opacity: refreshDisabled ? 0.6 : 1 }
]}
    />
    </Animated.View>
    </TouchableOpacity>

    {/* Tooltip */}
    {shouldShowTooltip() && (
        <Animated.View
            style={[
                styles.tooltip,
        {
            opacity: fadeAnim,
                backgroundColor: refreshDisabled ? '#1D293B' : '#1A2233',
            borderColor: refreshDisabled ? '#8F4AE3' : '#6CE7E4',
        }
    ]}
        onTouchStart={() => setIsTooltipHovered(true)}
        onTouchEnd={() => setIsTooltipHovered(false)}
    >
        <View style={styles.tooltipContent}>
            {refreshDisabled ? (
                    <>
                        <ClockIcon color="#8F4AE3" />
                    <Text style={styles.tooltipText}>{refreshTooltip}</Text>
                        </>
                ) : (
                    <>
                        <RefreshIcon color="#6CE7E4" />
                    <Text style={styles.tooltipText}>{refreshTooltip}</Text>
                        </>
                )}
            </View>
            </Animated.View>
    )}
    </View>
    </View>
    </View>
    </View>
);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40,
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
    },
    refreshButton: {
        marginLeft: 8,
        padding: 6,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    refreshIcon: {
        width: 16,
        height: 16,
    },
    tooltip: {
        position: 'absolute',
        top: 0,
        left: '100%',
        marginLeft: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 50,
    },
    tooltipContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    tooltipText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
});

export default ConnectionStatusWithRefresh;