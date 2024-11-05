// components/AuthButton.tsx
import React from 'react';
import { Pressable, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES } from '@/constants/theme';
import { AuthButtonProps } from '@/types/auth';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    button: {
        height: height * 0.06,
        width: width * 0.7,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.borderRadius,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.primary,
        fontSize: SIZES.fontSize.regular,
    },
});

export const AuthButton: React.FC<AuthButtonProps> = ({ onPress, title }) => (
    <Pressable
        style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.8 }
        ]}
        onPress={onPress}
    >
        <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
);