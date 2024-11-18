import { Modal, Text, StyleSheet, View, Pressable, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import {useCallback, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {unescapeJsonPointer} from "ajv/lib/compile/util";
import {useFocusEffect} from "@react-navigation/native";


type StatisticsDatePickerModalProps = {
    onClose: () => void;
    setFromDateString: (Date: string) => void;
    setToDateString: (Date: string) => void;
};

export default function StatisticsDatePickerModal({ onClose,
                                                      setFromDateString,
                                                      setToDateString }: StatisticsDatePickerModalProps) {
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
    }, [internalFromDate, internalToDate])

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
                    <Text style={styles.title}>Wähle ein Stadt</Text>
                    <Pressable onPress={onClose}>
                        <MaterialIcons style={styles.titleIcon} name="close" size={30}  />
                    </Pressable>
                </View>
                <Text style={styles.pickedDateText}>{`Gewähltes Datum ${dateConverter(internalFromDate)} bis ${dateConverter(internalToDate)}`}</Text>

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
                <Pressable style={ styles.saveDates } onPress={handlePressSaveDates}>
                    <Text style={ styles.saveDatesText }>Speichern</Text>
                </Pressable>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContent: {
        borderColor: "white",
        borderWidth: 5,
        height: 300,
        width: 350,
        backgroundColor: "black",
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        position: "absolute",
        right: 25,
        top: 150,
        flexDirection: "column",
    },
    titleContainer: {
        height: "15%",
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
        fontSize: 20,
        marginBottom: 20,
        fontWeight: "500"
    },
    titleIcon: {
        marginBottom: 20,
        color: "white",
    },
    pickedDateText: {
        textAlign: "center",
        color: "white",
        fontSize: 18,
    },
    saveDates: {
        backgroundColor: "white",
        height: 50,
        width: 100,
        borderRadius: 10,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
    },
    saveDatesText: {
        color: "black",
        fontSize: 16,
    }
})