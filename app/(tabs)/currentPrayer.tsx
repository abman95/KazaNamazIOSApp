import React, {useEffect, useState} from 'react';
import { Text, View, StyleSheet, ImageSourcePropType } from 'react-native';
import DatePicker from "@/components/PrayerTimes/DatePicker";
import { PrayerTimeIcons } from "@/types/gebete";
import CurrentPrayerTimes from "@/components/PrayerTimes/CurrentPrayerTimes";

const images: PrayerTimeIcons = {
    morning: require('../../assets/images/morgenGebet.jpg'),
    noon: require('../../assets/images/mittagGebet.jpg'),
    afternoon: require('../../assets/images/nachmittagGebet.jpg'),
    evening: require('../../assets/images/abendGebet.jpg'),
    night: require('../../assets/images/nachtGebet.jpg'),
};

export default function PrayerEditsPage(): JSX.Element {
    const [prayerTimes, setPrayerTimes] = useState({
        morning: "0",
        noon: "0",
        afternoon: "0",
        evening: "0",
        night: "0",
    });
    const [timeInSeconds, setTimeInSeconds] = useState(0);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const calculateTimeInSeconds = () => {
            const currentDate = new Date();
            return Math.floor((currentDate - new Date().setHours(0, 0, 0, 0)) / 1000);
        };

        const intervalId = setInterval(() => {
            setTimeInSeconds(calculateTimeInSeconds());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    function convertTimeToSeconds(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60;
    }

    function getPrayerTime() {
        if (Object.values(prayerTimes).some(time => time === "0")) {
            return {
                currentPrayerImage: images.morning,
                nextPrayerImage: images.noon,
                currentPrayerTime: 0,
                nextPrayerTime: 0,
                nextPrayerName: 'Laden...',
                currentPrayerName: 'Laden...',

            };
        }

        const prayerTimeInSeconds = {
            morning: convertTimeToSeconds(prayerTimes.morning),
            noon: convertTimeToSeconds(prayerTimes.noon),
            afternoon: convertTimeToSeconds(prayerTimes.afternoon),
            evening: convertTimeToSeconds(prayerTimes.evening),
            night: convertTimeToSeconds(prayerTimes.night),
        };

        if (timeInSeconds >= prayerTimeInSeconds.morning && timeInSeconds < prayerTimeInSeconds.noon) {
            return {
                currentPrayerImage: images.morning,
                nextPrayerImage: images.noon,
                currentPrayerTime: prayerTimeInSeconds.morning,
                nextPrayerTime: prayerTimeInSeconds.noon,
                nextPrayerName: 'Mittagsgebet',
                currentPrayerName: 'Morgengebet'
            };
        } else if (timeInSeconds >= prayerTimeInSeconds.noon && timeInSeconds < prayerTimeInSeconds.afternoon) {
            return {
                currentPrayerImage: images.noon,
                nextPrayerImage: images.afternoon,
                currentPrayerTime: prayerTimeInSeconds.noon,
                nextPrayerTime: prayerTimeInSeconds.afternoon,
                nextPrayerName: 'Nachmittagsgebet',
                currentPrayerName: 'Mittagsgebet'
            };
        } else if (timeInSeconds >= prayerTimeInSeconds.afternoon && timeInSeconds < prayerTimeInSeconds.evening) {
            return {
                currentPrayerImage: images.afternoon,
                nextPrayerImage: images.evening,
                currentPrayerTime: prayerTimeInSeconds.afternoon,
                nextPrayerTime: prayerTimeInSeconds.evening,
                nextPrayerName: 'Abendgebet',
                currentPrayerName: 'Nachmittagsgebet'
            };
        } else if (timeInSeconds >= prayerTimeInSeconds.evening && timeInSeconds < prayerTimeInSeconds.night) {
            return {
                currentPrayerImage: images.evening,
                nextPrayerImage: images.night,
                currentPrayerTime: prayerTimeInSeconds.evening,
                nextPrayerTime: prayerTimeInSeconds.night,
                nextPrayerName: 'Nachtgebet',
                currentPrayerName: 'Abendgebet'
            };
        } else {
            return {
                currentPrayerImage: images.night,
                nextPrayerImage: images.morning,
                currentPrayerTime: prayerTimeInSeconds.night,
                nextPrayerTime: prayerTimeInSeconds.morning,
                nextPrayerName: 'Morgengebet',
                currentPrayer: 'Nachtgebet'
            };
        }
    }

    useEffect(() => {
        const fetchPrayerTimes = (date) => {
            const formattedDate = date.toISOString().split('T')[0];
            fetch(`https://api.aladhan.com/v1/timings/${formattedDate}?latitude=53.075878&longitude=8.807311&method=3&timezonestring=Europe/Berlin`)
                .then(response => response.json())
                .then(data => {
                    setPrayerTimes({
                        morning: data.data.timings.Fajr,
                        noon: data.data.timings.Dhuhr,
                        afternoon: data.data.timings.Asr,
                        evening: data.data.timings.Maghrib,
                        night: data.data.timings.Isha
                    });
                })
                .catch(error => {
                    console.error(error);
                    // Bei einem Fehler setzen wir Default-Werte
                    setPrayerTimes({
                        morning: "0",
                        noon: "0",
                        afternoon: "0",
                        evening: "0",
                        night: "0",
                    });
                });
        };

        fetchPrayerTimes(currentDate);

        const intervalId = setInterval(() => {
            const now = new Date();
            if (now.getDate() !== currentDate.getDate()) {
                setCurrentDate(now);
                fetchPrayerTimes(now);
            }
        }, 60000);

        return () => clearInterval(intervalId);
    }, [currentDate]);

    return (
        <View style={styles.container}>
            <Text style={ styles.currentDate}>
                {currentDate
                    ? `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`
                    : "Datum wird geladen..."}
            </Text>
            <View style={styles.prayersContainer}>
                <CurrentPrayerTimes
                    currentAndNextPrayersProperties={getPrayerTime()}
                    currentTime={timeInSeconds}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    currentDate: {
        marginTop: 70,
        color: "white",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "100",
    },
    prayersContainer: {
        gap: 0,
    }
});
