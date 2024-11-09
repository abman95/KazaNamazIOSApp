import {Text, View, StyleSheet, Image} from 'react-native';

export default function profileSettings(): JSX.Element {

    return (
        <View style={styles.container}>
            <Text style={ styles.header }>Profil Einstellungen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    header: {
        marginTop: 70,
        alignSelf: "center",
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
    }
});