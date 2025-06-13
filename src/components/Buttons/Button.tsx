import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

// Define the type for the props
interface ButtonProps {
    label: string;
    onPress?: () => void;
    disabled?: boolean;
    style?: object;
}

const Button: React.FC<ButtonProps> = ({ label, onPress, disabled = false, style = {} }) => {
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
        backgroundColor: '#6CE7E4', // Default background color
        padding: 10,
      //idk is this work?  backgroundImage: 'linear-gradient(to right, #6CE7E4, #8F4AE3)', // React Native doesn't support linear gradient directly, you might need a library like `react-native-linear-gradient`
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
        color: '#040B15',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Button;