import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';


// You'll need to import these functions from your API/utils
// import { ClaimDailyReward } from './api';
// import { LogPrint, LogError } from './utils';

interface ClaimRewardResponse {
    special_reward: boolean;
    boost_duration_in_seconds?: number;
}

const DailyBoostClaim: React.FC = () => {
    const [isLocked, setIsLocked] = useState(true);
    const [isBoosted, setIsBoosted] = useState(false);
    const [isClaimed, setIsClaimed] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [unlockCountdown, setUnlockCountdown] = useState(10);
    const [boostDuration, setBoostDuration] = useState(0);

    const getUnlockButtonLabel = (): string => {
        if (isLocked) {
            if (unlockCountdown > 0) {
                return `Unlock in ${unlockCountdown} min`;
            } else {
                return "Unlocking soon...";
            }
        }
        return "";
    };

    const convertSecondsToTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        } else {
            return `${remainingSeconds}s`;
        }
    };

    const fetchStatus = () => {
        // Implement your status fetching logic here
        console.log('Fetching status...');
    };

    const ClaimDailyReward = async (): Promise<ClaimRewardResponse> => {
        // Replace with your actual API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    special_reward: Math.random() > 0.5,
                    boost_duration_in_seconds: 3600 // 1 hour example
                });
            }, 1000);
        });
    };

    const LogPrint = (message: string) => {
        console.log(message);
    };

    const LogError = (message: string) => {
        console.error(message);
    };

    const claimHandler = () => {
        ClaimDailyReward()
            .then((resp: ClaimRewardResponse) => {
                setIsBoosted(resp.special_reward);
                setIsClaimed(true);
                const boostDurationSeconds = resp?.boost_duration_in_seconds;

                LogPrint("Got boost for " + boostDurationSeconds);

                if (boostDurationSeconds) {
                    setBoostDuration(boostDurationSeconds);

                    setTimeout(() => {
                        fetchStatus();
                        setIsBoosted(false);
                    }, boostDurationSeconds * 1000);
                }

                LogPrint("Reward successfully claimed.");
            })
            .catch((err) => {
                LogError("Failed to claim reward:" + err);
            });
    };

    interface ButtonProps {
        label: string;
        background: string;
        onPress: () => void;
        icon?: React.ReactNode;
    }

    const Button: React.FC<ButtonProps> = ({ label, background, onPress, icon }) => (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: background }]}
            onPress={onPress}
        >
            <View style={styles.buttonContent}>
                {icon && <View style={styles.buttonIcon}>{icon}</View>}
                <Text style={styles.buttonText}>{label}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.claimBox}>
                {/* Info icon */}
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => setShowTooltip(!showTooltip)}>
                        <Image
                            source={require('../../assets/logo/info.png')} // Replace with your icon path
                            style={styles.infoIcon}
                        />
                    </TouchableOpacity>

                    {/* Tooltip */}
                    {showTooltip && (
                        <View style={styles.tooltip}>
                            <Text style={styles.tooltipText}>
                                Stay connected for at least 10 minutes every day to unlock rewards!
                                {'\n\n'}
                                Each day = more points.{'\n'}
                                Day 7? Big bonus 🔥
                                {'\n\n'}
                                Miss a day? Ups... streak resets.
                            </Text>
                        </View>
                    )}
                </View>

                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Claim Daily Boost</Text>
                </View>

                {/* Conditional Button Rendering */}
                {isLocked ? (
                    <Button
                        label={getUnlockButtonLabel()}
                        background="rgb(63, 59, 99)"
                        onPress={() => {}}
                        icon={
                            <Image
                                source={require('../../assets/logo/lock.png')}
                                style={styles.lockIcon}
                            />
                        }
                    />
                ) : !isClaimed ? (
                    <Button
                        label="Claim Now"
                        background="#8f4ae3"
                        onPress={claimHandler}
                    />
                ) : isBoosted ? (
                    <Button
                        label={`Enjoy X1.2 for ${convertSecondsToTime(boostDuration)}`}
                        background="#8f4ae3"
                        onPress={() => {}}
                    />
                ) : (
                    <Button
                        label="See you tomorrow"
                        background="rgb(63, 59, 99)"
                        onPress={() => {}}
                        icon={
                            <Image
                                source={require('../../assets/logo/lock.png')}
                                style={styles.lockIcon}
                            />
                        }
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxWidth: 320,
        marginTop: 32,
        paddingHorizontal: 24,
    },
    claimBox: {
        backgroundColor: '#8F4AE333',
        borderWidth: 1,
        borderColor: '#8F4AE3',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    iconContainer: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    infoIcon: {
        height: 12,
        width: 12,
    },
    tooltip: {
        position: 'absolute',
        top: -176,
        right: -150,
        backgroundColor: '#8F4AE333',
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 6,
        width: 144,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    tooltipText: {
        color: 'white',
        fontSize: 11,
        lineHeight: 14,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    title: {
        fontSize: 16,
        color: 'white',
        fontWeight: '500',
    },
    button: {
        marginTop: 8,
        paddingHorizontal: 24,
        paddingVertical: 6,
        borderRadius: 6,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '400',
    },
    lockIcon: {
        height: 16,
        width: 16,
    },
});

export default DailyBoostClaim;