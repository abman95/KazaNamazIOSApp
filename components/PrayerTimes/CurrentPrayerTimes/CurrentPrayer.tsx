// src/components/prayers/CurrentPrayer.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '@/components/PrayerTimes/CurrentPrayerTimes/styles/styles';
import { PrayerStatus, PrayerTimes, PrayerProperties } from '@/types/prayer.types';

interface CurrentPrayerProps {
    selectedOption: PrayerStatus;
    showPicker: (currentDate: Date, currentPrayerName: string) => Promise<void>;
    prayerTimes: PrayerTimes;
    currentPrayerProps: PrayerProperties;
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
        <Image source={currentPrayerProps.currentPrayerImage} style={styles.prayersImage} />
        <Text style={styles.prayersTimeText}>
            {currentPrayerProps.currentPrayerName}: {prayerTimes.currentPrayerTime} Uhr
        </Text>
        <LinearGradient colors={['#000000']} style={styles.linearGradientContainer}>
            <Text style={[styles.selectedOptionText, { color: 'white' }]}>{selectedOption}</Text>
            <TouchableOpacity
                style={styles.optionSelector}
                onPress={() => showPicker(currentPrayerProps.currentDate, currentPrayerProps.currentPrayerName)}
            >
                <Image style={styles.editImage} source={require('@/assets/images/edit1.png')} />
            </TouchableOpacity>
        </LinearGradient>
        <Image style={styles.arrowIcon} source={require('@/assets/images/arrow.png')} />
    </View>
);
