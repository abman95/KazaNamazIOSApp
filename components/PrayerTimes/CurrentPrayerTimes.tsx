import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ActionSheetIOS,
    TouchableOpacity,
    Image,
    ViewStyle,
    TextStyle,
    ImageStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageSourcePropType } from 'react-native'; // Importiere den richtigen Typ für Bilder

// Typen
type PrayerStatus = 'Nicht verrichtet' | 'verrichtet';
type PrayerOption = PrayerStatus | 'Abbrechen';

interface PrayerTimes {
    remainingPrayerTime: string;
    currentPrayerTime: string;
    nextPrayerTime: string;
}

interface PrayerProps {
    currentAndNextPrayersProperties: {
        currentPrayerName: string;
        nextPrayerName: string;
        currentPrayerTime: number;
        nextPrayerTime: number;
        currentPrayerImage: ImageSourcePropType; // Verwende ImageSourcePropType statt any
        nextPrayerImage: ImageSourcePropType; // Verwende ImageSourcePropType statt any
    };
    currentTime: number;
}

// Konstanten
const PRAYER_OPTIONS: PrayerOption[] = ['Nicht verrichtet', 'verrichtet', 'Abbrechen'];
const INITIAL_PRAYER_TIMES: PrayerTimes = {
    remainingPrayerTime: '00:00:00',
    currentPrayerTime: '00:00:00',
    nextPrayerTime: '00:00:00',
};

// Helper Funktionen
const formatTime = (hours: number, minutes: number): string => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const calculateTimeComponents = (seconds: number): { hours: number; minutes: number; secs: number } => {
    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    return { hours, minutes, secs };
};

// Custom Hooks
const usePrayerStatus = () => {
    const [selectedOption, setSelectedOption] = useState<PrayerStatus>('Nicht verrichtet');

    const showPicker = useCallback(() => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: PRAYER_OPTIONS,
                cancelButtonIndex: 2,
            },
            (buttonIndex: number) => {
                if (buttonIndex !== 2) {
                    setSelectedOption(PRAYER_OPTIONS[buttonIndex] as PrayerStatus);
                }
            }
        );
    }, []);

    return { selectedOption, showPicker };
};

const useTimeCalculation = (
    currentTime: number,
    currentAndNextPrayersProperties: PrayerProps['currentAndNextPrayersProperties']
): PrayerTimes => {
    return useMemo(() => {
        const { currentPrayerName, currentPrayerTime, nextPrayerTime } = currentAndNextPrayersProperties;
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
    }, [currentTime, currentAndNextPrayersProperties]);
};

// Hauptkomponente
export default function PrayerTimes({ currentAndNextPrayersProperties, currentTime }: PrayerProps): JSX.Element {
    const { selectedOption, showPicker } = usePrayerStatus();
    const prayerTimes = useTimeCalculation(currentTime, currentAndNextPrayersProperties);

    return (
        <View style={styles.container}>
            <CurrentPrayer
                selectedOption={selectedOption}
                showPicker={showPicker}
                prayerTimes={prayerTimes}
                currentPrayerProps={currentAndNextPrayersProperties}
            />
            <NextPrayer
                nextPrayerImage={currentAndNextPrayersProperties.nextPrayerImage}
                nextPrayerName={currentAndNextPrayersProperties.nextPrayerName}
                nextPrayerTime={prayerTimes.nextPrayerTime}
            />
        </View>
    );
}

// Unterkomponenten
interface CurrentPrayerProps {
    selectedOption: PrayerStatus;
    showPicker: () => void;
    prayerTimes: PrayerTimes;
    currentPrayerProps: PrayerProps['currentAndNextPrayersProperties'];
}

const CurrentPrayer: React.FC<CurrentPrayerProps> = ({
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
            <TouchableOpacity style={styles.optionSelector} onPress={showPicker}>
                <Image style={styles.editImage} source={require('../../assets/images/edit1.png')} />
            </TouchableOpacity>
        </LinearGradient>
        <Image style={styles.arrowIcon} source={require('../../assets/images/arrow.png')} />
    </View>
);

interface NextPrayerProps {
    nextPrayerImage: ImageSourcePropType; // Verwende ImageSourcePropType statt any
    nextPrayerName: string;
    nextPrayerTime: string;
}

const NextPrayer: React.FC<NextPrayerProps> = ({ nextPrayerImage, nextPrayerName, nextPrayerTime }) => (
    <View style={styles.nextPrayerContainer}>
        <Image source={nextPrayerImage} style={styles.nextPrayerImage} />
        <Text style={styles.nextPrayersTimeText}>
            {nextPrayerName}: {nextPrayerTime} Uhr
        </Text>
    </View>
);

// Styles
const styles = StyleSheet.create({
    container: {
        padding: 2,
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    } as ViewStyle,
    containerHeader: {
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '400',
        color: 'white',
    } as TextStyle,
    remainingPrayerTime: {
        marginTop: 5,
        color: 'white',
        fontSize: 20,
        fontWeight: '100',
    } as TextStyle,
    prayersImage: {
        marginTop: 20,
        width: 190,
        height: 190,
        borderRadius: 60,
    } as ImageStyle,
    prayersTimeText: {
        marginTop: 15,
        textAlign: 'center',
        fontSize: 19,
        fontWeight: '200',
        color: 'white',
    } as TextStyle,
    currentPrayerContainer: {
        alignItems: 'center',
    } as ViewStyle,
    linearGradientContainer: {
        margin: 20,
        borderColor: 'white',
        borderWidth: 0.5,
        display: 'flex',
        flexDirection: 'row',
        width: 200,
        height: 50.5,
        borderRadius: 10,
    } as ViewStyle,
    selectedOptionText: {
        marginTop: 15,
        textAlign: 'center',
        width: '80%',
        height: 50.5,
        fontSize: 15,
        fontWeight: '300',
    } as TextStyle,
    optionSelector: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        width: 50,
        height: 50.5,
        position: 'absolute',
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'solid',
        backgroundColor: 'white',
    } as ViewStyle,
    editImage: {
        width: 20,
        height: 20,
        tintColor: 'black',
    } as ImageStyle,
    arrowIcon: {
        marginTop: 10,
        width: 40,
        height: 40,
        tintColor: '#ffffff',
        opacity: 0.25,
    } as ImageStyle,
    nextPrayerContainer: {
        marginTop: -20,
        flex: 0.75,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        opacity: 0.3,
    } as ViewStyle,
    nextPrayerImage: {
        width: 140,
        height: 140,
        borderRadius: 140,
        marginBottom: 10,
    } as ImageStyle,
    nextPrayersTimeText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '200',
        marginBottom: 10,
    } as TextStyle,
});