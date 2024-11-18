import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '@/components/PrayerTimes/CurrentPrayerTimes/styles/styles';
import { PrayerStatus, PrayerTimes } from '@/types/prayer.types';

const IMAGES = {
    Morgengebet: require('../../../assets/images/morgenGebet.jpg'),
    Mittagsgebet: require('../../../assets/images/mittagGebet.jpg'),
    Nachmittagsgebet: require('../../../assets/images/nachmittagGebet.jpg'),
    Abendgebet: require('../../../assets/images/abendGebet.jpg'),
    Nachtgebet: require('../../../assets/images/nachtGebet.jpg'),
} as const;

type PrayerImageKey = keyof typeof IMAGES;

interface PrayerProperties {
    currentPrayerName: string;
    currentDate: Date;
}

interface CurrentPrayerProps {
    selectedOption: string;
    showPicker: (currentDate: Date, currentPrayerName: string) => Promise<void>;
    prayerTimes: PrayerTimes;
    currentPrayerProps: PrayerProperties;
}

const ICONS = {
    edit: require('@/assets/images/edit1.png'),
    arrow: require('@/assets/images/arrow.png'),
}

export const CurrentPrayer: React.FC<CurrentPrayerProps> = ({
                                                                selectedOption,
                                                                showPicker,
                                                                prayerTimes,
                                                                currentPrayerProps,
                                                            }) => (
    <View style={styles.currentPrayerContainer}>
        <Text style={styles.containerHeader}>Aktuelle Gebetszeit:</Text>
        <Text style={styles.remainingPrayerTime}>{prayerTimes.remainingPrayerTime} verbleibend</Text>
        <Image
            source={IMAGES[currentPrayerProps.currentPrayerName as keyof typeof IMAGES]}
            style={styles.prayersImage}
        />
        <Text style={styles.prayersTimeText}>
            {currentPrayerProps.currentPrayerName}: {prayerTimes.currentPrayerTime} Uhr
        </Text>
        <LinearGradient colors={['#000000']} style={styles.linearGradientContainer}>
            <Text style={[styles.selectedOptionText, { color: 'white' }]}>{selectedOption}</Text>
            <TouchableOpacity
                style={styles.optionSelector}
                onPress={() => showPicker(currentPrayerProps.currentDate, currentPrayerProps.currentPrayerName)}
            >
                <Image style={styles.editImage} source={ICONS.edit} />
            </TouchableOpacity>
        </LinearGradient>
        <Image style={styles.arrowIcon} source={ICONS.arrow} />
    </View>
);