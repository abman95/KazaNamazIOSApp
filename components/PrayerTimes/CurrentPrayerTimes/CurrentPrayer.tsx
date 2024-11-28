import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, Pressable} from 'react-native';
import styles from '@/components/PrayerTimes/CurrentPrayerTimes/styles/styles';
import { PrayerTimes } from '@/types/prayer.types';
import {playEzan} from "@/components/ezan/ezan";
import AsyncStorage from "@react-native-async-storage/async-storage";

const IMAGES = {
    Morgengebet: require('../../../assets/images/morgenGebet.jpg'),
    Mittagsgebet: require('../../../assets/images/mittagGebet.jpg'),
    Nachmittagsgebet: require('../../../assets/images/nachmittagGebet.jpg'),
    Abendgebet: require('../../../assets/images/abendGebet.jpg'),
    Nachtgebet: require('../../../assets/images/nachtGebet.jpg'),
} as const;

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

const EZAN_ICONS = {
    mute: require('@/assets/images/mute.png'),
    volume: require('@/assets/images/volume.png'),
}

export const CurrentPrayer: React.FC<CurrentPrayerProps> = ({
                                                                selectedOption,
                                                                showPicker,
                                                                prayerTimes,
                                                                currentPrayerProps,
                                                            }: CurrentPrayerProps) => {

    const [isAudioIcon, setIsAudioIcon] = React.useState<boolean>(false);
    const [isEnabled, setIsEnabled] = useState(false);
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('isEnabled');
                if (jsonValue !== null) {
                    const value = JSON.parse(jsonValue);
                    setIsEnabled(value);
                }
            } catch (e) {
                console.error('Error loading initial data:', e);
            }
        };
        void loadInitialData();
    }, []);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('isAudioIcon');
                if (jsonValue !== null) {
                    const value = JSON.parse(jsonValue);
                    setIsAudioIcon(value);
                }
            } catch (e) {
                console.error('Error loading initial data:', e);
            }
        };
        void loadInitialData();
    }, []);

    const setAudioCallback = useCallback(async () => {
        if(isEnabled) {
            const toggleAudioSwitch = () => {
                const newValue = !isAudioIcon;
                setIsAudioIcon(newValue);

                const storeData = async () => {
                    try {
                        const jsonValue = JSON.stringify(newValue); // Boolean zu JSON-String
                        await AsyncStorage.setItem('isAudioIcon', jsonValue);
                    } catch (e) {
                        console.error('Error saving isEnabled:', e);
                    }
                };
                void storeData();
            }
            void toggleAudioSwitch();
            void playEzan();
        }
     }, [isAudioIcon, isEnabled]);

    useEffect(() => {
        if(Number(prayerTimes.remainingPrayerTime) < 1 && isEnabled) {
            setIsAudioIcon(!isAudioIcon)
            void playEzan();
        }
    }, [prayerTimes.remainingPrayerTime, isEnabled]);

   return ( <View style={styles.currentPrayerContainer}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text style={styles.containerHeader}>Aktuelle Gebetszeit:</Text>
            <Pressable onPress={setAudioCallback} style={ styles.ezanVolumeButton}>
                <Image source={isAudioIcon ? EZAN_ICONS.volume : EZAN_ICONS.mute} style={ styles.ezanVolumeImage }></Image>
            </Pressable>
        </View>
        <Text style={styles.remainingPrayerTime}>{prayerTimes.remainingPrayerTime} verbleibend</Text>
        <Image
            source={IMAGES[currentPrayerProps.currentPrayerName as keyof typeof IMAGES]}
            style={styles.prayersImage}
        />
        <Text style={styles.prayersTimeText}>
            {currentPrayerProps.currentPrayerName}: {prayerTimes.currentPrayerTime} Uhr
        </Text>
        <View style={styles.linearGradientContainer}>
            <Text style={[styles.selectedOptionText, { color: 'white' }]}>{selectedOption}</Text>
            <TouchableOpacity
                style={styles.optionSelector}
                onPress={() => showPicker(currentPrayerProps.currentDate, currentPrayerProps.currentPrayerName)}
            >
                <Image style={styles.editImage} source={ICONS.edit} />
            </TouchableOpacity>
        </View>
        <Image style={styles.arrowIcon} source={ICONS.arrow} />
    </View>

   )
};