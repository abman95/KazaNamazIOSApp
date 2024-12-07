import React, { useState, useCallback } from 'react';
import {
    Modal,
    Text,
    StyleSheet,
    View,
    Pressable,
    Dimensions,
    Platform
} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import {formattedDate} from "@/constants/formattedDate";

type StatisticsDatePickerModalProps = {
    onClose: () => void;
};

export default function StatisticsDatePickerModal({ onClose }: StatisticsDatePickerModalProps) {
    const [internalFromDate, setInternalFromDate] = useState<Date>(new Date());
    const [internalToDate, setInternalToDate] = useState<Date>(new Date());
    const [showFromDatePicker, setShowFromDatePicker] = useState(Platform.OS === 'ios');
    const [showToDatePicker, setShowToDatePicker] = useState(Platform.OS === 'ios');

    const saveFromDate = useCallback((_event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentFromDate: Date = selectedDate || internalFromDate;
        setInternalFromDate(currentFromDate);

        if (Platform.OS === 'android') {
            setShowFromDatePicker(false);
        }
    }, [internalFromDate]);

    const saveToDate = useCallback((_event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentToDate: Date = selectedDate || internalToDate;
        setInternalToDate(currentToDate);

        if (Platform.OS === 'android') {
            setShowToDatePicker(false);
        }
    }, [internalToDate]);

    const handlePressSaveDates = useCallback(async () => {
        await AsyncStorage.setItem('fromDateString', formattedDate(internalFromDate));
        await AsyncStorage.setItem('toDateString', formattedDate(internalToDate));
        onClose();
    }, [internalFromDate, internalToDate, onClose, formattedDate]);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                try {
                    const fromDateString: string | null = await AsyncStorage.getItem('fromDateString');
                    const toDateString: string | null = await AsyncStorage.getItem('toDateString');

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
        <Modal animationType="fade" transparent={true} visible={true} onRequestClose={onClose}>
            <View style={styles.modalContent}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Wähle einen Zeitraum</Text>
                    <Pressable onPress={onClose}>
                        <MaterialIcons style={styles.titleIcon} name="close" size={40} />
                    </Pressable>
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.pickedDateText}>
                        {`Gewählter Zeitraum\n${formattedDate(internalFromDate)} bis ${formattedDate(internalToDate)}`}
                    </Text>

                    <View style={styles.datePickerContainer}>
                        <View style={styles.singleDatePickerContainer}>
                            <Text style={styles.datePickerLabel}>Von</Text>
                            {Platform.OS === 'android' && (
                                <Pressable onPress={() => setShowFromDatePicker(true)}>
                                    <Text style={styles.dateText}>{internalFromDate.toLocaleDateString()}</Text>
                                </Pressable>
                            )}
                            {(Platform.OS === 'ios' || showFromDatePicker) && (
                                <DateTimePicker
                                    value={internalFromDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'default' : 'spinner'}
                                    onChange={saveFromDate}
                                />
                            )}
                        </View>

                        <View style={styles.singleDatePickerContainer}>
                            <Text style={styles.datePickerLabel}>Bis</Text>
                            {Platform.OS === 'android' && (
                                <Pressable onPress={() => setShowToDatePicker(true)}>
                                    <Text style={styles.dateText}>{internalToDate.toLocaleDateString()}</Text>
                                </Pressable>
                            )}
                            {(Platform.OS === 'ios' || showToDatePicker) && (
                                <DateTimePicker
                                    value={internalToDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'default' : 'spinner'}
                                    onChange={saveToDate}
                                />
                            )}
                        </View>
                    </View>

                    <Pressable
                        style={({ pressed }) => [
                            pressed ? styles.saveDatesPressed : styles.saveDates
                        ]}
                        onPress={handlePressSaveDates}
                    >
                        <Text style={styles.saveDatesText}>Speichern</Text>
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
        borderWidth: .5,
        height: height * 0.3,
        width: width*0.8,
        backgroundColor: "black",
        borderRadius: 10,
        position: "absolute",
        right: width*.1,
        top: height * 0.159,
        flexDirection: "column",
    },
    titleContainer: {
        flex: 2.5/8,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
    },
    title: {
        color: "white",
        fontSize: 23,
        marginBottom: 20,
        fontWeight: "700"
    },
    titleIcon: {
        marginLeft: 12,
        marginBottom: 15,
        color: "white",
    },
    contentContainer: {
        gap: 15,
        flex: 7/8,
        flexDirection: "column",
        paddingLeft: 10,
        paddingRight: 10,
    },
    pickedDateText: {
        marginTop: -15,
        textAlign: "center",
        color: "white",
        fontSize: 14,
        fontWeight: "300",
    },
    datePickerContainer: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    singleDatePickerContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    datePickerLabel: {
        color: "white",
        fontSize: 16,
        marginBottom: 5,
    },
    dateText: {
        color: "white",
        fontSize: 16,
        marginBottom: 10,
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
});