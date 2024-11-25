import React, {useCallback, useState, useMemo} from 'react';
import {Text, View, StyleSheet, Image, Pressable} from 'react-native';
import {useFocusEffect} from "@react-navigation/native";
import DatabaseService from "@/database/database";
import StatisticsDatePickerModal from "@/components/DatePicker/StatisticsDatePicker";
import KazaPrayersModal from "@/components/KazaPrayers/KazaPrayersModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

const databaseService = new DatabaseService();

const FILTER_ICON = require('../../assets/images/filterIcon.png');
const INITIAL_START_DATE = '1999-01-01';
const PRAYER_TIMES = ['Morgen', 'Mittag', 'Nachmittag', 'Abend', 'Nacht'] as const;

interface PrayerStatistic {
    prayerTime: typeof PRAYER_TIMES[number];
    count: number;
}

const getPrayerCounts = (prayedData: PrayerStatistic[]) => {
    return PRAYER_TIMES.reduce((acc, prayerTime) => {
        const matchedPrayer = prayedData.find(item => item.prayerTime === prayerTime);
        acc[prayerTime] = matchedPrayer ? matchedPrayer.count : 0;
        return acc;
    }, {} as Record<typeof PRAYER_TIMES[number], number>);
};

export default function PrayerStatistics(): JSX.Element {
    const [isLoading, setIsLoading] = useState(true);
    const [isStatisticModalVisible, setIsStatisticModalVisible] = useState<boolean>(false);
    const [isKazaPrayersModalVisible, setIsKazaPrayersModalVisible] = useState<boolean>(false);
    const [fromDateString, setFromDateString] = useState<string>(INITIAL_START_DATE);
    const [toDateString, setToDateString] = useState<string>(new Date().toISOString().split('T')[0]);


    const [unprayedData, setUnprayedData] = useState<PrayerStatistic[]>([]);
    const [prayedData, setPrayedData] = useState<PrayerStatistic[]>([]);

    const initAndLoad = useCallback(async (fromDateString: string, toDateString: string) => {
        try {
            setIsLoading(true);
            await databaseService.initializeDatabase();
            await initAndLoadLocalStorage();

            const [notPrayedStats, prayedStats] = await Promise.all([
                databaseService.getNotPrayedDataStatistic(fromDateString, toDateString),
                databaseService.getPrayedDataStatistic(fromDateString, toDateString)
            ]);

            setUnprayedData(notPrayedStats);
            setPrayedData(prayedStats);
        } catch (error) {
            console.error('Error initializing and loading prayer status:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const initAndLoadLocalStorage = useCallback(async () => {
        const fromDateString = await AsyncStorage.getItem('FromDateString');
        const toDateString = await AsyncStorage.getItem('ToDateString');

        setFromDateString(fromDateString ? fromDateString.split('T')[0] : "1999-01-01");
        setToDateString(toDateString ? toDateString.split('T')[0] : new Date().toISOString().split('T')[0]);
    }, [])


    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                await initAndLoad(fromDateString, toDateString);
            };

            void loadData();
        }, [fromDateString, toDateString])
    );


    const onStatisticModalClose = useCallback(async () => {
        setIsStatisticModalVisible(false);

        await initAndLoadLocalStorage();
    }, [])

    const onStatisticModalOpen = useCallback(async () => {
        setIsStatisticModalVisible(true);
    }, [])


    const onKazaPrayersModalClose = useCallback(async () => {
        setIsKazaPrayersModalVisible(false);
        void initAndLoad(fromDateString, toDateString);
    }, [fromDateString, toDateString])

    const onKazaPrayersModalOpen = useCallback(async () => {
        setIsKazaPrayersModalVisible(true);
    }, [])


    // const maxTotalCount = useMemo(() => {
    //     const maxPrayed = prayedData.reduce((max, curr) =>
    //             curr.count > max.count ? curr : max,
    //         { count: 0 } as PrayerStatistic
    //     ).count;
    //
    //     const maxUnprayed = unprayedData.reduce((max, curr) =>
    //             curr.count > max.count ? curr : max,
    //         { count: 0 } as PrayerStatistic
    //     ).count;
    //
    //     return maxPrayed + maxUnprayed;
    // }, [prayedData, unprayedData]);


    const maxTotalCount = useMemo(() => {
        const prayerNameString = "Morgen";

        const prayed = prayedData.find((entry) => entry.prayerTime === prayerNameString)?.count || 0;
        const unprayed = unprayedData.find((entry) => entry.prayerTime === prayerNameString)?.count || 0;

        return prayed + unprayed;
    }, [prayedData, unprayedData]);


    const calculateProportionalBarWidth = useCallback((value: number) => {
        return 290 * (value / maxTotalCount);
    }, [maxTotalCount]);

    const prayerCounts = useMemo(() => getPrayerCounts(prayedData), [prayedData]);



    // if (isLoading) {
    //     return (
    //         <View style={styles.container}>
    //             <Text style={styles.containerHeader}>Gebete Statistik</Text>
    //             <View style={ styles.statisticFilterContainer}>
    //                 <Text style={ styles.statisticFilterText}>Zeitraum: {fromDateString} - {toDateString}</Text>
    //             </View>
    //         </View>
    //     );
    // }

    return (
        <View style={styles.container}>
            {isStatisticModalVisible && <StatisticsDatePickerModal onClose={onStatisticModalClose}/>}
            {isKazaPrayersModalVisible && <KazaPrayersModal onClose={onKazaPrayersModalClose}
                                                            maxTotalCount={maxTotalCount}
                                                            onKazaPrayersModalClose={onKazaPrayersModalClose}
                                                            prayerCounts={prayerCounts}
            />}
            <Text style={styles.containerHeader}>Gebete Statistik</Text>
            <View style={ styles.statisticFilterContainer}>
                <Text style={ styles.statisticFilterText}>Zeitraum: {fromDateString} - {toDateString}</Text>
                <Pressable
                    onPress={onStatisticModalOpen}
                    style={({ pressed }) => [
                        pressed ? styles.statisticFilterImageBackgroundPressed : styles.statisticFilterImageBackground
                    ]}
                >
                    <View>
                        <Image style={styles.statisticFilterImage} source={FILTER_ICON}></Image>
                    </View>
                </Pressable>
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
                        <View style={[styles.chartYLineMorningValue, { width: calculateProportionalBarWidth(prayerCounts['Morgen']) }]}>
                            <Text style={styles.prayedDaysText}>{prayerCounts['Morgen']}</Text>
                            <View style={styles.chartYLineMorningTargetValue}>
                                <Text style={styles.targetText}>{maxTotalCount}T</Text>
                            </View>
                        </View>
                        <View style={[styles.chartYLineNoonValue, { width: calculateProportionalBarWidth(prayerCounts['Mittag']) }]}>
                            <Text style={styles.prayedDaysText}>{prayerCounts['Mittag']}</Text>
                            <View style={styles.chartYLineNoonTargetValue}>
                                <Text style={styles.targetText}>{maxTotalCount}T</Text>
                            </View>
                        </View>
                        <View style={[styles.chartYLineAfternoonValue, { width: calculateProportionalBarWidth(prayerCounts['Nachmittag']) }]}>
                            <Text style={styles.prayedDaysText}>{prayerCounts['Nachmittag']}</Text>
                            <View style={styles.chartYLineAfternoonTargetValue}>
                                <Text style={styles.targetText}>{maxTotalCount}T</Text>
                            </View>
                        </View>
                        <View style={[styles.chartYLineEveningValue, { width: calculateProportionalBarWidth(prayerCounts['Abend']) }]}>
                            <Text style={styles.prayedDaysText}>{prayerCounts['Abend']}</Text>
                            <View style={styles.chartYLineEveningTargetValue}>
                                <Text style={styles.targetText}>{maxTotalCount}T</Text>
                            </View>
                        </View>
                        <View style={[styles.chartYLineNightValue, { width: calculateProportionalBarWidth(prayerCounts['Nacht']) }]}>
                            <Text style={styles.prayedDaysText}>{prayerCounts['Nacht']}</Text>
                            <View style={styles.chartYLineNightTargetValue}>
                                <Text style={styles.targetText}>{maxTotalCount}T</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.chartXLine}></View>
            </View>
            <View style={{flexDirection: "row"}}>
                <Text style={{ color: "white", fontSize: 7, marginTop: -200 }}>Daten: {JSON.stringify(unprayedData, null, 2)}</Text>
                <Text style={{ color: "white", fontSize: 7, marginTop: -200 }}>Daten: {JSON.stringify(prayedData, null, 2)}</Text>
                <Pressable
                    onPress={onKazaPrayersModalOpen}
                    style={({ pressed }) => [
                        pressed ? styles.kazaNamazBackgroundPressed : styles.kazaNamazBackground
                    ]}
                >
                    <View>
                        <Text style={ styles.kazaNamazButtonText }>Gebet nachholen</Text>
                    </View>
                </Pressable>
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
        fontSize: 28,
        fontWeight: '400',
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
    statisticFilterImageBackgroundPressed: {
        height: 50,
        width: 50,
        borderRadius: 50,
        borderColor: "white",
        backgroundColor: "grey",
        justifyContent: "center",
        alignItems: "center",
    },
    kazaNamazBackground: {
        height: 50,
        width: 150,
        borderRadius: 5,
        borderColor: "white",
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    kazaNamazBackgroundPressed: {
        height: 50,
        width: 150,
        borderRadius: 5,
        borderColor: "white",
        backgroundColor: "grey",
        justifyContent: "center",
        alignItems: "center",
    },
    kazaNamazButtonText: {
        color: "black",
        fontSize: 15,
        fontWeight: "300",
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