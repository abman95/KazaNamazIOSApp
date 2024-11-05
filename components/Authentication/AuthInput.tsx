// components/AuthInput.tsx
import React from 'react';
import { TextInput, StyleSheet, Keyboard, Dimensions } from 'react-native';
import { COLORS, SIZES } from '@/constants/theme';
import { AuthInputProps } from '@/types/auth';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    input: {
        fontSize: SIZES.fontSize.regular,
        height: height * 0.06,
        width: width * 0.7,
        borderColor: COLORS.gray,
        borderWidth: 0.3,
        borderRadius: SIZES.borderRadius,
        paddingLeft: SIZES.padding,
        color: COLORS.white,
    },
});

export const AuthInput: React.FC<AuthInputProps> = ({
                                                        placeholder,
                                                        isPassword,
                                                        value,
                                                        onChangeText,
                                                        ...props
                                                    }) => (
    <TextInput
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray}
        style={styles.input}
        keyboardType={isPassword ? "visible-password" : "email-address"}
        secureTextEntry={isPassword}
        returnKeyType="go"
        value={value}
        onChangeText={onChangeText}
        {...props}
    />
);