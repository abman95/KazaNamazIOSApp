import {Modal, Text, StyleSheet, View, Pressable, Dimensions} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import {useCallback, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";


type StatisticsDatePickerModalProps = {
    onClose: () => void;
};

export default function StatisticsDatePickerModal({ onClose}: StatisticsDatePickerModalProps) {
    const [internalFromDate, setInternalFromDate] = useState<Date>(new Date());
    const [internalToDate, setInternalToDate] = useState<Date>(new Date());

    const dateConverter = useCallback((selectedDate: Date) => {
        return selectedDate.toISOString().split('T')[0];
    }, []);

    const saveFromDate = useCallback((_event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentFromDate: Date = selectedDate || internalFromDate;
        setInternalFromDate(currentFromDate);
    }, [])

    const saveToDate = useCallback((_event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentToDate: Date = selectedDate || internalToDate;
        setInternalToDate(currentToDate);
    }, [])

    const handlePressSaveDates = useCallback(async () => {
        await AsyncStorage.setItem('FromDateString', internalFromDate.toISOString());
        await AsyncStorage.setItem('ToDateString', internalToDate.toISOString());
        alert(`Eingabe wurde gespeichert. ${dateConverter(internalFromDate)} bis ${dateConverter(internalToDate)}`);
        onClose()
    }, [internalFromDate, internalToDate])

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                try {
                    const fromDateString: string | null = await AsyncStorage.getItem('FromDateString');
                    const toDateString: string | null  = await AsyncStorage.getItem('ToDateString');

                    setInternalFromDate(fromDateString ? new Date(fromDateString) : new Date());
                    setInternalToDate(toDateString ? new Date(toDateString) : new Date());
                } catch (error) {
                    console.error('Error loading dates from AsyncStorage:', error);
                }
            };

            loadData();

            return () => {};
        }, [])
    );

    return (
        <Modal animationType="fade" transparent={true}>
            <View style={styles.modalContent}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Wähle einen Zeitraum</Text>
                    <Pressable onPress={onClose}>
                        <MaterialIcons style={styles.titleIcon} name="close" size={35}  />
                    </Pressable>
                </View>
                <View style={ styles.contentContainer }>
                    <Text style={styles.pickedDateText}>{`Gewählter Zeitraum ${dateConverter(internalFromDate)} bis ${dateConverter(internalToDate)}`}</Text>

                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <DateTimePicker
                        value={internalFromDate}
                        mode="date"
                        display="default"
                        onChange={saveFromDate}
                    />
                    <DateTimePicker
                        value={internalToDate}
                        mode="date"
                        display="default"
                        onChange={saveToDate}
                    />
                    </View>
                    <Pressable style={({ pressed }) => [
                        pressed ? styles.saveDatesPressed : styles.saveDates
                    ]} onPress={handlePressSaveDates}
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
        height: height*.25,
        width: width,
        backgroundColor: "black",
        borderRadius: 10,
        position: "absolute",
        right: 0,
        top: height*.375,
        flexDirection: "column",
    },
    titleContainer: {
        flex: 3/8,
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
        marginBottom: 20,
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
    saveDates: {
        backgroundColor: "white",
        height: 50,
        width: 100,
        borderRadius: 10,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        verticalAlign: "bottom",
    },
    saveDatesPressed: {
        backgroundColor: "grey",
        height: 50,
        width: 100,
        borderRadius: 10,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        verticalAlign: "bottom",
    },
    saveDatesText: {
        color: "black",
        fontSize: 16,
    }
})