import { View, StyleSheet, Button} from "react-native";
import { useNavigation } from '@react-navigation/native';

    export default function NotFoundScreen() {
        const navigation = useNavigation();

        return (
            <View style={styles.container}>
                <Button
                    title="Go back to PrayerEditsPage screen!"
                    onPress={() => navigation.navigate('index')}
                    color="white"
                />
            </View>
        );
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