// types/auth.ts
export interface FormData {
    email: string;
    password: string;
}

export interface AuthButtonProps {
    onPress: () => void;
    title: string;
}

export interface AuthInputProps {
    placeholder: string;
    isPassword?: boolean;
    value: string;
    onChangeText: (text: string) => void;
}