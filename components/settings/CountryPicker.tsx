import { Modal, Text, StyleSheet, View, Pressable, FlatList, } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

type City = {
    name: string;
    latitude: string;
    longitude: string;
};

const cities: City[] = [
    { name: "Augsburg", latitude: "48.370545", longitude: "10.897790" },
    { name: "Berlin", latitude: "52.520008", longitude: "13.404954" },
    { name: "Bielefeld", latitude: "52.030228", longitude: "8.532471" },
    { name: "Bochum", latitude: "51.481844", longitude: "7.216236" },
    { name: "Bonn", latitude: "50.737430", longitude: "7.098207" },
    { name: "Bremen", latitude: "53.075878", longitude: "8.807311" },
    { name: "Dortmund", latitude: "51.513587", longitude: "7.465298" },
    { name: "Dresden", latitude: "51.050407", longitude: "13.737262" },
    { name: "Duisburg", latitude: "51.434408", longitude: "6.762329" },
    { name: "Düsseldorf", latitude: "51.227741", longitude: "6.773456" },
    { name: "Essen", latitude: "51.455643", longitude: "7.011555" },
    { name: "Frankfurt am Main", latitude: "50.110924", longitude: "8.682127" },
    { name: "Gelsenkirchen", latitude: "51.517744", longitude: "7.085717" },
    { name: "Hamburg", latitude: "53.551086", longitude: "9.993682" },
    { name: "Hannover", latitude: "52.375892", longitude: "9.732010" },
    { name: "Karlsruhe", latitude: "49.006890", longitude: "8.403653" },
    { name: "Köln", latitude: "50.937531", longitude: "6.960279" },
    { name: "Leipzig", latitude: "51.339695", longitude: "12.373075" },
    { name: "Mannheim", latitude: "49.487459", longitude: "8.466040" },
    { name: "München", latitude: "48.135125", longitude: "11.581981" },
    { name: "Münster", latitude: "51.960665", longitude: "7.626135" },
    { name: "Nürnberg", latitude: "49.452103", longitude: "11.076665" },
    { name: "Stuttgart", latitude: "48.775846", longitude: "9.182932" },
    { name: "Wiesbaden", latitude: "50.082580", longitude: "8.243370" },
    { name: "Wuppertal", latitude: "51.256213", longitude: "7.150764" },
];

type CountryPickerProps = {
    onClose: () => void;
    setSelectedCountry: (city: { name: string; latitude: string; longitude: string }) => void;
};

export default function CountryPicker({ onClose, setSelectedCountry }: CountryPickerProps) {
    return (
        <Modal animationType="slide" transparent={true}>
            <View style={styles.modalContent}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Wähle ein Stadt</Text>
                    <Pressable onPress={onClose}>
                        <MaterialIcons style={styles.titleIcon} name="close" size={30}  />
                    </Pressable>
                </View>
                <FlatList
                    data={cities}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                        <Pressable
                            style={styles.cityPicklist}
                            onPress={() => {
                                setSelectedCountry(item);
                                onClose();
                            }}
                        >
                            <View style={styles.cityPicklist}>
                                <Text style={ styles.cityText }>{item.name}</Text>
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