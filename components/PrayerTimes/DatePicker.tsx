import React, { useState } from 'react';
import {Text, View, StyleSheet, ActionSheetIOS, TouchableOpacity} from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import {color} from "ansi-fragments";


export default function DatePicker() {
    const [date, setDate] = useState(new Date());

    const onChange = (event: unknown, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

    return (
        <View style={styles.container}>
            <Text style={{color: "white", fontSize: 19, fontWeight:"600"}}>Gewähltes Datum:</Text>
            <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        width: '100%',
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});