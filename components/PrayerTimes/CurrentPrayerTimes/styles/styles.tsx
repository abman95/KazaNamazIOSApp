// src/components/prayers/styles.ts
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

const styles = StyleSheet.create({
    container: {
        padding: 2,
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    } as ViewStyle,
    containerHeader: {
        paddingLeft: 55,
        paddingRight: 25,
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '400',
        color: 'white',
    } as TextStyle,
    ezanVolumeButton: {
        width: 30,
        height: 30,
    },
    ezanVolumeImage: {
        width: 30,
        height: 30,
        tintColor: "white",
    },
    remainingPrayerTime: {
        marginTop: 5,
        color: 'white',
        fontSize: 20,
        fontWeight: '100',
    } as TextStyle,
    prayersImage: {
        marginTop: 20,
        width: 190,
        height: 190,
        borderRadius: 60,
    } as ImageStyle,
    prayersTimeText: {
        marginTop: 15,
        textAlign: 'center',
        fontSize: 19,
        fontWeight: '200',
        color: 'white',
    } as TextStyle,
    currentPrayerContainer: {
        alignItems: 'center',
    } as ViewStyle,
    linearGradientContainer: {
        margin: 20,
        borderColor: 'white',
        borderWidth: 0.5,
        display: 'flex',
        flexDirection: 'row',
        width: 200,
        height: 50.5,
        borderRadius: 10,
    } as ViewStyle,
    selectedOptionText: {
        marginTop: 15,
        textAlign: 'center',
        width: '80%',
        height: 50.5,
        fontSize: 15,
        fontWeight: '300',
    } as TextStyle,
    optionSelector: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        width: 50,
        height: 50.5,
        position: 'absolute',
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'solid',
        backgroundColor: 'white',
    } as ViewStyle,
    editImage: {
        width: 20,
        height: 20,
        tintColor: 'black',
    } as ImageStyle,
    arrowIcon: {
        marginTop: 10,
        width: 40,
        height: 40,
        tintColor: '#ffffff',
        opacity: 0.25,
    } as ImageStyle,
    nextPrayerContainer: {
        marginTop: -20,
        flex: 0.75,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        opacity: 0.3,
    } as ViewStyle,
    nextPrayerImage: {
        width: 140,
        height: 140,
        borderRadius: 140,
        marginBottom: 10,
    } as ImageStyle,
    nextPrayersTimeText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '200',
        marginBottom: 10,
    } as TextStyle,
});

export default styles