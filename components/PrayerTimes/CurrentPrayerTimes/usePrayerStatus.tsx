// src/hooks/usePrayerStatus.ts
import {useState, useCallback, useRef} from 'react';
import {ActionSheetIOS, Alert} from 'react-native';
import DatabaseService from '@/database/database';
import { PRAYER_OPTIONS } from '@/components/PrayerTimes/CurrentPrayerTimes/prayer.constants';
import {convertPrayerName} from "@/components/PrayerTimes/CurrentPrayerTimes/convertPrayerName";
import {useFocusEffect} from "@react-navigation/native";
import {string} from "prop-types";

const databaseService = new DatabaseService();

const formattedDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export const usePrayerStatus = () => {
    const [selectedOption, setSelectedOption] = useState<string>('');

    const addNamaz = useCallback(async (currentDate: string, prayerName: string, status: string) => {
        try {
            // Konvertiere den Gebetsnamen
            const prayerNameTrimmed = convertPrayerName(prayerName);

            // Speichere den Eintrag mit dem konvertierten Gebetsnamen
            await databaseService.initializeDatabase();
            await databaseService.addKazaNamaz(
                currentDate,
                prayerNameTrimmed,
                status
            );

            alert('Prayer status saved successfully');
            console.log('Prayer status saved successfully');

            // Verzögerung von 0,5 Sekunden (500 ms), bevor der neue Status abgerufen wird
            setTimeout(async () => {
                const status = await databaseService.getPrayerStatus(
                    currentDate,
                    prayerNameTrimmed
                );
                setSelectedOption(status);  // Setze den neuen Status
            }, 500); // Verzögerung von 0,5 Sekunden
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
                    const newStatus = PRAYER_OPTIONS[buttonIndex] as string;
                    setSelectedOption(newStatus);
                    try {
                        const formattedDateString = formattedDate(currentDate);
                        await addNamaz(formattedDateString, currentPrayerName, newStatus);
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