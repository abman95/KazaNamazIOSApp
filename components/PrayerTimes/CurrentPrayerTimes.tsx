import React, {useEffect, useState} from 'react';
import {Text,
    View,
    StyleSheet,
    ActionSheetIOS,
    TouchableOpacity,
    Image,
    ViewStyle,
    TextStyle,
    ImageStyle,
} from 'react-native';
import {
    PrayerStyles,
    PrayerStatusResult,
    currentAndNextPrayersPropertiesProps,
} from '@/types/gebete';
import { LinearGradient } from 'expo-linear-gradient';




// Verwendung des Interface als Return Type
const usePrayerStatus = (): PrayerStatusResult => {
    const options: string[] = ["Nicht verrichtet", "verrichtet", "Abbrechen"];
    const [selectedOption, setSelectedOption] = React.useState<string>(options[0]);

    const showPicker = React.useCallback((): void => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: options,
                cancelButtonIndex: 2,
            },
            (buttonIndex: number): void => {
                if (buttonIndex !== 2) {
                    setSelectedOption(options[buttonIndex]);
                }
            }
        );
    }, []);

    return {
        selectedOption,
        showPicker,
        options
    };
};





const usePrayerStyles = (selectedOption: string): PrayerStyles => {
    return React.useMemo(
        () => ({
            selectedOptionTextColor: {
                color: selectedOption === "Nicht verrichtet" ? "white" : "white"
            }
        }), [selectedOption]
    );
};

 type PrayerTimes = {
     remainingPrayerTime: string,
     currentPrayerTime: string,
     nextPrayerTime: string,
}


export default function PrayerTimes({ currentAndNextPrayersProperties, currentTime }: currentAndNextPrayersPropertiesProps): JSX.Element {
    const { selectedOption, showPicker } = usePrayerStatus();
    const dynamicStyles = usePrayerStyles(selectedOption);
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes>({
        remainingPrayerTime: "00:00:00",
        currentPrayerTime: "00:00:00",
        nextPrayerTime: "00:00:00"
    });

    const formatTimeRemaining = (
        timeRemaining: number,
        currentPrayerTime: number,
        nextPrayerTime: number
    ): PrayerTimes => {
        if (timeRemaining < 0) timeRemaining = 0;

        // Berechnung der Stunden, Minuten und Sekunden für timeRemaining
        const hours = Math.floor(timeRemaining / 3600);
        const remainingSeconds = timeRemaining % 3600;
        const minutes = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;

        // Formatierung mit führenden Nullen für timeRemaining
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = secs.toString().padStart(2, '0');

        // Formatierung der currentPrayerTime
        const currentHours = Math.floor(currentPrayerTime / 3600);
        const currentMinutes = Math.floor((currentPrayerTime % 3600) / 60);
        const formattedCurrentTime = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;

        // Formatierung der nextPrayerTime
        const nextHours = Math.floor(nextPrayerTime / 3600);
        const nextMinutes = Math.floor((nextPrayerTime % 3600) / 60);
        const formattedNextTime = `${nextHours.toString().padStart(2, '0')}:${nextMinutes.toString().padStart(2, '0')}`;

        return {
            remainingPrayerTime: `${formattedHours}:${formattedMinutes}:${formattedSeconds}`,
            currentPrayerTime: formattedCurrentTime,
            nextPrayerTime: formattedNextTime
        };
    };

    useEffect(() => {
        if (currentAndNextPrayersProperties?.nextPrayerTime) {
            const timeRemaining = currentAndNextPrayersProperties.nextPrayerTime - currentTime;
            setPrayerTimes(
                formatTimeRemaining(
                    timeRemaining,
                    currentAndNextPrayersProperties.currentPrayerTime,
                    currentAndNextPrayersProperties.nextPrayerTime
                )
            );
        }
    }, [currentTime, currentAndNextPrayersProperties]);

    return (
        <View style={styles.container}>
            <View style={styles.currentPrayerContainer}>


                <Text style={styles.containerHeader}>Aktuelle Gebetszeit:</Text>
                <Text style={styles.remainingPrayerTime}>{prayerTimes.remainingPrayerTime} verbleibend</Text>

                <Image source={currentAndNextPrayersProperties.currentPrayerImage} style={styles.prayersImage} />
                <Text style={styles.prayersTimeText}>{currentAndNextPrayersProperties.currentPrayerName}: {prayerTimes.currentPrayerTime} Uhr</Text>
                <LinearGradient
                    colors={['#000000']} // Von tiefem Schwarz zu leichtem Grau
                    style={styles.linearGradientContainer}
                >
            <Text
                style={[
                    styles.selectedOptionText,
                    dynamicStyles.selectedOptionTextColor
                ]}
            >
                {selectedOption}
            </Text>
            <TouchableOpacity
                style={styles.optionSelector}
                onPress={showPicker}
            >
                <Image style={styles.editImage} source={require('../../assets/images/edit1.png')}/>
            </TouchableOpacity>
                </LinearGradient>
                <Image style={styles.arrowIcon}  source={require('../../assets/images/arrow.png')}/>
            </View>
            <View style={styles.nextPrayerContainer}>
                    <Image
                        source={currentAndNextPrayersProperties.nextPrayerImage}
                        style={styles.nextPrayerImage}
                    />
                    <Text style={styles.nextPrayersTimeText}>{currentAndNextPrayersProperties.nextPrayerName}: {prayerTimes.nextPrayerTime} Uhr</Text>
            </View>
        </View>
    );
}

// Styles mit React Native Style Types
const styles = StyleSheet.create({
    container: {
        padding: 2,
        height: "100%",
        width: '100%',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    } as ViewStyle,
    containerHeader: {
        textAlign: 'center',
        fontSize: 28,
        fontWeight: "400",
        color: 'white'
    },
    remainingPrayerTime: {
        marginTop: 5,
        color: 'white',
        fontSize: 20,
        fontWeight: '100'
    },
    prayersImage: {
        marginTop: 20,
        width: 190,
        height: 190,
        borderRadius: 60,
    } as ImageStyle,
    prayersTimeText: {
        marginTop: 15,
        textAlign: "center",
        fontSize: 19,
        fontWeight: "200",
        color: "white",
    } as TextStyle,
    currentPrayerContainer: {
        alignItems: "center",
    },
    linearGradientContainer: {
        margin: 20,
        borderColor: "white",
        borderWidth: 0.5,
        display: "flex",
        flexDirection: "row",
        width: 200,
        height: 50.5,
        borderRadius: 10,
    },
    selectedOptionText: {
        marginTop: 15,
        textAlign: "center",
        width: "80%",
        height: 50.5,
        fontSize: 15,
        fontWeight: '300',
    } as TextStyle,
    optionSelector: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "white",
        // borderLeftColor: "grey",
        width: 50,
        height: 50.5,
        position: "absolute",
        right: 0,
        alignItems: "center",
        justifyContent: "center",
        borderStyle: "solid",
        backgroundColor: "white"
    } as ViewStyle,
    editImage: {
        width: 20,
        height: 20,
        tintColor: "black",
    } as TextStyle,
    arrowIcon: {
        marginTop: 10,
        width: 40,
        height: 40,
        tintColor: "#ffffff",
        opacity: 0.25,
    },
    nextPrayerContainer: {
        marginTop: -20,
        flex: 3 /4,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        opacity: 0.3,
    },
    nextPrayerImage: {
        width: 140,
        height: 140,
        borderRadius: 140,
        marginBottom: 10,
    },
    nextPrayersTimeText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '200',
        marginBottom: 10,
    },
});