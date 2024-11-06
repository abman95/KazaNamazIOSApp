import React, {useEffect} from 'react';
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
import { PrayerTimesProps, PrayerStyles, PrayerStatusResult } from '@/types/gebete';




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
                color: selectedOption === "Nicht verrichtet" ? "red" : "green"
            }
        }), [selectedOption]
    );
};


export default function PrayerTimes({ prayersImage, prayersTime }: PrayerTimesProps): JSX.Element {
    const { selectedOption, showPicker } = usePrayerStatus();
    const dynamicStyles = usePrayerStyles(selectedOption);


    useEffect(() => {
        fetch(`https://api.aladhan.com/v1/timings/2024-11-05?latitude=53.075878&longitude=8.807311&method=3&timezonestring=Europe/Berlin`)
            .then(response => response.json())
            .then(data => {
                console.log(data.data.timings);
                // Process the prayer times data here
            })
            .catch(error => console.error(error));
    }, []);


    return (
        <View style={styles.container}>
            <View>
                <Image source={prayersImage} style={styles.prayersImage} />
                <Text style={styles.prayersTimeText}>{prayersTime}:</Text>
            </View>
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
                <Text style={styles.buttonText}>ändern</Text>
            </TouchableOpacity>
        </View>
    );
}

// Styles mit React Native Style Types
const styles = StyleSheet.create({
    container: {
        padding: 20,
        height: 90,
        width: '100%',
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    } as ViewStyle,
    prayersImage: {
        width: 80,
        height: 80,
        borderRadius: 80,
    } as ImageStyle,
    prayersTimeText: {
        marginTop: 5,
        textAlign: "center",
        fontSize: 15,
        fontWeight: "100",
        color: "white",
    } as TextStyle,
    selectedOptionText: {
        flex: 2/4,
        textAlign: "center",
        fontSize: 15,
    } as TextStyle,
    optionSelector: {
        flex: 1.5/4,
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        width: 100,
        fontSize: 15,
        backgroundColor: "white",
        borderRadius: 5,
    } as ViewStyle,
    buttonText: {
        alignItems: "center",
        fontSize: 15,
        color: "black",
    } as TextStyle
});