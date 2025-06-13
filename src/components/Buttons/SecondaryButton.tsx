import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface SecondaryButtonProps {
    label: string;
    onPress?: () => void;
    disabled?: boolean;
    style?: object;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ label, onPress, disabled = false, style = {} }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, style, disabled && styles.disabledButton]}
            disabled={disabled}
        >
            <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>{label}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#8F4AE3',
        backgroundColor: 'transparent',
        padding: 10,
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#8F4AE3',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default SecondaryButton;