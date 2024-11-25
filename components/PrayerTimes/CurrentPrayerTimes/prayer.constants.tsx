// src/constants/prayer.constants.ts
import {PrayerOption, PrayerStatus, PrayerTimes} from '@/types/prayer.types'

export const PRAYER_STATUS: string = "Wähle ein Gebetsstatus";

export const PRAYER_OPTIONS: PrayerStatus[] = ['offen', 'erledigt'];
export const CANCEL_TEXT_VALUE: PrayerOption = "Abbrechen";


export const INITIAL_PRAYER_TIMES: PrayerTimes = {
    remainingPrayerTime: '00:00:00',
    currentPrayerTime: '00:00:00',
    nextPrayerTime: '00:00:00',
};