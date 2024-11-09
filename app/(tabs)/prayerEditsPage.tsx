import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Dimensions, ImageStyle } from 'react-native';
import { PrayerTimes } from '@/components/PrayerTimes/PrayerTimes';
import { DatePicker } from '@/components/DatePicker/DatePicker';

// Constants
const PRAYER_TIMES = ['AlleGebete', 'Morgen', 'Mittag', 'Nachmittag', 'Abend', 'Nacht'] as const;
type PrayerTime = (typeof PRAYER_TIMES)[number];

interface PrayerImages {
    readonly allPrayers: number;
    readonly morning: number;
    readonly noon: number;
    readonly afternoon: number;
    readonly evening: number;
    readonly night: number;
}

const IMAGES: PrayerImages = {
    allPrayers: require('../../assets/images/allPrayerTimesImageCube.png'),
    morning: require('../../assets/images/morgenGebet.jpg'),
    noon: require('../../assets/images/mittagGebet.jpg'),
    afternoon: require('../../assets/images/nachmittagGebet.jpg'),
    evening: require('../../assets/images/abendGebet.jpg'),
    night: require('../../assets/images/nachtGebet.jpg'),
};

interface PrayerTimesType {
    AlleGebete: number;
    Morgen: number;
    Mittag: number;
    Nachmittag: number;
    Abend: number;
    Nacht: number;
}

interface PrayerUpdate {
    value: number;
    timestamp: number;
}

interface ApiResponse {
    data: {
        timings: {
            Fajr: string;
            Dhuhr: string;
            Asr: string;
            Maghrib: string;
            Isha: string;
        };
    };
}

const DEFAULT_PRAYER_TIMES: PrayerTimesType = {
    AlleGebete: 0,
    Morgen: 0,
    Mittag: 0,
    Nachmittag: 0,
    Abend: 0,
    Nacht: 0,
};

const API_URL = 'https://api.aladhan.com/v1/timings';
const LOCATION = {
    latitude: 53.075878,
    longitude: 8.807311,
} as const;

export default function PrayerEditsPage(): JSX.Element {
    const [prayerUpdate, setPrayerUpdate] = useState<PrayerUpdate>({ value: 0, timestamp: Date.now() });
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimesType>(DEFAULT_PRAYER_TIMES);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const calculateTimeInSeconds = useCallback((): number => {
        const now = new Date();
        return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    }, []);

    const getImageForPrayer = (prayer: PrayerTime): number => {
        const imageMap: Record<PrayerTime, number> = {
            'AlleGebete': IMAGES.allPrayers,
            'Morgen': IMAGES.morning,
            'Mittag': IMAGES.noon,
            'Nachmittag': IMAGES.afternoon,
            'Abend': IMAGES.evening,
            'Nacht': IMAGES.night,
        };
        return imageMap[prayer];
    };

    const convertTimeToSeconds = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60;
    };

    const fetchPrayerTimes = useCallback(async (date: Date): Promise<void> => {
        try {
            const formattedDate = date.toISOString().split('T')[0];
            const response = await fetch(
                `${API_URL}/${formattedDate}?latitude=${LOCATION.latitude}&longitude=${LOCATION.longitude}&method=13&timezonestring=Europe/Berlin`
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data: ApiResponse = await response.json();

            const newPrayerTimes: PrayerTimesType = {
                AlleGebete: 0,
                Morgen: convertTimeToSeconds(data.data.timings.Fajr),
                Mittag: convertTimeToSeconds(data.data.timings.Dhuhr),
                Nachmittag: convertTimeToSeconds(data.data.timings.Asr),
                Abend: convertTimeToSeconds(data.data.timings.Maghrib),
                Nacht: convertTimeToSeconds(data.data.timings.Isha),
            };

            setPrayerTimes(newPrayerTimes);
            setPrayerUpdate(prev => ({ value: prev.value + 1, timestamp: Date.now() }));
        } catch (error) {
            console.error('Fehler beim Laden der Gebetszeiten:', error);
            setPrayerTimes(DEFAULT_PRAYER_TIMES);
        }
    }, []);


    useEffect(() => {
        void fetchPrayerTimes(selectedDate);
    }, [selectedDate, fetchPrayerTimes]);


    const handleDateChange = useCallback((newDate: Date): void => {
        setSelectedDate(newDate);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.containerHeader}>Gebete Übersicht</Text>
            <DatePicker setDate={handleDateChange} />

            <View style={styles.prayersContainer}>
                {PRAYER_TIMES.map((prayer) => (
                    <PrayerTimes
                        key={`${prayer}-${prayerUpdate.timestamp}`}
                        prayerTimes={prayerTimes[prayer]}
                        prayersTimeName={prayer}
                        prayersImage={getImageForPrayer(prayer)}
                        setAllPrayerTriggerValue={prayerUpdate.value}
                        setPrayerUpdate={prayer === "AlleGebete" ? setPrayerUpdate : undefined}
                    />
                ))}
            </View>
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    containerHeader: {
        marginTop: 70,
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
    },
    prayersContainer: {
        marginTop: 30,
        width: width,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    prayersImage: {
        width: width * 0.4,
        height: width * 0.4,
        borderRadius: 10,
    } as ImageStyle,
});