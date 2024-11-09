import React, { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Keyboard,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ViewStyle,
    TextStyle,
    ImageStyle,
} from 'react-native';
import { AuthInput } from '@/components/Authentication/AuthInput';
import { AuthButton } from '@/components/Authentication/AuthButton';
import { COLORS, SIZES } from '@/constants/theme';

// Types and Interfaces
export interface FormData {
    readonly email: string;
    readonly password: string;
}

export type AuthMode = 'login' | 'register';

interface ValidationResult {
    readonly isValid: boolean;
    readonly message: string;
}

interface UseAuthFormReturn {
    readonly formData: FormData;
    readonly handleInputChange: (field: keyof FormData) => (value: string) => void;
    readonly resetForm: () => void;
}

interface UseAuthReturn {
    readonly authMode: AuthMode;
    readonly toggleAuthMode: () => void;
    readonly handleAuthentication: (data: FormData) => Promise<void>;
}

// Constants
const INITIAL_FORM_DATA: Readonly<FormData> = {
    email: '',
    password: '',
} as const;

const TEST_CREDENTIALS: Readonly<FormData> = {
    email: 'A',
    password: 'a',
} as const;

// Custom Hooks
const useAuthForm = (initialState: FormData = INITIAL_FORM_DATA): UseAuthFormReturn => {
    const [formData, setFormData] = useState<FormData>(initialState);

    const handleInputChange = useCallback((field: keyof FormData) =>
            (value: string): void => {
                setFormData(prev => ({ ...prev, [field]: value }));
            },
        []);

    const resetForm = useCallback((): void => {
        setFormData(INITIAL_FORM_DATA);
    }, []);

    return {
        formData,
        handleInputChange,
        resetForm,
    };
};

const useAuth = (): UseAuthReturn => {
    const [authMode, setAuthMode] = useState<AuthMode>('login');
    const router = useRouter();

    const toggleAuthMode = useCallback((): void => {
        setAuthMode(prevMode => (prevMode === 'login' ? 'register' : 'login'));
    }, []);

    const validateForm = useCallback((data: FormData): ValidationResult => {
        if (!data.email || !data.password) {
            return {
                isValid: false,
                message: 'Bitte alle Felder ausfüllen!',
            };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email) && data.email !== TEST_CREDENTIALS.email) {
            return {
                isValid: false,
                message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
            };
        }

        if (authMode === 'register' && data.password.length < 8) {
            return {
                isValid: false,
                message: 'Das Passwort muss mindestens 8 Zeichen lang sein.',
            };
        }

        return {
            isValid: true,
            message: '',
        };
    }, [authMode]);

    const handleAuthentication = useCallback(
        async (data: FormData): Promise<void> => {
            const validation = validateForm(data);

            if (!validation.isValid) {
                Alert.alert('Fehler', validation.message);
                return;
            }

            try {
                if (authMode === 'login') {
                    if (
                        data.email === TEST_CREDENTIALS.email &&
                        data.password === TEST_CREDENTIALS.password
                    ) {
                        await router.push('/currentPrayer');
                    } else {
                        Alert.alert('Fehler', 'Login-Daten sind falsch!');
                    }
                } else {
                    Alert.alert('Info', 'Registrierung ist noch nicht implementiert.');
                }
            } catch (error) {
                if (error instanceof Error) {
                    Alert.alert('Fehler', error.message);
                } else {
                    Alert.alert(
                        'Fehler',
                        'Bei der Authentifizierung ist ein Fehler aufgetreten.',
                    );
                }
            }
        },
        [authMode, router, validateForm],
    );

    return {
        authMode,
        toggleAuthMode,
        handleAuthentication,
    };
};

export const AuthScreen: React.FC = () => {
    const { formData, handleInputChange } = useAuthForm();
    const { authMode, toggleAuthMode, handleAuthentication } = useAuth();

    const handleSubmit = useCallback((): void => {
        Keyboard.dismiss();
        void handleAuthentication(formData);
    }, [formData, handleAuthentication]);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.content}>
                    <Text style={styles.header}>
                        {authMode === 'login' ? 'Login' : 'Registrieren'}
                    </Text>

                    <Image
                        source={require('../assets/images/loginMannequin.jpg')}
                        style={styles.image}
                        accessibilityLabel="Login Mannequin"
                    />

                    <View style={styles.form}>
                        <AuthInput
                            placeholder="E-Mail"
                            value={formData.email}
                            onChangeText={handleInputChange('email')}
                            onSubmitEditing={handleSubmit}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            testID="email-input"
                            returnKeyType="next"
                        />

                        <AuthInput
                            placeholder="Passwort"
                            value={formData.password}
                            onChangeText={handleInputChange('password')}
                            onSubmitEditing={handleSubmit}
                            autoCapitalize="none"
                            autoComplete="password"
                            testID="password-input"
                            returnKeyType="done"
                            isPassword
                        />

                        <AuthButton
                            title={authMode === 'login' ? 'Einloggen' : 'Registrieren'}
                            onPress={handleSubmit}
                            testID="submit-button"
                        />

                        <Text style={styles.toggleText}>
                            Möchten Sie sich{' '}
                            <Text onPress={toggleAuthMode} style={styles.toggleLink}>
                                {authMode === 'login' ? 'Registrieren' : 'Einloggen'}
                            </Text>
                            ?
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};
// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
    } as ViewStyle,
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginTop: 80,
    } as ViewStyle,
    header: {
        color: COLORS.white,
        fontSize: SIZES.fontSize.header,
        fontWeight: 'bold',
        marginBottom: 30,
    } as TextStyle,
    image: {
        width: 300,
        height: 300,
        borderRadius: 150,
    } as ImageStyle,
    form: {
        marginTop: 40,
        gap: 15,
        width: '100%',
        alignItems: 'center',
    } as ViewStyle,
    toggleText: {
        color: COLORS.white,
        marginTop: 10,
    } as TextStyle,
    toggleLink: {
        color: COLORS.white,
        textDecorationLine: 'underline',
    } as TextStyle,
});

export default AuthScreen;