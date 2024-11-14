import React, {useCallback, useEffect, useRef, useState} from 'react';
import { Text, View, StyleSheet, ImageSourcePropType } from 'react-native';
import CurrentPrayerTimes from "@/components/PrayerTimes/CurrentPrayerTimes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";

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
    currentDate: Date,
}

interface LocationConfig {
    name: string;
    latitude: string;
    longitude: string;
}

interface MethodConfig {
    id: string;
    name: string;
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

const DEFAULT_COUNTRY: LocationConfig = {
    name: "Bremen",
    latitude: "53.075878",
    longitude: "8.807311",
};

const DEFAULT_METHOD: MethodConfig = {
    id: "13",
    name: "Diyanet İşleri Başkanlığı, Turkey",
};

const API_URL = 'https://api.aladhan.com/v1/timings';

export default function PrayerEditsPage(): JSX.Element {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimesType>(DEFAULT_PRAYER_TIMES);
    const [timeInSeconds, setTimeInSeconds] = useState<number>(0);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [selectedCountry, setSelectedCountry] = useState<LocationConfig>(DEFAULT_COUNTRY);
    const [selectedMethod, setSelectedMethod] = useState<MethodConfig>(DEFAULT_METHOD);
    const [isInitialized, setIsInitialized] = useState(false);

    const prevSelectedCountry = useRef<LocationConfig | null>(null);
    const prevSelectedMethod = useRef<MethodConfig | null>(null);

    const convertTimeToSeconds = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60;
    };

    const calculateTimeInSeconds = (): number => {
        const now = new Date();
        return Math.floor((now.getTime() - new Date(now).setHours(0, 0, 0, 0)) / 1000);
    };

    const loadInitialData = useCallback(async () => {
        try {
            const [countryJson, methodJson] = await Promise.all([
                AsyncStorage.getItem('selectedCountry'),
                AsyncStorage.getItem('selectedMethod')
            ]);

            if (countryJson) {
                const parsedCountry = JSON.parse(countryJson);
                console.log('Loaded country from storage:', parsedCountry);
                setSelectedCountry(parsedCountry);
            }

            if (methodJson) {
                const parsedMethod = JSON.parse(methodJson);
                console.log('Loaded method from storage:', parsedMethod);
                setSelectedMethod(parsedMethod);
            }
            setIsInitialized(true);
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }, []);

    const fetchPrayerTimes = useCallback(async (date: Date, selectedCountry: LocationConfig, selectedMethod: MethodConfig): Promise<void> => {
        if (!selectedCountry || !selectedMethod) {
            console.log('Missing required data for API call:', { selectedCountry, selectedMethod });
            return;
        }
        try {
            console.log('Fetching prayer times with:', {
                country: selectedCountry,
                method: selectedMethod,
                date: date
            });

            const formattedDate = date.toISOString().split('T')[0];
            const response = await fetch(
                `${API_URL}/${formattedDate}?latitude=${selectedCountry.latitude}&longitude=${selectedCountry.longitude}&method=${selectedMethod.id}&timezonestring=Europe/Berlin`
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data: ApiResponse = await response.json();

            setPrayerTimes({
                morning: data.data.timings.Fajr,
                noon: data.data.timings.Dhuhr,
                afternoon: data.data.timings.Asr,
                evening: data.data.timings.Maghrib,
                night: data.data.timings.Isha
            });
            setIsInitialized(true);
        } catch (error) {
            console.error('Fehler beim Laden der Gebetszeiten:', error);
            setPrayerTimes(DEFAULT_PRAYER_TIMES);
        }
    }, []);

    const getPrayerTime = useCallback((): PrayerTimeResult => {
        if (Object.values(prayerTimes).some(time => time === "0")) {
            return {
                currentPrayerImage: IMAGES.morning,
                nextPrayerImage: IMAGES.noon,
                currentPrayerTime: 0,
                nextPrayerTime: 0,
                nextPrayerName: 'Laden...',
                currentPrayerName: 'Laden...',
                currentDate: currentDate,
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
            currentDate: currentDate,
        };
    }, [prayerTimes, timeInSeconds, currentDate]);

    useFocusEffect(
        useCallback(() => {
            void loadInitialData();

            return () => {
            };
        }, [])
    );

    useEffect(() => {
        if (isInitialized) {
            const delayedFetchPrayerTimes = setTimeout(() => {
                if (
                    JSON.stringify(selectedCountry) !== JSON.stringify(prevSelectedCountry.current) ||
                    JSON.stringify(selectedMethod) !== JSON.stringify(prevSelectedMethod.current)
                ) {
                    void fetchPrayerTimes(currentDate, selectedCountry, selectedMethod);
                    prevSelectedCountry.current = selectedCountry;
                    prevSelectedMethod.current = selectedMethod;
                }
            }, 500); // 500ms Verzögerung

            return () => clearTimeout(delayedFetchPrayerTimes);
        }
    }, [selectedCountry, selectedMethod, isInitialized]);

    useEffect(() => {
        const timeInterval = setInterval(() => {
            setTimeInSeconds(calculateTimeInSeconds());
        }, 1000);

        const dateCheckInterval = setInterval(() => {
            const now = new Date();
            if (now.getDate() !== currentDate.getDate()) {
                setCurrentDate(now);
            }
        }, 60000);

        return () => {
            clearInterval(timeInterval);
            clearInterval(dateCheckInterval);
        };
    }, [currentDate]);

    const formatDate = (date: Date): string => {
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    };

    if (!isInitialized) {
        return (
            <View style={styles.container}>
                <Text style={styles.currentDate}>Laden...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.currentDate}>
                {selectedCountry.name}, Deutschland - {currentDate ? formatDate(currentDate) : "Datum wird geladen..."}
            </Text>
            <View style={styles.prayersContainer}>
                <CurrentPrayerTimes
                    currentAndNextPrayersProperties={getPrayerTime()}
                    currentTime={timeInSeconds}
                />
            </View>
        </View>
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

export type { PrayerTimeResult, PrayerTimesType, PrayerTimeKey };