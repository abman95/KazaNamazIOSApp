import {Text, View, StyleSheet, Image} from 'react-native';
import {white} from "colorette";

export default function profileSettings(): JSX.Element {

    return (
        <View style={styles.container}>
            <Text style={ styles.header }>Profil Einstellungen</Text>
            <View style={styles.listMainContainer}>
                <View style={styles.listContainer}>
                    <Image style={ styles.settingsIcons } source={require('../../assets/images/currentLocation.png')}/>
                    <Text style={ styles.listElement1 }>Gewählter Standort</Text>
                </View>
                <View style={styles.listContainer}>
                    <Image style={ styles.settingsIcons } source={require('../../assets/images/pushNotification.png')}/>
                    <Text style={ styles.listElement2 }>Push Benachrichtung</Text>
                </View>
                <View style={styles.listContainer}>
                    <Image style={ styles.settingsIcons } source={require('../../assets/images/pushNotification3.png')}/>
                    <Text style={ styles.listElement3 }>Zeit vor Push Benachrichtigung </Text>
                </View>
                <View style={styles.listContainer}>
                    <Image style={ styles.settingsIcons } source={require('../../assets/images/prayerCall.png')}/>
                    <Text style={ styles.listElement4 }>Ezan</Text>
                </View>
                <View style={styles.listContainer}>
                    <Image style={ styles.settingsIcons } source={require('../../assets/images/prayerTimeMethod1.png')}/>
                    <Text style={ styles.listElement5 }>Gebetszeiten Methoden</Text>
                </View>
                <View style={styles.listContainer}>
                    <Image style={ styles.settingsIcons } source={require('../../assets/images/logOut.png')}/>
                    <Text style={ styles.listElement6 }>Abmelden</Text>
                </View>
                <View style={styles.listContainer}>
                    <Image style={ styles.settingsIcons } source={require('../../assets/images/deleteUser.png')}/>
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
        fontSize: 25,
        fontWeight: "bold",
    },
    listMainContainer: {
        backgroundColor: "#201f1d",
    },
    listContainer: {
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