import {Text, StyleSheet, View, Pressable, Dimensions} from "react-native";
import {useCallback, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";
import {string} from "prop-types";
import DatabaseService from "@/database/database";

const databaseService = new DatabaseService();

type PrayerTimeNameProps= {
    prayersTimeName: string;
    maxTotalCount: number;
    internalFromDate: Date;
}


export default function KazaPrayersModalChildComponent({prayersTimeName, maxTotalCount, internalFromDate}: PrayerTimeNameProps) {
    const [count, setCount] = useState(0);

    const addNamaz = useCallback(async (internalFromDate: Date, prayersTimeName: string, maxTotalCount: number) => {
        try {
            await databaseService.initializeDatabase();

            const daysToAdd = [...Array(maxTotalCount).keys()];

            const formatDate = (date: Date): string => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');

                return `${year}-${month}-${day}`;
            };

            await Promise.all(daysToAdd.map(dayOffset => {
                const currentDate = new Date(internalFromDate);
                currentDate.setDate(currentDate.getDate() + dayOffset);
                currentDate.setHours(0, 0, 0, 0);
                const formattedDate = formatDate(currentDate);

                databaseService.addKazaNamaz(formattedDate, prayersTimeName, "erledigt");
                alert(`Eintrag wurde erfolgreich gespeichert`);
                // alert(formattedDate);
            }));

        } catch (error) {
            console.error('Error saving prayer status:', error);
            throw error;
        }
    }, []);

    return (
                    <View style={{flexDirection: "column", justifyContent: "space-between"}}>
                        <View style={ styles.kazaPrayersContainer }>
                            <Text style={ styles.kazaPrayersName }>{prayersTimeName}</Text>
                            <View  style={ styles.kazaPrayersCountContainer }>
                                <Text style={ styles.kazaPrayersCount }>{count}</Text>
                                <Pressable onPress={() => count > 0 && setCount(count - 1)} style={({ pressed }) => [
                                    pressed ? styles.kazaPrayersCountInDecreasePressed : styles.kazaPrayersCountInDecrease
                                ]}
                                >
                                    <Text style={{ textAlign: "center", fontSize: 28, fontWeight: "300"}}>-</Text>
                                </Pressable>
                                <Pressable onPress={() => { if(count < maxTotalCount) {setCount(count + 1)}}} style={({ pressed }) => [
                                    pressed ? styles.kazaPrayersCountInDecreasePressed : styles.kazaPrayersCountInDecrease
                                ]}
                                >
                                    <Text style={{ textAlign: "center", fontSize: 28, fontWeight: "300"}}>+</Text>
                                </Pressable>
                            </View>
                            <Pressable style={({ pressed }) => [
                                pressed ? styles.kazaPrayersSaveButtonContainerPressed : styles.kazaPrayersSaveButtonContainer
                            ]}
                                        onPress={() => addNamaz(internalFromDate, prayersTimeName, maxTotalCount)}
                            >
                                <Text style={ styles.kazaPrayersSaveButtonText }>nachgeholt</Text>
                            </Pressable>
                        </View>
                    </View>
    );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    kazaPrayersContainer: {
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 0,
        borderColor: "white",
        borderWidth: 1,
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    kazaPrayersName: {
        width: width*0.28,
        color: "white",
        fontSize: 18,
        fontWeight: "300",
    },
    kazaPrayersCountContainer: {
        width: width*0.35,
        flexDirection: "row",
        height: "100%",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: width*0,
    },
    kazaPrayersCount: {
        width: width*0.078,
        color: "white",
        fontSize: 18,
        fontWeight: "300",
    },
    kazaPrayersCountInDecrease: {
        borderColor: "black",
        borderRightWidth: 1,
        borderRadius: 5,
        height: "100%",
        width: 50,
        justifyContent: "center",
        backgroundColor: "white",
        color: "black",
        fontSize: 25,
        fontWeight: "300",
    },
    kazaPrayersCountInDecreasePressed: {
        borderRadius: 5,
        height: "100%",
        width: 50,
        justifyContent: "center",
        backgroundColor: "grey",
        color: "black",
        fontSize: 25,
        fontWeight: "300",
    },
    kazaPrayersSaveButtonContainer: {
        backgroundColor: "white",
        height: 50,
        width: width*0.28,
        borderRadius: 5,
        justifyContent: "center",
    },
    kazaPrayersSaveButtonContainerPressed: {
        backgroundColor: "grey",
        height: 50,
        width: width*0.28,
        borderRadius: 5,
        justifyContent: "center",
    },
    kazaPrayersSaveButtonText: {
        textAlign: "center",
        color: "black",
        fontSize: 18,
        fontWeight: "300",
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