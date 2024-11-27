import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
    const [isReady, setIsReady] = useState(false);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        const checkStorageConditions = async () => {
            try {
                const countryValue = await AsyncStorage.getItem('selectedCountry');
                const methodValue = await AsyncStorage.getItem('selectedMethod');

                const country = countryValue ? JSON.parse(countryValue) : { name: "0" };
                const method = methodValue ? JSON.parse(methodValue) : { name: "0" };

                if (country.name !== "0" && method.name !== "0") {
                    setShouldRedirect(true);
                }
            } catch (e) {
                console.error('Error checking storage conditions:', e);
            } finally {
                setIsReady(true);
            }
        };

        void checkStorageConditions();
    }, []);

    if (!isReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                <ActivityIndicator size="large" color="white" />
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack>
                {shouldRedirect ? (
                    <Stack.Screen
                        name="index"
                        options={{ headerShown: false }}
                        redirect={true}
                        href="/currentPrayer"
                    />
                ) : (
                    <Stack.Screen
                        name="index"
                        options={{ headerShown: false }}
                    />
                )}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="+not-found"
                    options={{
                        title: "Oops Not Found",
                        ...headerStyles
                    }}
                />
            </Stack>
        </GestureHandlerRootView>
    );
}

const headerStyles = {
    headerStyle: {
        backgroundColor: 'black'
    },
    headerTitleStyle: {
        fontSize: 18,
        color: 'white'
    },
    headerTitleAlign: 'center' as const,
};