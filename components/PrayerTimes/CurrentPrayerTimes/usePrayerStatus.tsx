// src/hooks/usePrayerStatus.ts
import {useState, useCallback} from 'react';
import {Alert} from 'react-native';
import DatabaseService from '@/database/database';
import {
    CANCEL_TEXT_VALUE,
    PRAYER_OPTIONS,
    PRAYER_STATUS
} from '@/components/PrayerTimes/CurrentPrayerTimes/prayer.constants';
import {convertPrayerName} from "@/components/PrayerTimes/CurrentPrayerTimes/convertPrayerName";
import {formattedDate} from "@/constants/formattedDate";


const databaseService = new DatabaseService();

export const usePrayerStatus = () => {
    const [selectedOption, setSelectedOption] = useState<string>('');

    const addNamaz = useCallback(async (currentDate: string, prayerName: string, status: string) => {
        try {
            const prayerNameTrimmed = convertPrayerName(prayerName);

            await databaseService.initializeDatabase();
            await databaseService.addKazaNamaz(
                currentDate,
                prayerNameTrimmed,
                status
            );

            setTimeout(async () => {
                const status = await databaseService.getPrayerStatus(
                    currentDate,
                    prayerNameTrimmed
                );
                setSelectedOption(status);
            }, 500);
        } catch (error) {
            console.error('Error saving prayer status:', error);
            throw error;
        }
    }, []);

    const showPicker = useCallback(async (currentDate: Date, currentPrayerName: string) => {
        Alert.alert(
            PRAYER_STATUS,
            '',
            [
                ...PRAYER_OPTIONS.slice(0, 2).map((option) => ({
                    text: option,
                    onPress: async () => {
                        const newStatus = option as string;
                        setSelectedOption(newStatus);
                        try {
                            const formattedDateString = formattedDate(currentDate);
                            await addNamaz(formattedDateString, currentPrayerName, newStatus);
                        } catch (error) {
                            console.error('Error saving prayer status:', error);
                            setSelectedOption(selectedOption);
                        }
                    }
                })),
                {
                    text: CANCEL_TEXT_VALUE,
                    style: 'cancel',
                    onPress: () => {}
                }
            ]
        );
    }, [selectedOption, addNamaz]);

    return { selectedOption, setSelectedOption, showPicker };
};