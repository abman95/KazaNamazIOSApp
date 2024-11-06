import { ImageSourcePropType } from 'react-native';

export interface PrayerTimeIcons {
    morning: ImageSourcePropType;
    noon: ImageSourcePropType;
    afternoon: ImageSourcePropType;
    evening: ImageSourcePropType;
    night: ImageSourcePropType;
}

export interface PrayerTimesProps {
    prayersImage: ImageSourcePropType | string;
    prayersTime: string;
}

interface currentAndNextPrayersProperties {
    currentPrayerImage: ImageSourcePropType | string;
    nextPrayerImage: ImageSourcePropType | string;
    currentPrayerTime: number;
    nextPrayerTime: number;
    nextPrayerName: string;
    currentPrayerName: string;
}

export interface currentAndNextPrayersPropertiesProps {
    currentAndNextPrayersProperties: currentAndNextPrayersProperties;
    currentTime: number;
}

export interface PrayerStyles {
    selectedOptionTextColor: {
        color: string;
    };
}

export interface PrayerStatusResult {
    selectedOption: string;
    showPicker: () => void;
    options: string[];
}