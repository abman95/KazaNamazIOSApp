import React, {useCallback, useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import PrayerTimes from "@/components/PrayerTimes/PrayerTimes";
import DatePicker from "@/components/PrayerTimes/DatePicker";


export default function GebetsStatistik(): JSX.Element {
    const images = {
        morgen: require('../../assets/images/morgenGebet.jpg'),
        mittag: require('../../assets/images/mittagGebet.jpg'),
        nachmittag: require('../../assets/images/nachmittagGebet.jpg'),
        abend: require('../../assets/images/abendGebet.jpg'),
        nacht: require('../../assets/images/nachtGebet.jpg'),
    };

    return (
        <View style={styles.container}>
            <Text style={styles.containerHeader}>Deine Gebete</Text>
            <DatePicker/>
            <View style={styles.prayersContainer}>
                <PrayerTimes prayersTime="Morgen" prayersImage={images.morgen} />
                <PrayerTimes prayersTime="Mittag" prayersImage={images.mittag} />
                <PrayerTimes prayersTime="Nachmittag" prayersImage={images.nachmittag} />
                <PrayerTimes prayersTime="Abend" prayersImage={images.abend} />
                <PrayerTimes prayersTime="Nacht" prayersImage={images.nacht} />
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
        marginTop: 10,
        gap: 30,
    }
});