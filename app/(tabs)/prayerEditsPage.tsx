import React, {useCallback, useEffect, useState} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import PrayerTimes from "@/components/PrayerTimes/PrayerTimes";
import DatePicker from "@/components/PrayerTimes/DatePicker";
import { ActionSheetIOS } from 'react-native';
import {PrayerTimesProps} from "@/types/gebete";

const PRAYER_TIMES = ['Morgen', 'Mittag', 'Nachmittag', 'Abend', 'Nacht'] as const;
type PrayerTime = typeof PRAYER_TIMES[number];

const IMAGES = {
    morning: require('../../assets/images/morgenGebet.jpg'),
    noon: require('../../assets/images/mittagGebet.jpg'),
    afternoon: require('../../assets/images/nachmittagGebet.jpg'),
    evening: require('../../assets/images/abendGebet.jpg'),
    night: require('../../assets/images/nachtGebet.jpg'),
} as const;

const ACTION_SHEET_OPTIONS = ["Nicht verrichtet", "verrichtet", "Abbrechen"] as const;

type PrayerTimesType = Record<'Morgen' | 'Mittag' | 'Nachmittag' | 'Abend' | 'Nacht', number>;

const DEFAULT_PRAYER_TIMES: PrayerTimesType = {
    Morgen: 0,
    Mittag: 0,
    Nachmittag: 0,
    Abend: 0,
    Nacht: 0,
};

const API_URL = 'https://api.aladhan.com/v1/timings';
const LOCATION = { latitude: 53.075878, longitude: 8.807311 };


export default function PrayerEditsPage(): JSX.Element {
    // States
    const [prayerUpdate, setPrayerUpdate] = useState({ value: 0, timestamp: Date.now() });
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimesType>(DEFAULT_PRAYER_TIMES);
    const [timeInSeconds, setTimeInSeconds] = useState(0);


    const calculateTimeInSeconds = () => {
        const now = new Date();
        return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    };

    const fetchPrayerTimes = useCallback(async () => {
        try {
            const today = new Date();
            console.log(today)
            const formattedDate = today.toISOString().split('T')[0];
            const response = await fetch(
                `${API_URL}/${formattedDate}?latitude=${LOCATION.latitude}&longitude=${LOCATION.longitude}&method=3&timezonestring=Europe/Berlin`
            );
            const data = await response.json();

            const convertTimeToSeconds = (time: string) => {
                const [hours, minutes] = time.split(":").map(Number);
                return hours * 3600 + minutes * 60;
            };

            setPrayerTimes({
                Morgen: convertTimeToSeconds(data.data.timings.Fajr),
                Mittag: convertTimeToSeconds(data.data.timings.Dhuhr),
                Nachmittag: convertTimeToSeconds(data.data.timings.Asr),
                Abend: convertTimeToSeconds(data.data.timings.Maghrib),
                Nacht: convertTimeToSeconds(data.data.timings.Isha),
            });
            setPrayerUpdate({ value: prayerUpdate.value + 1, timestamp: Date.now() });
        } catch (error) {
            console.error('Fehler beim Laden der Gebetszeiten:', error);
            setPrayerTimes(DEFAULT_PRAYER_TIMES);
        }
    }, []);

    useEffect(() => {
        setTimeInSeconds(calculateTimeInSeconds());
        const timeInterval = setInterval(() => {
            const newTimeInSeconds = calculateTimeInSeconds();
            setTimeInSeconds(newTimeInSeconds);
        }, 1000);
        return () => clearInterval(timeInterval);
    }, []);

    useEffect(() => {
        fetchPrayerTimes();
        console.log(prayerTimes)
    }, []);

    const showPicker = useCallback(() => {
        return new Promise<void>((resolve) => {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ACTION_SHEET_OPTIONS,
                    cancelButtonIndex: 2,
                },
                (buttonIndex: number) => {
                    if (buttonIndex !== 2) {
                        setPrayerUpdate({ value: buttonIndex, timestamp: Date.now() });
                    }
                    resolve();
                }
            );
        });
    }, []);

    const getImageForPrayer = (prayer: PrayerTime) => {
        const imageMap: Record<PrayerTime, typeof IMAGES[keyof typeof IMAGES]> = {
            'Morgen': IMAGES.morning,
            'Mittag': IMAGES.noon,
            'Nachmittag': IMAGES.afternoon,
            'Abend': IMAGES.evening,
            'Nacht': IMAGES.night,
        };
        return imageMap[prayer];
    };

    return (
        <View style={styles.container}>
            <Text style={styles.containerHeader}>Gebete Übersicht</Text>
            <DatePicker />

            <View style={styles.editAllPrayersContainer}>
                {/*<Text style={styles.editAllPrayersDescription}>*/}
                {/*</Text>*/}
                <Image style={styles.editAllPrayersImage } source={require('../../assets/images/allPrayerTimesImage.png')}/>
                <TouchableOpacity
                    style={styles.optionSelector}
                    onPress={showPicker}
                >
                    <Image
                        style={styles.editImage}
                        source={require('../../assets/images/edit1.png')}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.prayersContainer}>
                {PRAYER_TIMES.map(prayer => (
                    // prayerTimes[prayer] < timeInSeconds ? (
                        prayerTimes[prayer] < 85000 ? (
                        <PrayerTimes
                            key={`${prayer}-${prayerUpdate.timestamp}`}
                            prayersTime={prayer}
                            prayersImage={getImageForPrayer(prayer)}
                            setAllPrayerTriggerValue={prayerUpdate.value}
                        />
                    ) : null
                ))}
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
        marginTop: 70,
        textAlign: 'center',
        fontSize: 30,
        fontWeight: "bold",
        color: 'white'
    },
    editAllPrayersContainer: {
        marginTop: -5,
        padding: 10,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    editAllPrayersDescription: {
        color: "white",
        fontSize: 17,
        fontWeight: "300",
    },
    editAllPrayersImage: {
        borderRadius: 5,
        width: 310,
        height: 50,
        objectFit: "cover",
    },
    prayersContainer: {
        marginTop: 15,
        gap: 30,
    },
    optionSelector: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "white",
        width: 50,
        height: 50.5,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white"
    },
    editImage: {
        width: 20,
        height: 20,
        tintColor: "black",
    }
});