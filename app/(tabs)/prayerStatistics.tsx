import React, {useCallback, useState, useEffect, useMemo} from 'react';
import {Text, View, StyleSheet, Image, Pressable} from 'react-native';
import {useFocusEffect} from "@react-navigation/native";
import DatabaseService from "@/database/database";
import StatisticsDatePickerModal from "@/components/DatePicker/StatisticsDatePicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const databaseService = new DatabaseService();

const INITIAL_START_DATE = '1999-01-01';
const PRAYER_TIMES = ['Morgen', 'Mittag', 'Nachmittag', 'Abend', 'Nacht'] as const;

interface PrayerStatistic {
    prayerTime: typeof PRAYER_TIMES[number];
    count: number;
}

export default function PrayerStatistics(): JSX.Element {
    const [isLoading, setIsLoading] = useState(true);
    const [isStatisticModalVisible, setIsStatisticModalVisible] = useState<boolean>(false);
    const [fromDateString, setFromDateString] = useState<string>(INITIAL_START_DATE);
    const [toDateString, setToDateString] = useState<string>(new Date().toISOString().split('T')[0]);





    const [unprayedData, setUnprayedData] = useState<PrayerStatistic[]>([]);
    const [prayedData, setPrayedData] = useState<PrayerStatistic[]>([]);

    const [maxPrayedCount, setMaxPrayedCount] = useState(0);






    const initAndLoad = useCallback(async (fromDateString: string, toDateString: string) => {
        try {
            setIsLoading(true);
            await databaseService.initializeDatabase();

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

    useEffect(() => {
        const loadData = async () => {
            await initAndLoad(fromDateString, toDateString);
        };

        void loadData();
    }, [fromDateString, toDateString]);


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

        const fromDateString = await AsyncStorage.getItem('FromDateString');
        const toDateString = await AsyncStorage.getItem('ToDateString');

        setFromDateString(fromDateString ? fromDateString.split('T')[0] : "1999-01-01");
        setToDateString(toDateString ? toDateString.split('T')[0] : new Date().toISOString().split('T')[0]);
    }, [])

    const onStatisticModalOpen = useCallback(async () => {
        setIsStatisticModalVisible(true);
    }, [])


    const maxTotalCount = useMemo(() => {
        const maxPrayed = prayedData.reduce((max, curr) =>
                curr.count > max.count ? curr : max,
            { count: 0 } as PrayerStatistic
        ).count;

        const maxUnprayed = unprayedData.reduce((max, curr) =>
                curr.count > max.count ? curr : max,
            { count: 0 } as PrayerStatistic
        ).count;

        return maxPrayed + maxUnprayed;
    }, [prayedData, unprayedData]);

    const calculateProportionalBarWidth = useCallback((value: number) => {
        return 290 * (value / maxTotalCount);
    }, [maxTotalCount]);



    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.containerHeader}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isStatisticModalVisible && <StatisticsDatePickerModal onClose={onStatisticModalClose}
                                                                   setFromDateString={setFromDateString}
                                                                   setToDateString={setToDateString}
                />}
            <Text style={styles.containerHeader}>Gebete Statistik</Text>
            <View style={ styles.statisticFilterContainer}>
                <Text style={ styles.statisticFilterText}>Zeitraum: {fromDateString} - {toDateString}</Text>
                <View style={styles.statisticFilterImageBackground}>
                    <Pressable onPress={onStatisticModalOpen}>
                        <Image style={styles.statisticFilterImage} source={require('../../assets/images/filterIcon.png')}></Image>
                    </Pressable>
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
                        <View style={[styles.chartYLineMorningValue, { width: calculateProportionalBarWidth(prayedData[0] ? prayedData[0].count : 0) }]}>
                            <Text style={styles.prayedDaysText}>{prayedData[0] ? prayedData[0].count : 0}</Text>
                            <View style={styles.chartYLineMorningTargetValue}>
                                <Text style={styles.targetText}>{maxTotalCount}T</Text>
                            </View>
                        </View>
                        <View style={[styles.chartYLineNoonValue, { width: calculateProportionalBarWidth(prayedData[1] ? prayedData[1].count : 0) }]}>
                            <Text style={styles.prayedDaysText}>{prayedData[1] ? prayedData[1].count : 0}</Text>
                            <View style={styles.chartYLineNoonTargetValue}>
                                <Text style={styles.targetText}>{maxTotalCount}T</Text>
                            </View>
                        </View>
                        <View style={[styles.chartYLineAfternoonValue, { width: calculateProportionalBarWidth(prayedData[2] ? prayedData[2].count : 0) }]}>
                            <Text style={styles.prayedDaysText}>{prayedData[2] ? prayedData[2].count : 0}</Text>
                            <View style={styles.chartYLineAfternoonTargetValue}>
                                <Text style={styles.targetText}>{maxTotalCount}T</Text>
                            </View>
                        </View>
                        <View style={[styles.chartYLineEveningValue, { width: calculateProportionalBarWidth(prayedData[3] ? prayedData[3].count : 0) }]}>
                            <Text style={styles.prayedDaysText}>{prayedData[3] ? prayedData[3].count : 0}</Text>
                            <View style={styles.chartYLineEveningTargetValue}>
                                <Text style={styles.targetText}>{maxTotalCount}T</Text>
                            </View>
                        </View>
                        <View style={[styles.chartYLineNightValue, { width: calculateProportionalBarWidth(prayedData[4] ? prayedData[4].count : 0) }]}>
                            <Text style={styles.prayedDaysText}>{prayedData[4] ? prayedData[4].count : 0}</Text>
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