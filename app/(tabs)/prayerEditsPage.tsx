import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet, Dimensions, ImageStyle } from 'react-native';
import { EditPrayerTimes, CACHED_IMAGES } from '@/components/PrayerTimes/EditPrayerTimes';
import { DatePicker } from '@/components/DatePicker/DatePicker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

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
    AlleGebete: string;
    Morgen: string;
    Mittag: string;
    Nachmittag: string;
    Abend: string;
    Nacht: string;
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
    AlleGebete: "0",
    Morgen: "0",
    Mittag: "0",
    Nachmittag: "0",
    Abend: "0",
    Nacht: "0",
};

type LocationConfig = {
    name: string;
    latitude: string;
    longitude: string;
};

type MethodConfig = {
    id: string;
    name: string;
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

const getImageForPrayer = (prayer: PrayerTime): keyof typeof CACHED_IMAGES => {
    const imageMap: Record<PrayerTime, keyof typeof CACHED_IMAGES> = {
        'AlleGebete': 'allPrayers',
        'Morgen': 'morning',
        'Mittag': 'noon',
        'Nachmittag': 'afternoon',
        'Abend': 'evening',
        'Nacht': 'night',
    };
    return imageMap[prayer];
};


const convertTimeToSeconds = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
};

const API_URL = 'https://api.aladhan.com/v1/timings';

export default function PrayerEditsPage(): JSX.Element {
    const [prayerUpdate, setPrayerUpdate] = useState<PrayerUpdate>({ value: 0, timestamp: Date.now() });
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimesType>(DEFAULT_PRAYER_TIMES);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [formattedSelectedDate, setFormattedSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
    const [selectedMethod, setSelectedMethod] = useState(DEFAULT_METHOD);
    const [isInitialized, setIsInitialized] = useState(false);
    // Neuer State für globales Update
    const [globalUpdateTrigger, setGlobalUpdateTrigger] = useState(0);

    const prevSelectedCountry = useRef<LocationConfig | null>(null);
    const prevSelectedMethod = useRef<MethodConfig | null>(null);
    const prevSelectedDate = useRef<Date | null>(null);

    // Bestehende Logik bleibt gleich...
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
            setFormattedSelectedDate(formattedDate);
            const response = await fetch(
                `${API_URL}/${formattedDate}?latitude=${selectedCountry.latitude}&longitude=${selectedCountry.longitude}&method=${selectedMethod.id}&timezonestring=Europe/Berlin`
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data: ApiResponse = await response.json();

            const newPrayerTimes: PrayerTimesType = {
                AlleGebete: "0",
                Morgen: convertTimeToSeconds(data.data.timings.Fajr),
                Mittag: convertTimeToSeconds(data.data.timings.Dhuhr),
                Nachmittag: convertTimeToSeconds(data.data.timings.Asr),
                Abend: convertTimeToSeconds(data.data.timings.Maghrib),
                Nacht: convertTimeToSeconds(data.data.timings.Isha),
            };

            setPrayerTimes(newPrayerTimes);
            setPrayerUpdate(prev => ({ value: prev.value + 1, timestamp: Date.now() }));
            setIsInitialized(true);
        } catch (error) {
            alert('Ein Abfragefehler ist aufgetreten. Bitte versuche es noch einmal');
            console.error('Fehler beim Laden der Gebetszeiten:', error);
            setPrayerTimes(DEFAULT_PRAYER_TIMES);
        }
    }, []);

    // Modifizierter setPrayerUpdate Handler
    const handlePrayerUpdate = useCallback((update: PrayerUpdate) => {
        setPrayerUpdate(update);
        setGlobalUpdateTrigger(prev => prev + 1);
    }, []);

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
                    JSON.stringify(selectedMethod) !== JSON.stringify(prevSelectedMethod.current) ||
                    JSON.stringify(selectedDate) !== JSON.stringify(prevSelectedDate.current)
                ) {
                    void fetchPrayerTimes(selectedDate, selectedCountry, selectedMethod);
                    prevSelectedCountry.current = selectedCountry;
                    prevSelectedMethod.current = selectedMethod;
                    prevSelectedDate.current = selectedDate;
                }
            }, 500);

            return () => clearTimeout(delayedFetchPrayerTimes);
        }
    }, [selectedDate, selectedCountry, selectedMethod, isInitialized]);

    const handleDateChange = useCallback((newDate: Date): void => {
        setSelectedDate(newDate);
    }, []);

    if (!isInitialized) {
        return (
            <View style={styles.container}>
                <Text style={styles.containerHeader}>Lade...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.containerHeader}>Gebete Übersicht</Text>
            <DatePicker selectedCountry={selectedCountry} setDate={handleDateChange} />
            <View style={styles.prayersContainer}>
                {PRAYER_TIMES.map((prayer) => (
                    <EditPrayerTimes
                        key={`${prayer}-${prayerUpdate.timestamp}`}
                        prayerTimes={prayerTimes[prayer]}
                        prayersTimeName={prayer}
                        prayersImage={getImageForPrayer(prayer)}
                        setPrayerUpdate={prayer === "AlleGebete" ? handlePrayerUpdate : undefined}
                        formattedSelectedDate={formattedSelectedDate}
                        globalUpdateTrigger={globalUpdateTrigger}
                    />
                ))}
            </View>
        </View>
    );
}

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