// types/auth.ts
export interface AuthButtonProps {
    onPress: () => void;
    title: string;
    disabled?: boolean;
}

// components/AuthButton.tsx
import React from 'react';
import { Pressable, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES } from '@/constants/theme';

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
    disabledButton: {
        opacity: 0.5,
    },
});

export const AuthButton: React.FC<AuthButtonProps> = ({
                                                          onPress,
                                                          title,
                                                          disabled = false
                                                      }) => (
    <Pressable
        style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.8 },
            disabled && styles.disabledButton
        ]}
        onPress={onPress}
        disabled={disabled}
    >
        <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
);