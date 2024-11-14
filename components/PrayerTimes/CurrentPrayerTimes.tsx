// src/components/prayers/EditPrayerTimes.tsx
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, Alert} from 'react-native';
import styles from '@/components/PrayerTimes/CurrentPrayerTimes/styles/styles';
import { PrayerProps } from '@/types/prayer.types';
import { usePrayerStatus } from '@/components/PrayerTimes/CurrentPrayerTimes/usePrayerStatus';
import { useTimeCalculation } from '@/components/PrayerTimes/CurrentPrayerTimes/useTimeCalculation';
import DatabaseService from '@/database/database';
import { CurrentPrayer } from '@/components/PrayerTimes/CurrentPrayerTimes/CurrentPrayer';
import { NextPrayer } from './CurrentPrayerTimes/NextPrayer';
import {convertPrayerName} from "@/components/PrayerTimes/CurrentPrayerTimes/convertPrayerName";
import {useFocusEffect} from "@react-navigation/native";

const databaseService = new DatabaseService();

export const CurrentPrayerTimes: React.FC<PrayerProps> = ({
                                                       currentAndNextPrayersProperties,
                                                       currentTime
                                                   }) => {
    const [isLoading, setIsLoading] = useState(true);
    const { selectedOption, setSelectedOption, showPicker } = usePrayerStatus();
    const prayerTimes = useTimeCalculation(currentTime, currentAndNextPrayersProperties);
    const [currentDate] = useState<string>(
        currentAndNextPrayersProperties.currentDate.toISOString().split('T')[0]
    );
    const prevSelectedOption = useRef<string | null>(null);

    const initAndLoad = useCallback(async () => {
        try {
            setIsLoading(true);
            await databaseService.initializeDatabase();

            // Konvertiere den Gebetsnamen
            const prayerNameTrimmed = convertPrayerName(currentAndNextPrayersProperties.currentPrayerName);

            // Lade den Status mit dem konvertierten Gebetsnamen
            const status = await databaseService.getPrayerStatus(
                currentDate,
                prayerNameTrimmed
            );

            setSelectedOption(status as string);
        } catch (error) {
            console.error('Error initializing and loading prayer status:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentDate, currentAndNextPrayersProperties.currentPrayerName]); // Abhängigkeiten, um sicherzustellen, dass die Funktion aktualisiert wird, wenn sich die Daten ändern

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
            {/*<Text style={{color: "white", fontSize: 50}}>TEST</Text>*/}
            <CurrentPrayer
                selectedOption={selectedOption}
                showPicker={showPicker}
                prayerTimes={prayerTimes}
                currentPrayerProps={currentAndNextPrayersProperties}
            />
            <NextPrayer
                nextPrayerImage={currentAndNextPrayersProperties.nextPrayerImage}
                nextPrayerName={currentAndNextPrayersProperties.nextPrayerName}
                nextPrayerTime={prayerTimes.nextPrayerTime}
            />
        </View>
    );
};

export default CurrentPrayerTimes;