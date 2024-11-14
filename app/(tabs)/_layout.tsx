import { Stack, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image } from "react-native";
import { ImageStyle } from "react-native";
import { useEffect } from "react";
import DatabaseService from "../../database/database"; // Pfad anpassen, falls nötig

// Interface für die tabBarIcon Props
interface TabBarIconProps {
    focused: boolean;
    color: string;
}

// Type für den Style der Tab-Icons
type TabIconStyle = {
    tintColor: string;
    width: number;
    height: number;
    marginBottom: number;
}

export default function TabsLayout(): JSX.Element {
    // Datenbank-Initialisierung
    useEffect(() => {
        const initDb = async () => {
            try {
                const databaseService = new DatabaseService();
                await databaseService.initializeDatabase();
                console.log('Datenbank wurde erfolgreich initialisiert');
            } catch (error) {
                console.error('Fehler bei der Datenbankinitialisierung:', error);
            }
        };

        initDb();
    }, []);

    // Gemeinsame Style-Definition für die Tab-Icons
    const getTabIconStyle = (focused: boolean): TabIconStyle => ({
        tintColor: focused ? "white" : "#404040",
        width: 26,
        height: 26,
        marginBottom: -25
    });

    // Spezieller Style für das erste Tab-Icon
    const getPrayerIconStyle = (focused: boolean): TabIconStyle => ({
        ...getTabIconStyle(focused),
        width: 38,
        height: 38,
    });

    return (
        <>
            <StatusBar style="auto" />
            <Stack.Screen
                options={{
                    headerShown: false,
                    gestureEnabled: false,
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
                        tabBarIcon: ({ focused }: TabBarIconProps) => (
                            <Image
                                source={require('../../assets/images/currentPrayer.png')}
                                style={getPrayerIconStyle(focused) as ImageStyle}
                            />
                        ),
                        tabBarLabel: "",
                    }}
                />
                <Tabs.Screen
                    name="prayerEditsPage"
                    options={{
                        headerTitle: "Gebete Übersicht",
                        headerShown: false,
                        tabBarStyle: { backgroundColor: 'black' },
                        tabBarIcon: ({ focused }: TabBarIconProps) => (
                            <Image
                                source={require('../../assets/images/edit1.png')}
                                style={getTabIconStyle(focused) as ImageStyle}
                            />
                        ),
                        tabBarLabel: "",
                    }}
                />
                <Tabs.Screen
                    name="prayerStatistics"
                    options={{
                        headerTitle: "Gebete Statistik",
                        headerShown: false,
                        tabBarStyle: { backgroundColor: 'black' },
                        tabBarIcon: ({ focused }: TabBarIconProps) => (
                            <Image
                                source={require('../../assets/images/prayerStatistic.png')}
                                style={getTabIconStyle(focused) as ImageStyle}
                            />
                        ),
                        tabBarLabel: "",
                    }}
                />
                <Tabs.Screen
                    name="profileSettings"
                    options={{
                        headerTitle: "Einstellungen",
                        headerShown: false,
                        tabBarStyle: { backgroundColor: 'black' },
                        tabBarIcon: ({ focused }: TabBarIconProps) => (
                            <Image
                                source={require('../../assets/images/settings.png')}
                                style={getTabIconStyle(focused) as ImageStyle}
                            />
                        ),
                        tabBarLabel: "",
                    }}
                />
            </Tabs>
        </>
    );
}