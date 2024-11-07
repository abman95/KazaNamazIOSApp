import React, { useState } from 'react';
import {Text, View, StyleSheet, ActionSheetIOS, TouchableOpacity} from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";


export default function DatePicker({ setDate }: { setDate: (date: Date) => void }) {
    const [date, setDateInternal] = useState(new Date());

    const onChange = (_event: unknown, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setDateInternal(currentDate);
        setDate(currentDate); // Call the setDate function passed as a prop
    };

    return (
        <View style={styles.container}>
            <Text style={{color: "white", fontSize: 17, fontWeight:"400"}}>Bremen, Deutschland</Text>
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
        marginTop: 15,
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%',
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
});