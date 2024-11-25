import {Modal, Text, StyleSheet, View, Pressable, Dimensions} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {useCallback, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";
import KazaPrayersModalChildComponent from "@/components/KazaPrayers/components/KazaPrayersModalChildComponent";


const PRAYER_TIMES = ['Morgen', 'Mittag', 'Nachmittag', 'Abend', 'Nacht'] as const;


type KazaNamazModalProps = {
    onClose: () => void;
    maxTotalCount: number;
    onKazaPrayersModalClose: () => void;
    prayerCounts: {
        "Abend": number;
        "Mittag": number;
        "Morgen": number;
        "Nachmittag": number;
        "Nacht": number;
    };
};

export default function KazaPrayersModal({ onClose, maxTotalCount, onKazaPrayersModalClose, prayerCounts}: KazaNamazModalProps) {
    const [internalFromDate, setInternalFromDate] = useState<Date>(new Date());
    const [internalToDate, setInternalToDate] = useState<Date>(new Date());
    const [isfollowUpPrayersButtonCallback, setIsfollowUpPrayersButtonCallback] = useState(false);

    const dateConverter = useCallback((selectedDate: Date) => {
        return selectedDate.toISOString().split('T')[0];
    }, []);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                const fromDateString: string | null = await AsyncStorage.getItem('FromDateString');
                const toDateString: string | null  = await AsyncStorage.getItem('ToDateString');

                setInternalFromDate(new Date(fromDateString));
                setInternalToDate(new Date(toDateString));
            };

            loadData();

            return () => {};
        }, [])
    );

    return (
        <Modal animationType="fade" transparent={true}>
            <View style={styles.modalContent}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Welche Gebete hast du nachgeholt?{maxTotalCount}</Text>
                    <Pressable onPress={onClose}>
                        <MaterialIcons style={styles.titleIcon} name="close" size={35}  />
                    </Pressable>
                </View>
                <View style={ styles.contentContainer }>
                    <Text style={styles.pickedDateText}>{`Gewählter Zeitraum ${dateConverter(internalFromDate)} bis ${dateConverter(internalToDate)}`}</Text>
                        {PRAYER_TIMES.map((prayer) => (
                            <KazaPrayersModalChildComponent
                                key={`${prayer}}`}
                                prayersTimeName={prayer}
                                maxTotalCount={maxTotalCount}
                                prayerCounts={prayerCounts[prayer]}
                                internalFromDate={internalFromDate}
                                isfollowUpPrayersButtonCallback={isfollowUpPrayersButtonCallback}
                                setIsfollowUpPrayersButtonCallback={setIsfollowUpPrayersButtonCallback}
                            ></KazaPrayersModalChildComponent>
                        ))}
                    <Pressable onPress={() => {
                        setIsfollowUpPrayersButtonCallback(true);
                        setTimeout(() => {
                            onKazaPrayersModalClose();
                        }, 200);
                    }}
                               style={({ pressed }) => [
                        pressed ? styles.saveDatesPressed : styles.saveDates
                    ]}
                    >
                        <Text style={ styles.saveDatesText }>Speichern</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
        borderColor: "white",
        borderWidth: 1,
        height: height*.61,
        width: width,
        backgroundColor: "black",
        borderRadius: 10,
        position: "absolute",
        right: 0,
        top: height*.19,
        flexDirection: "column",
    },
    titleContainer: {
        flex: 1.8/8,
        width: width*.99,
        backgroundColor: "black",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
    },
    title: {
        color: "white",
        fontSize: 25,
        marginBottom: 20,
        fontWeight: "700"
    },
    titleIcon: {
        marginBottom: 30,
        color: "white",
    },
    contentContainer: {
        gap: 13,
        flex: 7/8,
        flexDirection: "column",
        paddingLeft: 10,
        paddingRight: 10,
    },
    pickedDateText: {
        textAlign: "center",
        color: "white",
        fontSize: 17,
    },
    kazaPrayersContainer: {
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 0,
        borderColor: "white",
        borderWidth: 1,
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    kazaPrayersName: {
        width: width*0.28,
        color: "white",
        fontSize: 18,
        fontWeight: "300",
    },
    kazaPrayersCountContainer: {
        width: width*0.35,
        flexDirection: "row",
        height: "100%",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 0,
    },
    kazaPrayersCount: {
        width: width*0.078,
        color: "white",
        fontSize: 18,
        fontWeight: "300",
    },
    kazaPrayersCountInDecrease: {
        borderColor: "black",
        borderRightWidth: 1,
        borderRadius: 5,
        height: "100%",
        width: 50,
        justifyContent: "center",
        backgroundColor: "white",
        color: "black",
        fontSize: 25,
        fontWeight: "300",
    },
    kazaPrayersCountInDecreasePressed: {
        borderRadius: 5,
        height: "100%",
        width: 50,
        justifyContent: "center",
        backgroundColor: "grey",
        color: "black",
        fontSize: 25,
        fontWeight: "300",
    },
    kazaPrayersSaveButtonContainer: {
        backgroundColor: "white",
        height: 50,
        width: width*0.28,
        borderRadius: 5,
        justifyContent: "center",
    },
    kazaPrayersSaveButtonContainerPressed: {
        backgroundColor: "grey",
        height: 50,
        width: width*0.28,
        borderRadius: 5,
        justifyContent: "center",
    },
    kazaPrayersSaveButtonText: {
        textAlign: "center",
        color: "black",
        fontSize: 18,
        fontWeight: "300",
    },
    saveDates: {
        backgroundColor: "white",
        height: 50,
        width: 100,
        borderRadius: 10,
        alignItems: "center",
        alignSelf: "flex-end",
        justifyContent: "center",
        verticalAlign: "bottom",
    },
    saveDatesPressed: {
        backgroundColor: "grey",
        height: 50,
        width: 100,
        borderRadius: 10,
        alignItems: "center",
        alignSelf: "flex-end",
        justifyContent: "center",
        verticalAlign: "bottom",
    },
    saveDatesText: {
        color: "black",
        fontSize: 16,
    }
})