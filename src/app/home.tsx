import React, {useEffect, useRef, useState} from 'react';
import numeral from 'numeral';
import {Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageStyle} from 'react-native';
import Button from '../components/Buttons/Button';
import SecondaryButton from '../components/Buttons/SecondaryButton';
import {getLibVersion, startSDK} from "../service/sdk/sdk_service";
import {tokenStorage} from "../service/storage/tokenStorage";
import {useNavigation} from "@react-navigation/native";
import {NavigationProp} from "../service/navigation";
import {DASHBOARD_SERVICE_URL, DASHBOARD_URL, KEYCLOAK_REGISTRATION_URL, REFERRAL_SERVICE_URL} from "../service/links";
import {ReferralInfo, ReferralService} from "../service/referral/referral";
import {DashboardService, Earnings} from "../service/dashboard/dashboard";
import DailyBoostClaim from "../components/Buttons/DailyBoost";
import ConnectionStatusWithRefresh from "../components/ConnectionStatus";
import Clipboard from '@react-native-clipboard/clipboard';


const Home = () => {
    const [connected, setConnected] = useState(false);
    const [earnings, setEarnings] = useState<Earnings | null>(null);
    const [isOpenedDots, setIsOpenedDots] = useState(false);
    const [referralLink, setReferralLink] = useState('');
    const [isCopied, setCopied] = useState(false);
    const [quality, setQuality] = useState(0.75);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastRefreshTime, setLastRefreshTime] = useState(0);
    const [refreshDisabled, setRefreshDisabled] = useState(false);
    const [refreshTooltip, setRefreshTooltip] = useState('');
    const [isLocked, setIsLocked] = useState(true);
    const [isBoosted, setIsBoosted] = useState(false);
    const [isClaimed, setIsClaimed] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [unlockCountdown, setUnlockCountdown] = useState(10);
    const [boostDuration, setBoostDuration] = useState(0);
    const [uptime, setUptime] = useState(0);
    const icon_dots = require('../assets/logo/icon_dots.png');
    const icon_wifi = require('../assets/logo/icon_wifi.png');
    const icon_wifi_offline = require('../assets/logo/icon_wifi_offline.png');
    const icon_coin = require('../assets/logo/icon_coin.png');
    const icon_logout = require('../assets/logo/icon_logout.png');
    const icon_refresh = require('../assets/logo/icon_refresh.png');
    const bg = require('../assets/logo/bg.png');


    const navigation = useNavigation<NavigationProp>();

    const [token, setToken] = useState<string | null>(null);
    const [isLoadingToken, setIsLoadingToken] = useState(true);

    const [sdkVersion, setSdkVersion] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                const value = await tokenStorage.getToken();
                console.log('Retrieved token:', value);
                setToken(value);
            } catch (error) {
                console.error('Failed to get token:', error);
            } finally {
                setIsLoadingToken(false); // <-- always turn off loading
            }

            try {
                const sdkVersion = getLibVersion();
                if (sdkVersion) {
                    const version = await sdkVersion;
                    setSdkVersion(version);
                    console.log('SDK Version:', version);
                } else {
                    console.warn('SDK Version not found');
                }
            } catch (error) {
                console.warn('Failed to load SDK version:', error);
            }
        };

        init();
    }, []);


    const handleReferAFriend = () => {
        console.log('Copying to clipboard: ' + referralLink);

        Clipboard.setString(referralLink);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const openDashboard = () => {
        Linking.openURL(DASHBOARD_URL).catch(err =>
            console.error("Failed to open URL:", err)
        );
    };

    const fetchPoints = async () => {
        const dashboardService = new DashboardService(DASHBOARD_SERVICE_URL, token ?? "");
        try {
            const earningsData = await dashboardService.getEarnings();
            console.log("Earnings fetched successfully.", earningsData);
            setEarnings(earningsData);
            setUptime(earningsData.uptime+ earningsData.uptime_today);
        } catch (err) {
            console.error("Error fetching earnings:", err);
        }
    };

    const retrieveReferralData = async () => {
        const referralService = new ReferralService(REFERRAL_SERVICE_URL, token ?? "");
        try {
            const info: ReferralInfo = await referralService.getReferralInfo();
            console.log("Referral Info:", info);
            setReferralLink(KEYCLOAK_REGISTRATION_URL + `?referral_code=${info.referral_link}`);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (token) {
            fetchPoints();
            retrieveReferralData();
        }

        const intervalId = setInterval(fetchPoints, 60000);
        return () => clearInterval(intervalId);
    }, [token]);

    const updateConnectedState = () => {
        //??
    };

    const connectedRef = useRef(connected);
    const isLoadingTokenRef = useRef(isLoadingToken);
    const tokenRef = useRef(token);

    useEffect(() => {
        connectedRef.current = connected;
    }, [connected]);

    useEffect(() => {
        isLoadingTokenRef.current = isLoadingToken;
    }, [isLoadingToken]);

    useEffect(() => {
        tokenRef.current = token;
    }, [token]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            console.log('Render state:', {
                connected: connectedRef.current,
                isLoadingToken: isLoadingTokenRef.current,
                token: tokenRef.current,
            });
        }, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const logout = async () => {
        try {
            await tokenStorage.removeToken();
        } catch (error) {
            console.error('Error removing token:', error);
        }

        console.log('Going back to login');
        navigation.navigate("LogoutWebView");
    };

    const convertSecondsToTime = (seconds: number) => {
        const days = Math.floor(seconds / (24 * 3600));
        seconds %= 24 * 3600;
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);

        let result = "";
        if (days > 0) result += `${days} day${days > 1 ? "s" : ""}, `;
        if (hours > 0) result += `${hours} hr${hours > 1 ? "s" : ""}, `;
        if (minutes > 0) result += `${minutes} min${minutes > 1 ? "s" : ""}`;
        if (result === "") {
            return "0 min"
        }
        return result.replace(/, $/, "");
    };

    const refreshData = () => {
        if (refreshDisabled) {
            return;
        }

        const now = Date.now();
        setLastRefreshTime(now);
        setIsRefreshing(true);

        console.log("Manually refreshing data");
        fetchPoints();
        retrieveReferralData();

        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={bg} style={styles.backgroundImage}/>
            {isOpenedDots && (
                <View style={styles.dropdownMenu}>
                    <TouchableOpacity onPress={logout} style={styles.dropdownItem}>
                        <Image source={icon_logout} style={styles.icon}/>
                        <Text style={styles.dropdownText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            )}
            <View style={styles.header}>
                <Image source={require('../assets/logo/logo.png')} style={styles.logo}/>
                <TouchableOpacity onPress={() => setIsOpenedDots((prev) => !prev)}>
                    <Image source={icon_dots} style={styles.icon}/>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>


               <ConnectionStatusWithRefresh connected={connected} />


                <View style={styles.networkInfo}>
                    <Image source={connected ? icon_wifi : icon_wifi_offline} style={styles.wifiIcon}/>
                    <Text style={styles.networkText}>
                        {connected ? `Network quality: ${(quality * 100).toFixed(0)}%` : 'Connect to the internet to restart earning.'}
                    </Text>
                    {connected && (
                        <Text style={styles.networkSubtext}>
                            You're doing great! Keep connected to this network to earn.
                        </Text>
                    )}
                    {!connected && isLoadingToken && (
                        <Text style={{color: '#fff', marginTop: 10}}>Loading token...</Text>
                    )}
                    {!connected && !isLoadingToken && (
                        <Button onPress={() => {
                            if (token) {
                                startSDK(token).then(() => {
                                    console.log("SDK started")
                                    setConnected(true);
                                }).catch(
                                    (error) => {
                                        console.error("Error starting SDK:", error);
                                        setConnected(false);
                                    }
                                );
                            } else {
                                console.log("No token found, cannot start SDK");
                            }
                        }}
                            label={`Connect!`} disabled={false}
                            style={styles.connectButton}/>
                    )}
                </View>
                <View style={styles.earnings}>
                    <Text style={styles.earningsLabel}>Earnings:</Text>
                    <View style={styles.earningsValue}>
                        <Image source={icon_coin} style={styles.icon}/>
                        <Text style={styles.earningsText}>{numeral((earnings?.epoch_earnings ?? 0) + (earnings?.today_earnings ?? 0)).format('0,0')}</Text>
                    </View>
                </View>

                {/* Boost Section */}
                {/* Uptime Section */}
                <View style={styles.uptimeSection}>
                    <Text style={styles.uptimeTitle}>Uptime</Text>
                    <Text style={styles.uptimeValue}>{convertSecondsToTime(uptime)}</Text>
                </View>

                <DailyBoostClaim  />
            </View>
            <View style={styles.footer}>
                <SecondaryButton
                    label="Open Dashboard"
                    onPress={openDashboard}
                    style={styles.dashboardButton}
                />
                <SecondaryButton
                    label="Refer a friend"
                    onPress={handleReferAFriend}
                    style={styles.logoutButton}
                />
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
        padding: 20,
        marginTop: 20,
    },
    logo: {
        height: 40,
        width: 100,
        resizeMode: 'contain',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    connectionStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF14',
        borderRadius: 20,
        marginBottom: 80,
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
        marginTop: 20,
    },
    wifiIcon: {
        width: 96,
        height: 96,
        resizeMode: 'contain',
    },
    networkText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
    networkSubtext: {
        color: '#FFFFFF8F',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5,
    },
    connectButton: {
        alignSelf: 'center',
        width: '70%',
        marginTop: 20,
    },
    earnings: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 120,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    dashboardButton: {
        flex: 1,
        marginHorizontal: 10,
    },
    logoutButton: {
        flex: 1,
        marginHorizontal: 10,
    },
    boostSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    boostHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    boostTitle: {
        color: '#FFFFFF8F',
        fontSize: 16,
        fontWeight: 'bold',
    },
    boostDuration: {
        color: '#FFFFFF8F',
        fontSize: 16,
    },
    boostContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    boostActive: {
        backgroundColor: '#0FC257',
        borderRadius: 10,
        padding: 5,
    },
    boostActiveText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    boostInactive: {
        backgroundColor: '#95A0C9',
        borderRadius: 10,
        padding: 5,
    },
    boostInactiveText: {
        color: '#FFFFFF8F',
        fontSize: 16,
    },
    uptimeSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    uptimeTitle: {
        color: '#FFFFFF8F',
        fontSize: 16,
        fontWeight: 'bold',
    },
    uptimeValue: {
        color: '#FFFFFF8F',
        fontSize: 16,
        marginLeft: 10,
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
        top: 80,
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