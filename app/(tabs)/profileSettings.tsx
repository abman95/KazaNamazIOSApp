import {Text, View, StyleSheet, Image, Pressable} from 'react-native';
import { useEffect, useState} from 'react';
import CountryPicker from "@/components/settings/CountryPicker";
import PrayerCalculationMethod from "@/components/settings/PrayerCalculationMethod";
import AsyncStorage from '@react-native-async-storage/async-storage';

const settingsIcons = {
    currentLocation: require('../../assets/images/currentLocation.png'),
    pushNotification: require('../../assets/images/pushNotification.png'),
    pushNotification3: require('../../assets/images/pushNotification3.png'),
    prayerCall: require('../../assets/images/prayerCall.png'),
    prayerTimeMethod: require('../../assets/images/prayerTimeMethod1.png'),
    logOut: require('../../assets/images/logOut.png'),
    deleteUser: require('../../assets/images/deleteUser.png')
} as const;

export default function profileSettings(): JSX.Element {
    const [isCountryModalVisible, setIsCountryModalVisible] = useState<boolean>(false);
    const [isMethodModalVisible, setIsMethodModalVisible] = useState<boolean>(false);
    const [selectedCountry, setSelectedCountry] = useState({
        name: "Bremen",
        latitude: "53.075878",
        longitude: "8.807311",
    });

    const [selectedMethod, setSelectedMethod] = useState({
        id: "13",
        name: "Diyanet İşleri Başkanlığı, Turkey",
    });

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
         loadInitialData();
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
        loadInitialData();
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
        storeData();
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
        storeData();
    }, [selectedMethod]);


    const onCountryModalClose = () => {
        setIsCountryModalVisible(false);
    }

    const onCountryModalOpen = () => {
        setIsCountryModalVisible(true);
    }

    const onMethodModalClose = () => {
        setIsMethodModalVisible(false);
    }

    const onMethodModalOpen = () => {
        setIsMethodModalVisible(true);
    }

    return (
        <View style={styles.container}>
            {isCountryModalVisible && <CountryPicker onClose={onCountryModalClose} setSelectedCountry={setSelectedCountry}></CountryPicker>}
            {isMethodModalVisible && <PrayerCalculationMethod onClose={onMethodModalClose} setSelectedMethod={setSelectedMethod}></PrayerCalculationMethod>}
            <Text style={ styles.header }>Profil Einstellungen</Text>
            <View style={styles.listMainContainer}>
                <View style={styles.listContainer}>
                    <Image style={ styles.settingsIcons } source={settingsIcons.currentLocation}/>
                    <Text style={ styles.listElement1 }>Gewählter Standort</Text>
                    <Pressable style={ styles.pressableItemContainer } onPress={onCountryModalOpen}>
                        <Text style={ styles.pressableItemText }>{selectedCountry.name === "0" ? "Wähle eine Stadt aus" : selectedCountry.name}</Text>
                    </Pressable>
                </View>
                <View style={styles.listContainer}>
                    <Image style={ styles.settingsIcons } source={settingsIcons.pushNotification}/>
                    <Text style={ styles.listElement2 }>Push Benachrichtung</Text>
                </View>
                <View style={styles.listContainer}>
                    <Image style={ styles.settingsIcons } source={settingsIcons.pushNotification3}/>
                    <Text style={ styles.listElement3 }>Zeit vor Push Benachrichtigung </Text>
                </View>
                <View style={styles.listContainer}>
                    <Image style={ styles.settingsIcons } source={settingsIcons.prayerCall}/>
                    <Text style={ styles.listElement4 }>Ezan</Text>
                </View>
                <View style={styles.listContainer}>
                    <Image style={ styles.settingsIcons } source={settingsIcons.prayerTimeMethod}/>
                    <Text style={ styles.listElement5 }>Gebetszeiten Methoden</Text>
                    <Pressable style={ styles.pressableItemContainer } onPress={onMethodModalOpen}>
                        <Text style={ styles.pressableItemText }>{selectedMethod.name}</Text>
                    </Pressable>
                </View>
                <View style={styles.listContainer}>
                    <Image style={ styles.settingsIcons } source={settingsIcons.logOut}/>
                    <Text style={ styles.listElement6 }>Abmelden</Text>
                </View>
                <View style={styles.listContainer}>
                    <Image style={ styles.settingsIcons } source={settingsIcons.deleteUser}/>
                    <Text style={ styles.listElement7 }>Konto entfernen</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    header: {
        marginLeft: 20,
        marginBottom: 10,
        marginTop: 70,
        color: "white",
        fontSize: 28,
        fontWeight: '400',
    },
    listMainContainer: {
        backgroundColor: "#201f1d",
    },
    listContainer: {
        width: "100%",
        height: 40,
        flexDirection: "row",
        marginTop: 25,
        marginLeft: 10,
        color: "white",
        fontSize: 17,
        fontWeight: "400",
        borderBottomWidth: 0.2,
        borderBottomColor: "grey",
    },
    settingsIcons: {
        marginLeft: 10,
        marginRight: 20,
        width: 22,
        height: 22,
        tintColor: "white",
    },
    pressableItemContainer: {
        flex: 1,
        alignItems: "flex-end",
        marginRight: 40,
        color: "white",
    },
    pressableItemText: {
        color: "white",
        fontSize: 14,
        fontWeight: "400",
    },
    listElement1: {
        color: "white",
        fontSize: 14,
        fontWeight: "400",
    },
    listElement2: {
        color: "white",
        fontSize: 14,
        fontWeight: "400",
    },
    listElement3: {
        color: "white",
        fontSize: 14,
        fontWeight: "400",
    },
    listElement4: {
        color: "white",
        fontSize: 14,
        fontWeight: "400",
    },
    listElement5: {
        color: "white",
        fontSize: 14,
        fontWeight: "400",
    },
    listElement6: {
        color: "white",
        fontSize: 14,
        fontWeight: "400",
    },
    listElement7: {
        color: "white",
        fontSize: 14,
        fontWeight: "400",
    },
});