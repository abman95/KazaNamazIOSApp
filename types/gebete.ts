import { ImageSourcePropType } from 'react-native';

export interface PrayerTimeIcons {
    morning: ImageSourcePropType;
    noon: ImageSourcePropType;
    afternoon: ImageSourcePropType;
    evening: ImageSourcePropType;
    night: ImageSourcePropType;
}

export interface PrayerTimesProps {
    prayersImage: ImageSourcePropType;
    prayersTime: string;
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