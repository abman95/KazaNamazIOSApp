import React, {useEffect, useCallback, memo, useState} from 'react';
import {useFocusEffect} from "@react-navigation/native";
import {
    ViewStyle,
    ImageStyle,
    TextStyle,
    Text,
    View,
    StyleSheet,
    ActionSheetIOS,
    TouchableOpacity,
    Image,
    type ImageSourcePropType,
    Dimensions,
} from 'react-native';
import DatabaseService from "@/database/database";

const databaseService = new DatabaseService();

// Vorab geladene und zwischengespeicherte Bilder
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
            initAndLoad();
        }
    }, [globalUpdateTrigger, initAndLoad]);

    useFocusEffect(
        useCallback(() => {
            initAndLoad();
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
            <View style={styles.container}>
                <Text style={styles.containerHeader}>Loading...</Text>
            </View>
        );
    }

    // Verwende zwischengespeichertes Bild
    const imageSource = CACHED_IMAGES[prayersImage];

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => handlePress({ formattedSelectedDate, prayersTimeName })}
                activeOpacity={0.7}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={imageSource}
                        style={styles.prayersImage}
                        defaultSource={imageSource}
                    />
                    <View style={styles.overlayContainer}>
                        <Text style={styles.prayersTimeName}>{prayersTimeName}</Text>
                        {prayersTimeName !== 'AlleGebete' && (
                            <>
                                <Text style={styles.prayersTimes}>
                                    {prayerTimes} Uhr
                                </Text>
                                <Text style={styles.selectedOptionText}>
                                    {selectedOption || 'Noch nicht gesetzt'}
                                </Text>
                            </>
                        )}
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
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        height: width * 0.5,
        width: width * 0.5,
        position: 'relative',
    } as ViewStyle,
    containerHeader: {
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '400',
        color: 'white',
    } as TextStyle,
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
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
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