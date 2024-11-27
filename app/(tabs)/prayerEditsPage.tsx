import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { EditPrayerTimes } from '@/components/PrayerTimes/EditPrayerTimes';
import { DatePicker } from '@/components/DatePicker/DatePicker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import {EditPrayerTimesImages} from "@/components/PrayerTimes/EditPrayerTimes/EditPrayerTimesImages";
import {formattedDate} from "@/constants/formattedDate";


// Constants
const PRAYER_TIMES = ['AlleGebete', 'Morgen', 'Mittag', 'Nachmittag', 'Abend', 'Nacht'] as const;

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
    name: "0",
    latitude: "0",
    longitude: "0",
};

const DEFAULT_METHOD: MethodConfig = {
    id: "0",
    name: "0",
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
    const [formattedSelectedDate, setFormattedSelectedDate] = useState<string>(formattedDate(new Date()));
    const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
    const [selectedMethod, setSelectedMethod] = useState(DEFAULT_METHOD);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isInitialPrayerEntry, setIsInitialPrayerEntry] = useState(false);

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

            const formattedDateString = formattedDate(date);
            setFormattedSelectedDate(formattedDateString);
            const response = await fetch(
                `${API_URL}/${formattedDateString}?latitude=${selectedCountry.latitude}&longitude=${selectedCountry.longitude}&method=${selectedMethod.id}&timezonestring=Europe/Berlin`
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
                    <>
                    <EditPrayerTimesImages
                        key = {prayer}
                        prayersImage={prayer}
                    />
                    <EditPrayerTimes
                        key={`${prayer}-${prayerUpdate.timestamp}`}
                        prayerTimes={prayerTimes[prayer]}
                        prayersTimeName={prayer}
                        setPrayerUpdate={prayer === "AlleGebete" ? handlePrayerUpdate : undefined}
                        formattedSelectedDate={formattedSelectedDate}
                        globalUpdateTrigger={globalUpdateTrigger}
                        isInitialPrayerEntry={isInitialPrayerEntry}
                        setIsInitialPrayerEntry={setIsInitialPrayerEntry}
                    />
                    </>
                ))}
            </View>
        </View>
    );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    containerHeader: {
        marginTop: 70,
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '400',
        color: 'white',
    },
    prayersContainer: {
        height: height,
        width: width,
        marginTop: 30,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});