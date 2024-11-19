import {Text, StyleSheet, View, Pressable, Dimensions} from "react-native";
import {useCallback, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";
import {string} from "prop-types";

type PrayerTimeNameProps= {
    prayersTimeName: string;
}


export default function KazaPrayersModalChildComponent(prayersTimeName: PrayerTimeNameProps) {
    // const [internalFromDate, setInternalFromDate] = useState<Date>(new Date());
    // const [internalToDate, setInternalToDate] = useState<Date>(new Date());
    const [count, setCount] = useState(0);

    // const dateConverter = useCallback((selectedDate: Date) => {
    //     return selectedDate.toISOString().split('T')[0];
    // }, []);
    //
    // useFocusEffect(
    //     useCallback(() => {
    //         const loadData = async () => {
    //             const fromDateString: string | null = await AsyncStorage.getItem('FromDateString');
    //             const toDateString: string | null  = await AsyncStorage.getItem('ToDateString');
    //
    //             setInternalFromDate(new Date(fromDateString));
    //             setInternalToDate(new Date(toDateString));
    //         };
    //
    //         loadData();
    //
    //         return () => {};
    //     }, [])
    // );
    console.log(prayersTimeName);
    return (
                    <View style={{flexDirection: "column", justifyContent: "space-between"}}>
                        <View style={ styles.kazaPrayersContainer }>
                            <Text style={ styles.kazaPrayersName }>{prayersTimeName.prayersTimeName}</Text>
                            <View  style={ styles.kazaPrayersCountContainer }>
                                <Text style={ styles.kazaPrayersCount }>{count}</Text>
                                <Pressable onPress={() => count > 0 && setCount(count - 1)} style={({ pressed }) => [
                                    pressed ? styles.kazaPrayersCountInDecreasePressed : styles.kazaPrayersCountInDecrease
                                ]}
                                >
                                    <Text style={{ textAlign: "center", fontSize: 28, fontWeight: "300"}}>-</Text>
                                </Pressable>
                                <Pressable onPress={() => setCount(count + 1)} style={({ pressed }) => [
                                    pressed ? styles.kazaPrayersCountInDecreasePressed : styles.kazaPrayersCountInDecrease
                                ]}
                                >
                                    <Text style={{ textAlign: "center", fontSize: 28, fontWeight: "300"}}>+</Text>
                                </Pressable>
                            </View>
                            <Pressable style={({ pressed }) => [
                                pressed ? styles.kazaPrayersSaveButtonContainerPressed : styles.kazaPrayersSaveButtonContainer
                            ]}
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