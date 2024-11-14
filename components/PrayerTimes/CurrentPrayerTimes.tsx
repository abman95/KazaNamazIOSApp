// src/components/prayers/EditPrayerTimes.tsx
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import styles from '@/components/PrayerTimes/CurrentPrayerTimes/styles/styles';
import { PrayerProps, PrayerStatus } from '@/types/prayer.types';
import { usePrayerStatus } from '@/components/PrayerTimes/CurrentPrayerTimes/usePrayerStatus';
import { useTimeCalculation } from '@/components/PrayerTimes/CurrentPrayerTimes/useTimeCalculation';
import DatabaseService from '@/database/database';
import { CurrentPrayer } from '@/components/PrayerTimes/CurrentPrayerTimes/CurrentPrayer';
import { NextPrayer } from './CurrentPrayerTimes/NextPrayer';

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

    useEffect(() => {
        const initAndLoad = async () => {
            try {
                setIsLoading(true);
                await databaseService.initializeDatabase();
                const status = await databaseService.getPrayerStatus(
                    currentDate,
                    currentAndNextPrayersProperties.currentPrayerName
                );
                alert(status)
                setSelectedOption(status as PrayerStatus);
            } catch (error) {
                console.error('Error initializing and loading prayer status:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAndLoad();
    }, [currentDate, currentAndNextPrayersProperties.currentPrayerName]);

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