import React from 'react';
import { Text, View, StyleSheet, ImageSourcePropType } from 'react-native';
import PrayerTimes from "@/components/PrayerTimes/PrayerTimes";
import DatePicker from "@/components/PrayerTimes/DatePicker";
import { PrayerTimeIcons } from "@/types/gebete";

const images: PrayerTimeIcons = {
    morning: require('../../assets/images/morgenGebet.jpg'),
    noon: require('../../assets/images/mittagGebet.jpg'),
    afternoon: require('../../assets/images/nachmittagGebet.jpg'),
    evening: require('../../assets/images/abendGebet.jpg'),
    night: require('../../assets/images/nachtGebet.jpg'),
};

export default function PrayerEditsPage(): JSX.Element {
    return (
        <View style={styles.container}>
            <Text style={styles.containerHeader}>Deine Gebete</Text>
            <DatePicker/>
            <View style={styles.prayersContainer}>
                <PrayerTimes prayersTime="Morgen" prayersImage={images.morning} />
                <PrayerTimes prayersTime="Mittag" prayersImage={images.noon} />
                <PrayerTimes prayersTime="Nachmittag" prayersImage={images.afternoon} />
                <PrayerTimes prayersTime="Abend" prayersImage={images.evening} />
                <PrayerTimes prayersTime="Nacht" prayersImage={images.night} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    containerHeader: {
        marginTop: 60,
        textAlign: 'center',
        fontSize: 30,
        fontWeight: "bold",
        color: 'white'
    },
    prayersContainer: {
        marginTop: 30,
        gap: 30,
    }
});
