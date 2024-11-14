// src/hooks/useTimeCalculation.ts
import { useMemo } from 'react';
import { PrayerProperties, PrayerTimes } from '@/types/prayer.types';
import { formatTime, calculateTimeComponents } from '@/components/PrayerTimes/CurrentPrayerTimes/time.utils';

export const useTimeCalculation = (
    currentTime: number,
    properties: PrayerProperties
): PrayerTimes => {
    return useMemo(() => {
        const { currentPrayerName, currentPrayerTime, nextPrayerTime } = properties;
        let timeRemaining = 0;

        if (currentPrayerName === 'Nachtgebet' && nextPrayerTime) {
            timeRemaining = nextPrayerTime - currentTime;
            if (timeRemaining < 0) {
                timeRemaining += 24 * 3600;
            }
        } else if (nextPrayerTime) {
            timeRemaining = nextPrayerTime - currentTime;
        }

        timeRemaining = Math.max(0, timeRemaining);
        const { hours, minutes, secs } = calculateTimeComponents(timeRemaining);

        return {
            remainingPrayerTime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
            currentPrayerTime: formatTime(Math.floor(currentPrayerTime / 3600), Math.floor((currentPrayerTime % 3600) / 60)),
            nextPrayerTime: formatTime(Math.floor(nextPrayerTime / 3600), Math.floor((nextPrayerTime % 3600) / 60)),
        };
    }, [currentTime, properties]);
};