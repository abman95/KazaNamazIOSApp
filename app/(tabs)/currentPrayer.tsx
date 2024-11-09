import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ImageSourcePropType } from 'react-native';
import CurrentPrayerTimes from "@/components/PrayerTimes/CurrentPrayerTimes";
import { Stack } from 'expo-router';

// Type Definitions
type PrayerTimeKey = 'morning' | 'noon' | 'afternoon' | 'evening' | 'night';
type PrayerTimesType = Record<PrayerTimeKey, string>;
type PrayerImagesType = Record<PrayerTimeKey, ImageSourcePropType>;

interface PrayerInfo {
    name: string;
    image: ImageSourcePropType;
}

interface PrayerConfigItem {
    current: PrayerInfo;
    next: PrayerInfo;
    timeKey: PrayerTimeKey;
    nextTimeKey: PrayerTimeKey;
}

interface PrayerTimeResult {
    currentPrayerImage: ImageSourcePropType;
    nextPrayerImage: ImageSourcePropType;
    currentPrayerTime: number;
    nextPrayerTime: number;
    nextPrayerName: string;
    currentPrayerName: string;
}

interface LocationConfig {
    latitude: number;
    longitude: number;
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

// Constants
const IMAGES: PrayerImagesType = {
    morning: require('../../assets/images/morgenGebet.jpg'),
    noon: require('../../assets/images/mittagGebet.jpg'),
    afternoon: require('../../assets/images/nachmittagGebet.jpg'),
    evening: require('../../assets/images/abendGebet.jpg'),
    night: require('../../assets/images/nachtGebet.jpg'),
} as const;

const PRAYER_CONFIG: readonly PrayerConfigItem[] = [
    {
        current: { name: 'Morgengebet', image: IMAGES.morning },
        next: { name: 'Mittagsgebet', image: IMAGES.noon },
        timeKey: 'morning',
        nextTimeKey: 'noon'
    },
    {
        current: { name: 'Mittagsgebet', image: IMAGES.noon },
        next: { name: 'Nachmittagsgebet', image: IMAGES.afternoon },
        timeKey: 'noon',
        nextTimeKey: 'afternoon'
    },
    {
        current: { name: 'Nachmittagsgebet', image: IMAGES.afternoon },
        next: { name: 'Abendgebet', image: IMAGES.evening },
        timeKey: 'afternoon',
        nextTimeKey: 'evening'
    },
    {
        current: { name: 'Abendgebet', image: IMAGES.evening },
        next: { name: 'Nachtgebet', image: IMAGES.night },
        timeKey: 'evening',
        nextTimeKey: 'night'
    },
    {
        current: { name: 'Nachtgebet', image: IMAGES.night },
        next: { name: 'Morgengebet', image: IMAGES.morning },
        timeKey: 'night',
        nextTimeKey: 'morning'
    },
] as const;

const DEFAULT_PRAYER_TIMES: PrayerTimesType = {
    morning: "0",
    noon: "0",
    afternoon: "0",
    evening: "0",
    night: "0",
};

const API_URL = 'https://api.aladhan.com/v1/timings';
const LOCATION: LocationConfig = { latitude: 53.075878, longitude: 8.807311 };

export default function PrayerEditsPage(): JSX.Element {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimesType>(DEFAULT_PRAYER_TIMES);
    const [timeInSeconds, setTimeInSeconds] = useState<number>(0);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    const convertTimeToSeconds = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60;
    };

    const calculateTimeInSeconds = (): number => {
        const now = new Date();
        return Math.floor((now.getTime() - new Date(now).setHours(0, 0, 0, 0)) / 1000);
    };

    const getPrayerTime = (): PrayerTimeResult => {
        if (Object.values(prayerTimes).some(time => time === "0")) {
            return {
                currentPrayerImage: IMAGES.morning,
                nextPrayerImage: IMAGES.noon,
                currentPrayerTime: 0,
                nextPrayerTime: 0,
                nextPrayerName: 'Laden...',
                currentPrayerName: 'Laden...',
            };
        }

        const prayerTimeInSeconds: Record<PrayerTimeKey, number> = Object.entries(prayerTimes).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: convertTimeToSeconds(value)
        }), {} as Record<PrayerTimeKey, number>);

        const currentConfig = PRAYER_CONFIG.find(config => {
            const currentTime = prayerTimeInSeconds[config.timeKey];
            const nextTime = prayerTimeInSeconds[config.nextTimeKey];
            return timeInSeconds >= currentTime && timeInSeconds < nextTime;
        }) ?? PRAYER_CONFIG[PRAYER_CONFIG.length - 1];

        return {
            currentPrayerImage: currentConfig.current.image,
            nextPrayerImage: currentConfig.next.image,
            currentPrayerTime: prayerTimeInSeconds[currentConfig.timeKey],
            nextPrayerTime: prayerTimeInSeconds[currentConfig.nextTimeKey],
            nextPrayerName: currentConfig.next.name,
            currentPrayerName: currentConfig.current.name,
        };
    };

    const fetchPrayerTimes = async (date: Date): Promise<void> => {
        try {
            const formattedDate = date.toISOString().split('T')[0];
            const response = await fetch(
                `${API_URL}/${formattedDate}?latitude=${LOCATION.latitude}&longitude=${LOCATION.longitude}&method=13&timezonestring=Europe/Berlin`
            );
            const data: ApiResponse = await response.json();

            setPrayerTimes({
                morning: data.data.timings.Fajr,
                noon: data.data.timings.Dhuhr,
                afternoon: data.data.timings.Asr,
                evening: data.data.timings.Maghrib,
                night: data.data.timings.Isha
            });
        } catch (error) {
            console.error(error);
            setPrayerTimes(DEFAULT_PRAYER_TIMES);
        }
    };

    useEffect(() => {
        const timeInterval = setInterval(() => {
            setTimeInSeconds(calculateTimeInSeconds());
        }, 1000);

        return () => clearInterval(timeInterval);
    }, []);

    useEffect(() => {
        fetchPrayerTimes(currentDate);

        const dateCheckInterval = setInterval(() => {
            const now = new Date();
            if (now.getDate() !== currentDate.getDate()) {
                setCurrentDate(now);
                fetchPrayerTimes(now);
            }
        }, 60000);

        return () => clearInterval(dateCheckInterval);
    }, [currentDate]);

    const formatDate = (date: Date): string => {
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    };

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.currentDate}>
                    Bremen, Deutschland - {currentDate ? formatDate(currentDate) : "Datum wird geladen..."}
                </Text>
                <View style={styles.prayersContainer}>
                    <CurrentPrayerTimes
                        currentAndNextPrayersProperties={getPrayerTime()}
                        currentTime={timeInSeconds}
                    />
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    currentDate: {
        marginTop: 70,
        color: "white",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "100",
    },
    prayersContainer: {
        gap: 0,
    }
});

// Exports
export type { PrayerTimeResult, PrayerTimesType, PrayerTimeKey };