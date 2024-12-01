// src/types/prayer.types.ts
export type PrayerStatus = 'offen' | 'erledigt';
export type PrayerOption = 'Abbrechen';

export interface PrayerTimes {
    remainingPrayerTimeNumberSecs: number;
    remainingPrayerTimeString: string;
    currentPrayerTime: string;
    nextPrayerTime: string;
}

export interface PrayerProperties {
    currentPrayerName: string;
    nextPrayerName: string;
    currentPrayerTime: number;
    nextPrayerTime: number;
    currentDate: Date;

}

export interface PrayerProps {
    currentAndNextPrayersProperties: PrayerProperties;
    currentTime: number;
}