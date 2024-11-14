// src/types/prayer.types.ts
import { ImageSourcePropType } from 'react-native';

export type PrayerStatus = 'offen' | 'erledigt';
export type PrayerOption = PrayerStatus | 'Abbrechen';

export interface PrayerTimes {
    remainingPrayerTime: string;
    currentPrayerTime: string;
    nextPrayerTime: string;
}

export interface PrayerProperties {
    currentPrayerName: string;
    nextPrayerName: string;
    currentPrayerTime: number;
    nextPrayerTime: number;
    currentPrayerImage: ImageSourcePropType;
    nextPrayerImage: ImageSourcePropType;
    currentDate: Date;

}

export interface PrayerProps {
    currentAndNextPrayersProperties: PrayerProperties;
    currentTime: number;
}