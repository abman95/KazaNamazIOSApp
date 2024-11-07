import { Stack, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function TabsLayout() {
    return (
        <>
            <StatusBar style="auto" />
            <Stack.Screen
                options={{
                    headerShown: false,
                    gestureEnabled: false,
                    href: null,
                }}
            />

            <StatusBar style="auto" />
            <Tabs>
                <Tabs.Screen
                    name="currentPrayer"
                    options={{
                        headerTitle: "Aktuelle Gebetszeit",
                        headerShown: false,
                        tabBarStyle: { backgroundColor: 'black' },
                    }}
                />
                <Tabs.Screen
                    name="prayerEditsPage"
                    options={{
                        headerTitle: "Gebete Übersicht",
                        headerShown: false,
                        tabBarStyle: { backgroundColor: 'black' },
                    }}
                />
                <Tabs.Screen
                    name="prayerStatistics"
                    options={{
                        headerTitle: "Gebete Statistik",
                        headerShown: false,
                        tabBarStyle: { backgroundColor: 'black' },
                    }}
                />

            </Tabs>
        </>
    );
}