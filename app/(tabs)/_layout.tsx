import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import PrayerEditsPage from "@/app/(tabs)/currentPrayer";

export default function TabsLayout() {
    return (
        <>
            <StatusBar style="auto" />
            <Tabs>
                <Tabs.Screen
                    name="currentPrayer"
                    options={{
                        headerTitle: "Jetztiges Gebet",
                        headerShown: false,
                        tabBarStyle: { backgroundColor: 'black' },
                    }}
                />
                <Tabs.Screen
                    name="prayerEditsPage"
                    options={{
                        headerTitle: "Deine Gebete",
                        headerShown: false,
                        tabBarStyle: { backgroundColor: 'black' },
                    }}
                />

        </Tabs>
        </>
    );
}