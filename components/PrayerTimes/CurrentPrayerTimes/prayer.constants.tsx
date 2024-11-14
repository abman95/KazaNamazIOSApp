// src/constants/prayer.constants.ts
import {PrayerOption, PrayerTimes } from '@/types/prayer.types'


export const PRAYER_OPTIONS: PrayerOption[] = ['Nicht verrichtet', 'verrichtet', 'Abbrechen'];

export const INITIAL_PRAYER_TIMES: PrayerTimes = {
    remainingPrayerTime: '00:00:00',
    currentPrayerTime: '00:00:00',
    nextPrayerTime: '00:00:00',
};