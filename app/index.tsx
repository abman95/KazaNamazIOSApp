import React, {useState, useCallback, useEffect} from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ImageStyle, Dimensions, Pressable,
} from 'react-native';
import CountryPicker from "@/components/settings/CountryPicker";
import PrayerCalculationMethod from "@/components/settings/PrayerCalculationMethod";
import AsyncStorage from "@react-native-async-storage/async-storage";

const welcomeAppTextHeader: string = "Willkommen zur Kaza Namaz App!";
const welcomeAppTextSubHeader: string = "Um fortzufahren wählen Sie bitte Ihre Stadt und die gewünschte Gebetszeit Berechnungsmethode aus. Diese können später in den App-Einstellungen nach Belieben geändert werden.";

const settingsIcons = {
    currentLocation: require('../assets/images/currentLocation.png'),
    prayerTimeMethod: require('../assets/images/prayerTimeMethod1.png'),
} as const;


const showAlert = (title: string, message: string) => {
    Alert.alert(
        title,
        message,
        [
            { text: "OK", onPress: () => console.log("OK gedrückt") }
        ],
        { cancelable: false }
    );
};

export const PrayerAppInitializationScreen: () => void | React.JSX.Element = () => {
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState<string>("");
    const [selectedCountry, setSelectedCountry] = useState<Record<string, string>>({
        name: "0",
        latitude: "0",
        longitude: "0",
    });
    const [selectedMethod, setSelectedMethod] = useState<Record<string, string>>({
        id: "0",
        name: "0",
    });
    const [isSelection, setIsSelection] = useState<boolean>(false);

    const handleContinue = useCallback(() => {
        if (selectedCountry.name !== "0" && selectedMethod.name !== "0") {
            setIsSelection(true)
        } else {
            let missingSelections = [];

            if (selectedMethod.name === "0") {
                missingSelections.push("Methode");
            }
            if (selectedCountry.name === "0") {
                missingSelections.push("Stadt");
            }

            showAlert("Achtung", `Bitte wähle noch ${missingSelections.join(" & ")} aus.`);
        }
    }, [selectedCountry, selectedMethod]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('selectedCountry');
                if (jsonValue !== null) {
                    const value = JSON.parse(jsonValue);
                    setSelectedCountry(value);
                }
            } catch (e) {
                console.error('Error loading initial data:', e);
            }
        };
        void loadInitialData();
    }, []);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('selectedMethod');
                if (jsonValue !== null) {
                    const value = JSON.parse(jsonValue);
                    setSelectedMethod(value);
                }
            } catch (e) {
                console.error('Error loading initial data:', e);
            }
        };
        void loadInitialData();
    }, []);

    useEffect(() => {
        const storeData = async () => {
            try {
                const jsonValue = JSON.stringify(selectedCountry);
                await AsyncStorage.setItem('selectedCountry', jsonValue);
            } catch (e) {
                console.error('Error saving selectedCountry:', e);
            }
        };
        void storeData();
    }, [selectedCountry]);

    useEffect(() => {
        const storeData = async () => {
            try {
                const jsonValue = JSON.stringify(selectedMethod);
                await AsyncStorage.setItem('selectedMethod', jsonValue);
            } catch (e) {
                console.error('Error saving selectedMethod:', e);
            }
        };
        void storeData();
    }, [selectedMethod]);

    const onModalButtonPress = useCallback((modalType: string): void => {
        setIsModalVisible(modalType)
    }, []);

    return (
        selectedCountry.name !== "0" && selectedMethod.name !== "0" &&  isSelection ? (
            router.replace('/currentPrayer')
            ) : (
        <View style={styles.container}>
            {isModalVisible === "city" && (
                <CountryPicker
                    onClose={() => onModalButtonPress("")}
                    setSelectedCountry={setSelectedCountry}
                />
            )}

            {isModalVisible === "method" && (
                <PrayerCalculationMethod
                    onClose={() => onModalButtonPress("")}
                    setSelectedMethod={setSelectedMethod}
                />
            )}
            <View style={styles.content}>
                    <Text style={styles.header}>
                        {welcomeAppTextHeader}
                    </Text>

                <View style={ styles.listContainer }>
                    <View style={styles.cityContainer}>
                        <Image style={ styles.settingsIcons } source={settingsIcons.currentLocation}/>
                        <Text style={ styles.listElementCity }>Gewählter Standort</Text>
                        <Pressable style={({ pressed }) => [
                            pressed ? styles.pressableItemContainerPressed
                                : styles.pressableItemContainer
                        ]}
                                   onPress={() => onModalButtonPress("city")}>
                            <Text style={ styles.pressableItemText }>{selectedCountry.name === "0" ? "Wähle eine Stadt aus" : selectedCountry.name}</Text>
                        </Pressable>
                    </View>
                    <View style={styles.methodContainer}>
                        <Image style={ styles.settingsIcons } source={settingsIcons.prayerTimeMethod}/>
                        <Text style={ styles.listElementMethod }>Gewählte Methode</Text>
                        <Pressable style={({ pressed }) => [
                            pressed ? styles.pressableItemContainerPressed
                                : styles.pressableItemContainer
                        ]}
                                   onPress={() => onModalButtonPress("method")}>
                            <Text style={ styles.pressableItemText }>{selectedMethod.name === "0" ? "Wähle eine Methode aus" : selectedMethod.name}</Text>
                        </Pressable>
                    </View>
                </View>
                <Pressable style={({ pressed }) => [
                    pressed ? styles.continueButtonPressed
                        : styles.continueButton
                ]}
                           onPress={() => {void handleContinue()}}>
                    <Text style={ styles.continueButtonText }>Fortfahren</Text>
                </Pressable>
                    <Text style={styles.subHeader}>
                        {welcomeAppTextSubHeader}
                    </Text>
                </View>
        </View>
        )
    );
};

