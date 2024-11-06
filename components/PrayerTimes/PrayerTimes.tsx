import React, { useEffect, useCallback, memo } from 'react';
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
} from 'react-native';

interface PrayerTimesProps {
    prayersImage: ImageSourcePropType;
    prayersTime: string;
    setAllPrayerTriggerValue?: number;
}

const OPTIONS = ['Nicht verrichtet', 'verrichtet', 'Abbrechen'] as const;
const INITIAL_OPTION = OPTIONS[0];
const CANCEL_INDEX = 2;

const PrayerTimes: React.FC<PrayerTimesProps> = ({
                                                     prayersImage,
                                                     prayersTime,
                                                     setAllPrayerTriggerValue = 0
                                                 }) => {

    const [selectedOption, setSelectedOption] = React.useState(INITIAL_OPTION);

    const handlePress = useCallback(() => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: OPTIONS,
                cancelButtonIndex: CANCEL_INDEX,
            },
            (buttonIndex: number) => {
                if (buttonIndex !== CANCEL_INDEX) {
                    setSelectedOption(OPTIONS[buttonIndex]);
                }
            }
        );
    }, []);

    useEffect(() => {
        if (setAllPrayerTriggerValue !== undefined) {
            setSelectedOption(OPTIONS[setAllPrayerTriggerValue]);
        }
    }, [setAllPrayerTriggerValue]);


    return (
        <View style={styles.container}>
            <Image
                source={prayersImage}
                style={styles.prayersImage}
            />
            <Text style={[
                styles.selectedOptionText,
                { color: 'white' }
            ]}>
                {prayersTime}: {selectedOption}
            </Text>
            <TouchableOpacity
                style={styles.optionSelector}
                onPress={handlePress}
                activeOpacity={0.7}
            >
                <Image
                    style={styles.editImage}
                    source={require('../../assets/images/edit1.png')}
                />
            </TouchableOpacity>
        </View>
    );
};

export default memo(PrayerTimes);


const styles = StyleSheet.create({
    container: {
        padding: 10,
        height: 70,
        width: '100%',
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    } as ViewStyle,
    prayersImage: {
        width: 90,
        height: 90,
        borderRadius: 10,
    } as ImageStyle,
    prayersTimeText: {
        marginTop: 5,
        textAlign: "center",
        fontSize: 15,
        fontWeight: "100",
        color: "white",
    } as TextStyle,
    selectedOptionText: {
        flex: 4/4,
        textAlign: "left",
        fontSize: 16,
        fontWeight: "200",
        marginLeft: 20,
    } as TextStyle,
    optionSelector: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "white",
        width: 50,
        height: 50.5,
        position: "absolute",
        right: 10,
        alignItems: "center",
        justifyContent: "center",
        borderStyle: "solid",
        backgroundColor: "white"
    } as ViewStyle,
    editImage: {
        width: 20,
        height: 20,
        tintColor: "black",
    } as ImageStyle,
});