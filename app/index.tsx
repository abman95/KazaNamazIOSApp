import React, {useCallback, useState} from 'react';
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
} from 'react-native';
import { AuthInput } from '@/components/Authentication/AuthInput';
import { AuthButton } from '@/components/Authentication/AuthButton';
import { COLORS, SIZES } from '@/constants/theme';
import { FormData } from '@/types/auth';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 70,
    },
    header: {
        color: COLORS.white,
        fontSize: SIZES.fontSize.header,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 150,
    },
    form: {
        marginTop: 40,
        gap: 15,
        width: '100%',
        alignItems: 'center',
    },
    toggleText: {
        color: COLORS.white,
    },
    toggleLink: {
        color: COLORS.white,
        textDecorationLine: 'underline',
    },
});

const initialFormData: FormData = {
    email: '',
    password: '',
};


export default function Index(): JSX.Element {
    const router: any = useRouter();
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const correctUser: FormData = {
        email: "A",
        password: "a",
    }

    const handleSubmit = (): void => {
        if (!formData.email || !formData.password) {
            alert('Bitte alle Felder ausfüllen!')
        } else {
            console.log('Form submitted:', formData);
            useLoginValidation();
        }
    };

    const useLoginValidation = () => {
        if (formData.email === correctUser.email && formData.password === correctUser.password) {
            router.push('/currentPrayer');
        } else {
            alert('LogIn Daten sind falsch!')
        }
    }

    const toggleAuthMode = (): void => setIsLogin(!isLogin);

    const handleInputChange = (field: keyof FormData) =>
        (value: string): void => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.content}>
                    <Text style={styles.header}>
                        {isLogin ? "Login" : "Registrieren"}
                    </Text>

                    <Image
                        source={require("../assets/images/loginMannequin.jpg")}
                        style={styles.image}
                    />

                    <View style={styles.form}>
                        <AuthInput
                            placeholder="Email"
                            value={formData.email}
                            onChangeText={handleInputChange('email')}
                            onSubmitEditing={handleSubmit}
                        />

                        <AuthInput
                            placeholder="Passwort"
                            isPassword
                            value={formData.password}
                            onChangeText={handleInputChange('password')}
                            onSubmitEditing={handleSubmit}
                        />

                        <AuthButton
                            title={isLogin ? "Einloggen" : "Registrieren"}
                            onPress={handleSubmit}
                        />

                        <Text style={styles.toggleText}>
                            Möchten Sie sich{' '}
                            <Text onPress={toggleAuthMode} style={styles.toggleLink}>
                                {isLogin ? 'Registrieren' : 'Einloggen'}
                            </Text>
                            ?
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}