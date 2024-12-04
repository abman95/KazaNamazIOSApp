import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";

type DatePickerProps = {
    setDate: (date: Date) => void;
    selectedCountry: {
        name: string;
        latitude: string;
        longitude: string;
    }
};

export function DatePicker({ setDate, selectedCountry }: DatePickerProps) {
    const [date, setDateInternal] = useState(new Date());
    const [show, setShow] = useState(false);

    const onChange = (_event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        if (Platform.OS === 'android') {
            setShow(false);
        }
        setDateInternal(currentDate);
        setDate(currentDate);
    };


    return (
        <View style={styles.container}>
            <Text style={styles.locationText}>{selectedCountry.name}, Deutschland</Text>
            {Platform.OS === 'android' && (
            <TouchableOpacity onPress={() => setShow(true)}>
                <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            )}
            {(Platform.OS === 'ios' || show) && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    is24Hour={true}
                    onChange={onChange}
                    display={Platform.OS === 'ios' ? 'default' : 'spinner'}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        paddingLeft: 20,
        paddingRight: 10,
        width: '100%',
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    locationText: {
        color: "white",
        fontSize: 17,
        fontWeight: "300",
    },
    dateText: {
        color: 'white',
        fontSize: 17,
        marginLeft: 10,
    },
});
