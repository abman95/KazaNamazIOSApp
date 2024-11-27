import { View, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function NotFoundScreen() {
    return (
        <View style={ styles.container }>
            <Link href="/app/PrayerAppInitializationScreen" style={styles.button}>Go back to PrayerEditsPage screen!</Link>
        </View>
        )
    }

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        fontSize: 20,
        color: 'white',
    },
});