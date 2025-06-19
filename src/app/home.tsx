import React, {useCallback, useEffect, useMemo, useState} from 'react';
import numeral from 'numeral';
import {Alert, Image, ImageStyle, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Button from '../components/Buttons/Button';
import SecondaryButton from '../components/Buttons/SecondaryButton';
import {getLibVersion, startSDK} from "../service/sdk/sdk_service";
import {useFocusEffect} from "@react-navigation/native";
import {DASHBOARD_SERVICE_URL, DASHBOARD_URL, KEYCLOAK_REGISTRATION_URL, REFERRAL_SERVICE_URL} from "../service/links";
import {ReferralInfo, ReferralService} from "../service/referral/referral";
import {DashboardService, Earnings} from "../service/dashboard/dashboard";
import DailyBoostClaim from "../components/Buttons/DailyBoost";
import ConnectionStatusWithRefresh from "../components/ConnectionStatus";
import Clipboard from '@react-native-clipboard/clipboard';
import {useAuth} from "../service/auth/useAuth";

const useEarnings = (token: string | null) => {
    const [earnings, setEarnings] = useState<Earnings | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEarnings = useCallback(async () => {
        if (!token) return;

        setIsLoading(true);
        setError(null);

        try {
            const dashboardService = new DashboardService(DASHBOARD_SERVICE_URL, token);
            const earningsData = await dashboardService.getEarnings();
            console.log("Earnings fetched successfully");
            setEarnings(earningsData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch earnings';
            console.error("Error fetching earnings:", err);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    // Auto-fetch every 60*2 seconds, but only when app is focused
    useFocusEffect(
        useCallback(() => {
            if (!token) return;

            fetchEarnings();
            const intervalId = setInterval(fetchEarnings, 2*60000);

            return () => clearInterval(intervalId);
        }, [token, fetchEarnings])
    );

    return { earnings, isLoading, error, refetch: fetchEarnings };
};

const useReferral = (token: string | null) => {
    const [referralLink, setReferralLink] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const fetchReferralData = useCallback(async () => {
        if (!token) return;

        setIsLoading(true);
        setError(null);

        try {
            const referralService = new ReferralService(REFERRAL_SERVICE_URL, token);
            const info: ReferralInfo = await referralService.getReferralInfo();
            console.log("Referral info fetched successfully");
            setReferralLink(KEYCLOAK_REGISTRATION_URL + `?referral_code=${info.referral_link}`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch referral data';
            console.error("Error fetching referral data:", err);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    const handleReferAFriend = useCallback(() => {
        if (!referralLink) {
            Alert.alert('Error', 'Referral link not available. Please try again.');
            return;
        }

        Clipboard.setString(referralLink);
        setIsCopied(true);
        console.log('Referral link copied to clipboard');

        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    }, [referralLink]);

    useEffect(() => {
        if (token) {
            fetchReferralData();
        }
    }, [token, fetchReferralData]);

    return {
        referralLink,
        isLoading,
        error,
        isCopied,
        handleReferAFriend,
        refetch: fetchReferralData
    };
};

const useSDKConnection = (token: string | null) => {
    const [connected, setConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [sdkVersion, setSdkVersion] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Load SDK version on mount
    useEffect(() => {
        const loadSDKVersion = async () => {
            try {
                const version = await getLibVersion();
                setSdkVersion(version);
                console.log('SDK Version:', version);
            } catch (error) {
                console.warn('Failed to load SDK version:', error);
            }
        };

        loadSDKVersion();
    }, []);

    const handleConnect = useCallback(async () => {
        if (!token) {
            Alert.alert('Error', 'Authentication required. Please login again.');
            return;
        }

        if (connected) {
            console.log('SDK already connected');
            return;
        }

        setIsConnecting(true);
        setError(null);

        try {
            console.log('Starting SDK connection...');
            await startSDK(token);

            setConnected(true);
            console.log('SDK connected successfully');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to connect';
            console.error('SDK connection error:', error);
            setError(errorMessage);
            setConnected(false);
            Alert.alert('Connection Failed', 'Unable to connect to the network. Please try again.');
        } finally {
            setIsConnecting(false);
        }
    }, [token, connected]);

    return {
        connected,
        isConnecting,
        sdkVersion,
        error,
        handleConnect
    };
};

const useNetworkQuality = () => {
    const [quality, setQuality] = useState(0.75);

    // TODO: Implement actual network quality monitoring
    // This is a placeholder for future implementation

    return { quality };
};

// Utility functions
const convertSecondsToTime = (seconds: number): string => {
    if (seconds <= 0) return "0 min";

    const days = Math.floor(seconds / (24 * 3600));
    seconds %= 24 * 3600;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);

    const parts: string[] = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours} hr${hours > 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? "s" : ""}`);

    return parts.length > 0 ? parts.join(", ") : "0 min";
};

const openDashboard = () => {
    Linking.openURL(DASHBOARD_URL).catch(err => {
        console.error("Failed to open dashboard URL:", err);
        Alert.alert('Error', 'Unable to open dashboard. Please check your internet connection.');
    });
};

// Main component
const Home: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Custom hooks
    const { token, isLoadingToken, logout } = useAuth();
    const { earnings, isLoading: isLoadingEarnings, error: earningsError, refetch: refetchEarnings } = useEarnings(token);
    const { referralLink, isCopied, handleReferAFriend, refetch: refetchReferral } = useReferral(token);
    const { connected, isConnecting, handleConnect } = useSDKConnection(token);
    const { quality } = useNetworkQuality();

    // Memoized calculations
    const totalEarnings = useMemo(() => {
        if (!earnings) return 0;
        return (earnings.epoch_earnings ?? 0) + (earnings.today_earnings ?? 0);
    }, [earnings]);

    const uptime = useMemo(() => {
        if (!earnings) return 0;
        return earnings.uptime + earnings.uptime_today;
    }, [earnings]);

    const formattedEarnings = useMemo(() => {
        return numeral(totalEarnings).format('0,0');
    }, [totalEarnings]);

    const formattedUptime = useMemo(() => {
        return convertSecondsToTime(uptime);
    }, [uptime]);

    const handleRefresh = useCallback(async () => {
        try {
            await Promise.all([
                refetchEarnings(),
                //refetchReferral() Now it only retrieves the referral link, not the referrals number
            ]);
        } catch (error) {
            console.error('Error refreshing data:', error);
            Alert.alert('Refresh Failed', 'Unable to refresh data. Please try again.');
        }
    }, [refetchEarnings]);

    // Asset imports (moved outside render for performance)
    const assets = useMemo(() => ({
        icon_dots: require('../assets/logo/icon_dots.png'),
        icon_wifi: require('../assets/logo/icon_wifi.png'),
        icon_wifi_offline: require('../assets/logo/icon_wifi_offline.png'),
        icon_coin: require('../assets/logo/icon_coin.png'),
        icon_logout: require('../assets/logo/icon_logout.png'),
        bg: require('../assets/logo/bg.png'),
        logo: require('../assets/logo/logo.png')
    }), []);

    // if Connect is not pressed - force press
    useEffect(() => {
        if (!connected && !isConnecting && token) {
          const timer = setTimeout(() => {
            handleConnect();
          }, 10000);

          return () => clearTimeout(timer);
        }
      }, [connected, isConnecting, token]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={assets.bg} style={styles.backgroundImage} />

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <View style={styles.dropdownMenu}>
                    <TouchableOpacity onPress={logout} style={styles.dropdownItem}>
                        <Image source={assets.icon_logout} style={styles.icon} />
                        <Text style={styles.dropdownText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Header */}
            <View style={styles.header}>
                <Image source={assets.logo} style={styles.logo} />
                <TouchableOpacity onPress={() => setIsMenuOpen(prev => !prev)}>
                    <Image source={assets.icon_dots} style={styles.icon} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {/* Connection Status */}
                <ConnectionStatusWithRefresh
                    connected={connected}
                    onRefresh={handleRefresh}
                />

                <View style={styles.mainContent}>
                    {/* Network Info */}
                    <View style={styles.networkInfo}>
                        <Image
                            source={connected ? assets.icon_wifi : assets.icon_wifi_offline}
                            style={styles.wifiIcon}
                        />
                        <Text style={styles.networkText}>
                            {connected
                                ? `Network quality: ${(quality * 100).toFixed(0)}%`
                                : 'Connect to the internet to restart earning.'
                            }
                        </Text>
                        {connected && (
                            <Text style={styles.networkSubtext}>
                                You're doing great!{'\n'}Keep connected to this network to earn.
                            </Text>
                        )}
                        {!connected && isLoadingToken && (
                            <Text style={{ color: '#fff', marginTop: 10 }}>Loading...</Text>
                        )}
                        {!isLoadingToken && (
                            <Button
                                onPress={handleConnect}
                                label={isConnecting ? "Connecting..." : connected ? "Connected" : "Connect"}
                                disabled={connected || isConnecting}
                                style={styles.connectButton}
                            />
                        )}
                    </View>

                    {/* Earnings Section */}
                    <View style={styles.earnings}>
                        <Text style={styles.earningsLabel}>Earnings:</Text>
                        <View style={styles.earningsValue}>
                            <Image source={assets.icon_coin} style={styles.icon} />
                            <Text style={styles.earningsText}>
                                {isLoadingEarnings ? '...' : formattedEarnings}
                            </Text>
                        </View>
                        {earningsError && (
                            <Text style={styles.statusText}>Failed to load earnings</Text>
                        )}
                    </View>

                    {/* Uptime Section */}
                    <View style={styles.uptimeSection}>
                        <Text style={styles.uptimeTitle}>Uptime:  </Text>
                        <Text style={styles.uptimeValue}>{formattedUptime}</Text>
                    </View>
                </View>

                <View style={styles.bottomContent}>
                    {/* Daily Boost */}
                    <DailyBoostClaim />

                    {/* Footer */}
                    <View style={styles.footer}>
                        <SecondaryButton
                            label="Open Dashboard"
                            onPress={openDashboard}
                            style={styles.dashboardButton}
                        />
                        <SecondaryButton
                            label={isCopied ? "Copied!" : "Refer a friend"}
                            onPress={handleReferAFriend}
                            disabled={!referralLink}
                            style={styles.logoutButton}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#111A26',
        paddingBottom: 20,
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginTop: 40,
    },
    logo: {
        height: 40,
        width: 100,
        resizeMode: 'contain',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
        paddingTop: 0,
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 20,
        paddingTop: 40,
    },
    bottomContent: {
        width: '100%',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 20,
    },
    connectionStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF14',
        borderRadius: 20,
        marginBottom: 0,
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    connected: {
        backgroundColor: '#0FC257',
    },
    disconnected: {
        backgroundColor: '#95A0C9',
    },
    statusText: {
        color: '#FFF',
        fontSize: 16,
        alignItems: 'center',
        fontWeight: '500',
    },
    networkInfo: {
        width: '100%',
        alignItems: 'center',
        marginTop: 0,
        marginBottom: 40,
    },
    wifiIcon: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    networkText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
    networkSubtext: {
        color: '#FFFFFF8F',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 15,
    },
    connectButton: {
        alignSelf: 'center',
        width: '70%',
        marginTop: 15,
    },
    earnings: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 0,
        marginBottom: 15,
    },
    earningsLabel: {
        color: '#FFFFFF8F',
        fontSize: 16,
    },
    earningsValue: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    earningsText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    footer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 30,
    },
    dashboardButton: {
        flex: 1,
        marginHorizontal: 10,
    },
    logoutButton: {
        flex: 1,
        marginHorizontal: 10,
    },
    uptimeSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 0,
        marginBottom: 20,
    },
    uptimeTitle: {
        color: '#FFFFFF8F',
        fontSize: 16,
        fontWeight: 'bold',
    },
    uptimeValue: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF14',
        borderRadius: 10,
        padding: 5,
        gap: 5,
    },
    refreshButtonDisabled: {
        backgroundColor: '#FFFFFF24',
    },
    refreshIcon: {
        width: 24,
        height: 24,
    } as ImageStyle,
    refreshIconSpinning: {
        transform: [{ rotate: '360deg' }],
    } as ImageStyle,
    refreshTooltip: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    icon: {
        width: 24,
        height: 24,
    },
    dropdownMenu: {
        position: 'absolute',
        right: 20,
        top: 100,
        backgroundColor: '#111A26',
        borderRadius: 16,
        padding: 10,
        zIndex: 50,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    dropdownText: {
        color: '#FFF',
        fontSize: 16,
        marginLeft: 10,
    },
});

export default Home;