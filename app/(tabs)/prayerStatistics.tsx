import React, {useCallback, useState, useEffect} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {convertPrayerName} from "@/components/PrayerTimes/CurrentPrayerTimes/convertPrayerName";
import {useFocusEffect} from "@react-navigation/native";
import DatabaseService from "@/database/database";

const databaseService = new DatabaseService();

export default function PrayerStatistics(): JSX.Element {
    const [isLoading, setIsLoading] = useState(true);

    const images = {
        morgen: require('../../assets/images/morgenGebet.jpg'),
        mittag: require('../../assets/images/mittagGebet.jpg'),
        nachmittag: require('../../assets/images/nachmittagGebet.jpg'),
        abend: require('../../assets/images/abendGebet.jpg'),
        nacht: require('../../assets/images/nachtGebet.jpg'),
    };



    const initAndLoad = useCallback(async () => {
        try {
            setIsLoading(true);
            await databaseService.initializeDatabase();


            // Lade den Status mit dem konvertierten Gebetsnamen
            const status = await databaseService.getPrayerStatus(
                dateStart,
                dateEnd
            );

            setSelectedOption(status as string);
        } catch (error) {
            console.error('Error initializing and loading prayer status:', error);
        } finally {
            setIsLoading(false);
        }
    }, []); // Abhängigkeiten, um sicherzustellen, dass die Funktion aktualisiert wird, wenn sich die Daten ändern

// Verwende initAndLoad in useEffect für die Initialisierung beim ersten Rendern und bei Änderungen von Abhängigkeiten
    useEffect(() => {
        initAndLoad();
    }, [initAndLoad]);

// Verwende initAndLoad auch in useFocusEffect, um die Daten beim erneuten Fokusieren des Tabs neu zu laden
    useFocusEffect(
        useCallback(() => {
            initAndLoad();
        }, [initAndLoad])
    );



    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.containerHeader}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.containerHeader}>Gebete Statistik</Text>
            <View style={ styles.statisticFilterContainer}>
                <Text style={ styles.statisticFilterText}>Zeitraum: 20.03.2023 - 20.08.2024</Text>
                <View style={styles.statisticFilterImageBackground}>
                    <Image style={styles.statisticFilterImage} source={require('../../assets/images/filterIcon.png')}></Image>
                </View>
            </View>
            <View style={styles.chartContainer}>
                <View style={styles.chartYLineContainer}>
                    <View style={styles.chartYLineDescriptionContainer}>
                        <Text style={styles.chartYLineDescription}>Mrg.</Text>
                        <Text style={styles.chartYLineDescription}>Mit.</Text>
                        <Text style={styles.chartYLineDescription}>Nm.</Text>
                        <Text style={styles.chartYLineDescription}>Ab.</Text>
                        <Text style={styles.chartYLineDescription}>N.</Text>
                    </View>
                    <View style={styles.chartYLine}></View>
                    <View style={styles.chartYLinePrayerValue}>
                        <View style={styles.chartYLineMorningValue}>
                            <Text style={styles.prayedDaysText}>20T</Text>
                            <View style={styles.chartYLineMorningTargetValue}>
                                <Text style={styles.targetText}>20T</Text>
                            </View></View>
                        <View style={styles.chartYLineNoonValue}>
                            <Text style={styles.prayedDaysText}>20T</Text>
                            <View style={styles.chartYLineNoonTargetValue}>
                                <Text style={styles.targetText}>20T</Text>
                            </View></View>
                        <View style={styles.chartYLineAfternoonValue}>
                            <Text style={styles.prayedDaysText}>20T</Text>
                            <View style={styles.chartYLineAfternoonTargetValue}>
                                <Text style={styles.targetText}>20T</Text>
                            </View></View>
                        <View style={styles.chartYLineEveningValue}>
                            <Text style={styles.prayedDaysText}>20T</Text>
                            <View style={styles.chartYLineEveningTargetValue}>
                                <Text style={styles.targetText}>420T</Text>
                            </View></View>
                        <View style={styles.chartYLineNightValue}>
                            <Text style={styles.prayedDaysText}>20T</Text>
                            <View style={styles.chartYLineNightTargetValue}>
                                <Text style={styles.targetText}>20T</Text>
                            </View></View>
                    </View>
                </View>
                <View style={styles.chartXLine}></View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    containerHeader: {
        marginTop: 60,
        textAlign: 'center',
        fontSize: 30,
        fontWeight: "bold",
        color: 'white'
    },
    statisticFilterContainer: {
        marginTop: 30,
        paddingLeft: 20,
        paddingRight: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 35,
    },
    statisticFilterText: {
        color: "white",
        fontSize: 17,
        fontWeight: "500",
    },
    statisticFilterImageBackground: {
        height: 50,
        width: 50,
        borderRadius: 50,
        borderColor: "white",
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    statisticFilterImage: {
        height: 25,
        width: 25,
        tintColor: "black",
    },
    chartContainer: {
        marginTop: 30,
        padding: 0,
        height: 500,
        width: "100%",
    },
    chartYLineContainer: {
        display: "flex",
        flexDirection: "row",
    },
    chartYLine: {
        height: 250,
        width: 1,
        backgroundColor: 'white',
    },
    chartYLineDescriptionContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginRight: 2,
    },
    chartYLineDescription: {
        textAlign: "right",
        color: "white",
        fontSize: 15,
        height: 35,
        width: 45,
        fontWeight: "300"
    },
    chartYLinePrayerValue: {
        display: "flex",
        justifyContent: "space-between",
    },
    chartYLineMorningValue: {
        height: 35,
        width: 80,
        backgroundColor: '#FF6B6B',
        borderColor: '#D9534F',
        borderWidth: .5,
        justifyContent: 'center',
    },
    chartYLineNoonValue: {
        height: 35,
        width: 240,
        backgroundColor: '#FFD93D',
        borderColor: '#E6B800',
        borderWidth: .5,
        justifyContent: 'center',
    },
    chartYLineAfternoonValue: {
        height: 35,
        width: 150,
        backgroundColor: '#4ECDC4',
        borderColor: '#379490',
        borderWidth: .5,
        justifyContent: 'center',
    },
    chartYLineEveningValue: {
        height: 35,
        width: 200,
        backgroundColor: '#1A535C',
        borderColor: '#123E45',
        borderWidth: .5,
        justifyContent: 'center',
    },
    chartYLineNightValue: {
        height: 35,
        width: 230,
        backgroundColor: '#2E2E2E',
        borderColor: '#1A1A1A',
        borderWidth: .5,
        justifyContent: 'center',
    },
    prayedDaysText: {
        position: 'absolute',
        alignSelf: 'center',
        color: 'white',
        fontSize: 15,
        fontWeight: '300',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: .5, height: .5 },
        textShadowRadius: 3,
    },
    targetText: {
        position: 'absolute',
        width: 60,
        right: -65,
        color: 'white',
        fontSize: 15,
        fontWeight: '300',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: .5, height: .5 },
        textShadowRadius: 3,
    },
    chartYLineMorningTargetValue: {
        marginTop: -.4,
        height: 35,
        width: 290,
        borderColor: '#D9534F',
        borderWidth: 2,
        justifyContent: 'center',
    },
    chartYLineNoonTargetValue: {
        marginTop: -.4,
        height: 35,
        width: 290,
        borderColor: '#E6B800',
        borderWidth: 2,
        justifyContent: 'center',
    },
    chartYLineAfternoonTargetValue: {
        marginTop: -.4,
        height: 35,
        width: 290,
        borderColor: '#379490',
        borderWidth: 2,
        justifyContent: 'center',
    },
    chartYLineEveningTargetValue: {
        marginTop: -.4,
        height: 35,
        width: 290,
        borderColor: '#123E45',
        borderWidth: 2,
        justifyContent: 'center',
    },
    chartYLineNightTargetValue: {
        marginTop: -.4,
        height: 35,
        width: 290,
        borderColor: '#1A1A1A',
        borderWidth: 2,
        justifyContent: 'center',
    },
    chartXLine: {
        marginLeft: 47,
        display: "flex",
        justifyContent: "flex-end",
        flexDirection: "row",
        height: 2,
        width: 300,
        backgroundColor: 'white',
    }
});