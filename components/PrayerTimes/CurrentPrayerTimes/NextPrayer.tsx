// src/components/prayers/NextPrayer.tsx
import React from 'react';
import { View, Text, Image } from 'react-native';
import { ImageSourcePropType } from 'react-native';
import styles from '@/components/PrayerTimes/CurrentPrayerTimes/styles/styles';

interface NextPrayerProps {
    nextPrayerImage: ImageSourcePropType;
    nextPrayerName: string;
    nextPrayerTime: string;
}

export const NextPrayer: React.FC<NextPrayerProps> = ({
                                                          nextPrayerImage,
                                                          nextPrayerName,
                                                          nextPrayerTime
                                                      }) => (
    <View style={styles.nextPrayerContainer}>
        <Image source={nextPrayerImage} style={styles.nextPrayerImage} />
        <Text style={styles.nextPrayersTimeText}>
            {nextPrayerName}: {nextPrayerTime} Uhr
        </Text>
    </View>
);