const { height, width } = Dimensions.get('window');

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    } as ViewStyle,
    content: {
        marginLeft: 50,
        marginRight: 50,
        flex: 1,
        alignItems: 'center',
        marginTop: height* 0.22,
    } as ViewStyle,
    header: {
        textAlign: "center",
        color: "white",
        fontSize: 30,
        fontWeight: '400',
        marginBottom: 5,
    } as TextStyle,
    subHeader: {
        textAlign: "center",
        color: "white",
        fontSize: 18,
        fontWeight: '200',
    } as TextStyle,
    image: {
        width: 300,
        height: 300,
        borderRadius: 150,
    } as ImageStyle,
    listContainer: {
        flexDirection: "row",
        width: width,
        height: height* .24,
        marginTop: height*.05
    },
    cityContainer: {
        alignItems: "center",
        width: width*.5,
        height: height* 0.3,
        marginRight: -10,
        marginLeft: 10,
    },
    settingsIcons: {
        width: width*.17,
        height: width*.17,
        tintColor: "white",
    },
    listElementCity: {
        color: "white",
        fontSize: 16,
        fontWeight: "200",
        marginTop: 15,
        textAlign: "center",
    },
    pressableItemContainer: {
        borderRadius: 5,
        borderWidth: .5,
        borderColor: "white",
        justifyContent: "center",
        height: height*.05,
        width: width*.35,
        marginTop: 20,
        paddingLeft: 5,
        paddingRight: 5,
    },
    pressableItemContainerPressed: {
        borderRadius: 5,
        borderWidth: .5,
        borderColor: "grey",
        justifyContent: "center",
        height: height*.05,
        width: width*.35,
        marginTop: 20,
        paddingLeft: 5,
        paddingRight: 5,
    },
    pressableItemText: {
        textAlign: "center",
        color: "white",
    },
    methodContainer: {
        alignItems: "center",
        width: width*.5,
        height: height* 0.3,
    },
    continueButton: {
        borderRadius: 5,
        borderWidth: .5,
        borderColor: "white",
        backgroundColor: "white",
        justifyContent: "center",
        height: height*.05,
        width: width*.35,
        marginBottom: 30,
        paddingLeft: 5,
        paddingRight: 5,
    },
    continueButtonPressed: {
        borderRadius: 5,
        borderWidth: .5,
        backgroundColor: "grey",
        justifyContent: "center",
        height: height*.05,
        width: width*.35,
        marginBottom: 30,
        paddingLeft: 5,
        paddingRight: 5,
    },
    continueButtonText: {
        textAlign: "center",
        color: "black",
    },
    listElementMethod: {
        color: "white",
        fontSize: 16,
        fontWeight: "200",
        marginTop: 15,
    },
});

export default PrayerAppInitializationScreen;