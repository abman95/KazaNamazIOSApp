// src/hooks/usePrayerStatus.ts
import {useState, useCallback, useRef} from 'react';
import {ActionSheetIOS, Alert} from 'react-native';
import DatabaseService from '@/database/database';
import { PRAYER_OPTIONS } from '@/components/PrayerTimes/CurrentPrayerTimes/prayer.constants';
import {convertPrayerName} from "@/components/PrayerTimes/CurrentPrayerTimes/convertPrayerName";
import {useFocusEffect} from "@react-navigation/native";

const databaseService = new DatabaseService();

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