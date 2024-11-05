import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                {/*<Stack.Screen*/}
                {/*    name="+not-found"*/}
                {/*    options={{*/}
                {/*        title: "Oops Not Found",*/}
                {/*        ...headerStyles*/}
                {/*    }}*/}
                {/*/>*/}
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
