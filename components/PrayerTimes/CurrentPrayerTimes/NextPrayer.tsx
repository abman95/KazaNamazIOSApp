// src/components/prayers/NextPrayer.tsx
import React from 'react';
import { View, Text, Image } from 'react-native';
import { ImageSourcePropType } from 'react-native';
import styles from '@/components/PrayerTimes/CurrentPrayerTimes/styles/styles';


const IMAGES = {
    Morgengebet: require('../../../assets/images/morgenGebet.jpg'),
    Mittagsgebet: require('../../../assets/images/mittagGebet.jpg'),
    Nachmittagsgebet: require('../../../assets/images/nachmittagGebet.jpg'),
    Abendgebet: require('../../../assets/images/abendGebet.jpg'),
    Nachtgebet: require('../../../assets/images/nachtGebet.jpg'),
} as const;


interface NextPrayerProps {
    nextPrayerName: string;
    nextPrayerTime: string;
}

export const NextPrayer: React.FC<NextPrayerProps> = ({
                                                          nextPrayerName,
                                                          nextPrayerTime
                                                      }) => (
    <View style={styles.nextPrayerContainer}>
        <Image source={IMAGES[nextPrayerName as keyof typeof IMAGES]} style={styles.nextPrayerImage} />
        <Text style={styles.nextPrayersTimeText}>
            {nextPrayerName}: {nextPrayerTime} Uhr
        </Text>
    </View>
);