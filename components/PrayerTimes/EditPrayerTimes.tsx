import React, {useEffect, useCallback, memo, useState} from 'react';
import {useFocusEffect} from "@react-navigation/native";
import {
    TextStyle,
    Text,
    View,
    StyleSheet,
    ActionSheetIOS,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import DatabaseService from "@/database/database";

const databaseService = new DatabaseService();

export const CACHED_IMAGES = {
    allPrayers: require('../../assets/images/allPrayerTimesImageCube.png'),
    morning: require('../../assets/images/morgenGebet.jpg'),
    noon: require('../../assets/images/mittagGebet.jpg'),
    afternoon: require('../../assets/images/nachmittagGebet.jpg'),
    evening: require('../../assets/images/abendGebet.jpg'),
    night: require('../../assets/images/nachtGebet.jpg'),
} as const;

interface PrayerTimesProps {
    prayersImage: keyof typeof CACHED_IMAGES;
    prayersTimeName: string;
    prayerTimes: string;
    setPrayerUpdate?: (update: { value: number; timestamp: number }) => void;
    formattedSelectedDate: string;
    globalUpdateTrigger?: number;
}

const OPTIONS = ['offen', 'erledigt', 'Abbrechen'] as const;
const CANCEL_INDEX = 2;

export const EditPrayerTimes = memo(function EditPrayerTimes({
                                                                 prayerTimes,
                                                                 prayersTimeName,
                                                                 prayersImage,
                                                                 setPrayerUpdate,
                                                                 formattedSelectedDate,
                                                                 globalUpdateTrigger
                                                             }: PrayerTimesProps) {
    const [selectedOption, setSelectedOption] = useState<string>();
    const [isLoading, setIsLoading] = useState(true);


    const initAndLoad = useCallback(async () => {
        try {
            setIsLoading(true);
            await databaseService.initializeDatabase();
            const status = await databaseService.getPrayerStatus(
                formattedSelectedDate,
                prayersTimeName,
            );
            setSelectedOption(status);
        } catch (error) {
            console.error('Error initializing and loading prayer status:', error);
        } finally {
            setIsLoading(false);
        }
    }, [formattedSelectedDate, prayersTimeName]);

    useEffect(() => {
        if (globalUpdateTrigger !== undefined) {
            void initAndLoad();
        }
    }, [globalUpdateTrigger, initAndLoad]);

    useFocusEffect(
        useCallback(() => {
            void initAndLoad();
        }, [initAndLoad])
    );

    const addNamaz = useCallback(async (currentDate: string, prayerName: string, status: string) => {
        try {
            await databaseService.initializeDatabase();

            if (prayerName === "AlleGebete") {
                const prayerTypes = ["Morgen", "Mittag", "Nachmittag", "Abend", "Nacht"];
                await Promise.all(prayerTypes.map(type =>
                    databaseService.addKazaNamaz(currentDate, type, status)
                ));

                setSelectedOption(status);

                if (setPrayerUpdate) {
                    setPrayerUpdate({
                        value: Date.now(),
                        timestamp: Date.now()
                    });
                }
            } else {
                await databaseService.addKazaNamaz(currentDate, prayerName, status);
                setSelectedOption(status);
            }
        } catch (error) {
            console.error('Error saving prayer status:', error);
            throw error;
        }
    }, [setPrayerUpdate]);

    const handlePress = useCallback(({formattedSelectedDate, prayersTimeName}: {
        formattedSelectedDate: string;
        prayersTimeName: string;
    }) => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: OPTIONS,
                cancelButtonIndex: CANCEL_INDEX,
            },
            async (buttonIndex: number) => {
                if (buttonIndex !== CANCEL_INDEX) {
                    const selectedStatus = OPTIONS[buttonIndex];
                    await addNamaz(formattedSelectedDate, prayersTimeName, selectedStatus);
                }
            }
        );
    }, [addNamaz]);

    if (isLoading) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    const imageSource = CACHED_IMAGES[prayersImage];
    return (
        <View>
            <TouchableOpacity
                onPress={() => handlePress({ formattedSelectedDate, prayersTimeName })}
                activeOpacity={0.7}
            >
                <View>
                    <View style={styles.overlayContainer}>

                            <>
                            {prayersTimeName !== 'AlleGebete' && (
                                <Text style={styles.prayersTimes}>
                                    {prayerTimes} Uhr
                                </Text>
                            )}
                                <Text style={styles.selectedOptionText}>
                                    {prayersTimeName === 'AlleGebete'
                                        ? ''
                                        : selectedOption
                                            ? selectedOption
                                            : 'Kein Eintrag'}
                                </Text>

                            </>

                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}, (prevProps, nextProps) => {
    return prevProps.formattedSelectedDate === nextProps.formattedSelectedDate &&
        prevProps.prayersTimeName === nextProps.prayersTimeName &&
        prevProps.globalUpdateTrigger === nextProps.globalUpdateTrigger;
});

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlayContainer: {
        position: "absolute",
        textAlign: "center",
        top: 0,
        right: 20,
        borderRadius: 10,
        height: width * 0.4,
        width: width * 0.4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    prayersTimes: {
        fontSize: 27,
        fontWeight: '100',
        color: 'white',
    },
    selectedOptionText: {
        textAlignVertical: "bottom",
        textAlign: "center",
        marginHorizontal: 10,
        paddingTop: 130,
        top: 0,
        position: 'absolute',
        color: 'white',
        fontSize: 18,
        fontWeight: '100',
        height: width * 0.4,
        width: width * 0.4,

    } as TextStyle,
});