import React, { useEffect, useCallback, memo, useMemo } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ActionSheetIOS,
    TouchableOpacity,
    Image,
    type ImageSourcePropType,
    type ViewStyle,
    type TextStyle,
    type ImageStyle,
    Dimensions,
} from 'react-native';

// Typen für Props
interface PrayerTimesProps {
    prayersImage: ImageSourcePropType;
    prayersTimeName: string;
    prayerTimes: number;
    setAllPrayerTriggerValue?: number;
    setPrayerUpdate?: (update: { value: number; timestamp: number }) => void;
}

// Optionen für das ActionSheet
const OPTIONS = ['Nicht verrichtet', 'verrichtet', 'Abbrechen'] as const;
const INITIAL_OPTION = OPTIONS[0];
const CANCEL_INDEX = 2;

export const PrayerTimes: React.FC<PrayerTimesProps> = ({
                                                            prayerTimes,
                                                            prayersTimeName,
                                                            prayersImage,
                                                            setAllPrayerTriggerValue = 0,
                                                            setPrayerUpdate,
                                                        }) => {
    // Zustand für die Auswahl
    const [selectedOption, setSelectedOption] = React.useState(INITIAL_OPTION);

    // Handle für das ActionSheet
    const handlePress = useCallback(() => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: OPTIONS,
                cancelButtonIndex: CANCEL_INDEX,
            },
            (buttonIndex: number) => {
                if (buttonIndex !== CANCEL_INDEX) {
                    if (setPrayerUpdate) {
                        setPrayerUpdate({ value: buttonIndex, timestamp: Date.now() });
                    } else {
                        setSelectedOption(OPTIONS[buttonIndex]);
                    }
                }
            }
        );
    }, [setPrayerUpdate]);

    // Effekt zum Aktualisieren der Option, wenn `setAllPrayerTriggerValue` gesetzt wird
    useEffect(() => {
        if (setAllPrayerTriggerValue !== undefined) {
            setSelectedOption(OPTIONS[setAllPrayerTriggerValue]);
        }
    }, [setAllPrayerTriggerValue]);

    // Umrechnung von Sekunden in Stunden:Minuten:Sekunden
    const convertPrayerSecondsToTime = useMemo(() => {
        const hours = Math.floor(prayerTimes / 3600);
        const remainingSeconds = prayerTimes % 3600;
        const minutes = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        return { hours, minutes, secs };
    }, [prayerTimes]);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
                <View style={styles.imageContainer}>
                    <Image source={prayersImage} style={styles.prayersImage} />
                    <View style={styles.overlayContainer}>
                        <Text style={styles.prayersTimeName}>{prayersTimeName}</Text>
                        {prayersTimeName !== 'AlleGebete' && (
                            <>
                                <Text style={styles.prayersTimes}>
                                    {convertPrayerSecondsToTime.hours}:{convertPrayerSecondsToTime.minutes} Uhr
                                </Text>
                                <Text style={styles.selectedOptionText}>{selectedOption}</Text>
                            </>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default memo(PrayerTimes);

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        height: width * 0.5,
        width: width * 0.5,
        position: 'relative',
    } as ViewStyle,
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    prayersImage: {
        height: width * 0.4,
        width: width * 0.4,
        borderRadius: 10,
    } as ImageStyle,
    overlayContainer: {
        padding: 5,
        borderRadius: 10,
        position: 'absolute',
        top: 0,
        left: 0,
        height: width * 0.4,
        width: width * 0.4,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Halbtransparenter schwarzer Hintergrund
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    prayersTimeName: {
        fontSize: 20,
        fontWeight: '300',
        color: 'white',
    },
    prayersTimes: {
        fontSize: 27,
        fontWeight: '100',
        color: 'white',
    },
    selectedOptionText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '100',
        textAlign: 'center',
    } as TextStyle,
});
