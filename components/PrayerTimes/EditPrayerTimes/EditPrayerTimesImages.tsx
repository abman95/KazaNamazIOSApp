import React from 'react';
import {
    Text,
    ViewStyle,
    ImageStyle,
    TextStyle,
    View,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';


export const CACHED_IMAGES = {
    AlleGebete: require('../../../assets/images/allPrayerTimesImageCube.png'),
    Morgen: require('../../../assets/images/morgenGebet.jpg'),
    Mittag: require('../../../assets/images/mittagGebet.jpg'),
    Nachmittag: require('../../../assets/images/nachmittagGebet.jpg'),
    Abend: require('../../../assets/images/abendGebet.jpg'),
    Nacht: require('../../../assets/images/nachtGebet.jpg'),
} as const;

type CachedImages = keyof typeof CACHED_IMAGES;

interface PrayerTimesProps {
    prayersImage: CachedImages;
}

export const EditPrayerTimesImages = ({ prayersImage }: PrayerTimesProps): JSX.Element => {
    // Verwende zwischengespeichertes Bild
    const imageSource = CACHED_IMAGES[prayersImage];

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={imageSource}
                    style={styles.prayersImage}
                    defaultSource={imageSource}
                />
                <View style={styles.overlayContainer}>
                    <Text style={ styles.prayersTimeName }>{prayersImage}</Text>
                </View>
            </View>
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        height: width * 0.5,
        width: width * 0.5,
        position: 'relative',
    } as ViewStyle,
    containerHeader: {
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '400',
        color: 'white',
    } as TextStyle,
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    prayersImage: {
        height: width * 0.4,
        width: width * 0.4,
        borderRadius: 10,
    } as ImageStyle,
    overlayContainer: {
        padding: 5,
        borderRadius: 10,
        position: 'absolute',
        top: 0,
        left: 0,
        height: width * 0.4,
        width: width * 0.4,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    prayersTimeName: {
        fontSize: 20,
        fontWeight: '300',
        color: 'white',
    },
    prayersTimes: {
        fontSize: 27,
        fontWeight: '100',
        color: 'white',
    },
    selectedOptionText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '100',
        textAlign: 'center',
    } as TextStyle,
});
