// src/hooks/usePrayerStatus.ts
import { useState, useCallback } from 'react';
import {ActionSheetIOS, Alert} from 'react-native';
import DatabaseService from '@/database/database';
import { PrayerStatus, PrayerOption } from '@/types/prayer.types';
import { PRAYER_OPTIONS } from '@/components/PrayerTimes/CurrentPrayerTimes/prayer.constants';

const databaseService = new DatabaseService();

export const usePrayerStatus = () => {
    const [selectedOption, setSelectedOption] = useState<PrayerStatus>('Nicht verrichtet');

    const addNamaz = useCallback(async (currentDate: string, prayerName: string, status: string) => {
        try {
            await databaseService.initializeDatabase();
            await databaseService.addKazaNamaz(
                currentDate,
                prayerName,
                status === 'verrichtet' ? 'erledigt' : 'offen'
            );
            alert('Prayer status saved successfully');
            console.log('Prayer status saved successfully');
        } catch (error) {
            console.error('Error saving prayer status:', error);
            throw error;
        }
    }, []);

    const showPicker = useCallback(async (currentDate: Date, currentPrayerName: string) => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: PRAYER_OPTIONS,
                cancelButtonIndex: 2,
            },
            async (buttonIndex: number) => {
                if (buttonIndex !== 2) {
                    const newStatus = PRAYER_OPTIONS[buttonIndex] as PrayerStatus;
                    setSelectedOption(newStatus);
                    try {
                        const formattedDate = currentDate.toISOString().split('T')[0];
                        await addNamaz(formattedDate, currentPrayerName, newStatus);
                    } catch (error) {
                        console.error('Error saving prayer status:', error);
                        setSelectedOption(selectedOption);
                    }
                }
            }
        );
    }, [selectedOption, addNamaz]);

    return { selectedOption, setSelectedOption, showPicker };
};