import { Modal, Text, StyleSheet, View, Pressable, FlatList, } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

type CalculationMethod = {
    id: string;
    name: string;
};

const calculationMethods: CalculationMethod[] = [
    { id: "0", name: "Jafari / Shia Ithna-Ashari" },
    { id: "1", name: "University of Islamic Sciences, Karachi" },
    { id: "2", name: "Islamic Society of North America" },
    { id: "3", name: "Muslim World League" },
    { id: "4", name: "Umm Al-Qura University, Makkah" },
    { id: "5", name: "Egyptian General Authority of Survey" },
    { id: "7", name: "Institute of Geophysics, University of Tehran" },
    { id: "8", name: "Gulf Region" },
    { id: "9", name: "Kuwait" },
    { id: "10", name: "Qatar" },
    { id: "12", name: "Majlis Ugama Islam Singapura, Singapore" },
    { id: "12", name: "Union Organization islamic de France" },
    { id: "13", name: "Diyanet İşleri Başkanlığı, Turkey" },
    { id: "14", name: "Spiritual Administration of Muslims of Russia" },
    { id: "15", name: "Moonsighting Committee Worldwide (also requires shafaq parameter)" },
    { id: "16", name: "Dubai (experimental)" },
    { id: "17", name: "Jabatan Kemajuan Islam Malaysia (JAKIM)" },
    { id: "18", name: "Tunisia" },
    { id: "19", name: "Algeria" },
    { id: "20", name: "KEMENAG - Kementerian Agama Republik Indonesia" },
    { id: "21", name: "Morocco" },
    { id: "22", name: "Comunidade Islamica de Lisboa" },
    { id: "23", name: "Ministry of Awqaf, Islamic Affairs and Holy Places, Jordan" },
];


type PrayerCalculationMethodProps = {
    onClose: () => void;
    setSelectedMethod: (method: { id: string; name: string }) => void;
};

export default function PrayerCalculationMethod({ onClose, setSelectedMethod }: PrayerCalculationMethodProps) {
    return (
        <Modal animationType="slide" transparent={true}>
            <View style={styles.modalContent}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Wähle ein Berechnungsmethode</Text>
                    <Pressable onPress={onClose}>
                        <MaterialIcons style={styles.titleIcon} name="close" size={30}  />
                    </Pressable>
                </View>
                <FlatList
                    data={calculationMethods}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                        <Pressable
                            style={styles.cityPicklist}
                            onPress={() => {
                                setSelectedMethod(item);
                                onClose();
                            }}
                        >
                            <View style={styles.cityPicklist}>
                                <Text style={styles.cityText}>{item.name}</Text>
                            </View>
                        </Pressable>
                    )}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContent: {
        height: "100%",
        width: "100%",
        backgroundColor: "#201f1d",
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        position: "absolute",
        bottom: 0,
        flexDirection: "column",
    },
    titleContainer: {
        height: "15%",
        backgroundColor: "black",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
    },
    title: {
        color: "white",
        fontSize: 20,
        marginBottom: 20,
        fontWeight: "500"
    },
    titleIcon: {
        marginBottom: 20,
        color: "white",
    },
    cityPicklist: {
        justifyContent: "center",
        width: "100%",
        borderBottomColor: "white",
        borderBottomWidth: 0.2,
        height: 80,
    },
    cityText: {
        textAlign: "center",
        color: "white",
        fontSize: 18,
    },
})