import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

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

    const onChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setDateInternal(currentDate);
        setDate(currentDate); // Call the setDate function passed as a prop
    };

    return (
        <View style={styles.container}>
            <Text style={styles.locationText}>{selectedCountry.name}, Deutschland</Text>
            <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
            />
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
});
