import React, { useState, useEffect, useCallback } from 'react';
import {Modal, StyleSheet, Text, View, Alert, Image, Pressable} from 'react-native';
import { Gyroscope, Magnetometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import {useFocusEffect} from "@react-navigation/native";
import {MaterialIcons} from "@expo/vector-icons";

interface LocationData {
    name: string;
    latitude: string;
    longitude: string;
}

const API_URL = 'https://api.aladhan.com/v1/qibla';

type KiblaModalProps = {
    onClose: () => void;
};

export default function QiblaFinderModal({onClose}: KiblaModalProps): React.JSX.Element {
    const [magnetData, setMagnetData] = useState<Record<string, number>>({ x: 0, y: 0, z: 0 });
    const [rotation, setRotation] = useState(0);
    const [qiblaAngle, setQiblaAngle] = useState(0);
    const [qiblaRotation, setQiblaRotation] = useState(0);
    const [gyroSubscription, setGyroSubscription] = useState<any>(null);
    const [magnetSubscription, setMagnetSubscription] = useState<any>(null);
    const [lastTimestamp, setLastTimestamp] = useState(Date.now());
    const [selectedCountry, setSelectedCountry] = useState<LocationData>({
        name: "0",
        latitude: "0",
        longitude: "0"
    });
    const [isInQiblaDirection, setIsInQiblaDirection] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);



    const QIBLA_TOLERANCE = 5;

    const qiblaImageRotatianAnimation = useCallback(() => {
        const currentAzimuth = Math.round(calculateAzimuth(magnetData.x, magnetData.y));

        let rotationDifference = (currentAzimuth - qiblaAngle + 360) % 360;

        if (rotationDifference > 180) {
            rotationDifference -= 360;
        }
        setQiblaRotation(rotationDifference);
    }, [magnetData, qiblaAngle, rotation]);


    const fetchQiblaDirection = useCallback(async() => {
        fetch(`${API_URL}/${selectedCountry.latitude}/${selectedCountry.longitude}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setQiblaAngle(data.data.direction)
            })
            .catch(error => {
                console.error("Error fetching Qibla direction:", error);
            });
    }, [selectedCountry])

    const fetchSelectedCountry = useCallback(async() => {
        const fetchStoredLocation = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('selectedCountry');
                if (jsonValue != null) {
                    const parsedLocation = JSON.parse(jsonValue);
                    setSelectedCountry(parsedLocation);
                }
            } catch (e) {
                console.error('Fehler beim Laden der Standortdaten:', e);
                Alert.alert('Fehler', 'Standortdaten konnten nicht geladen werden');
            }
        };

        void fetchStoredLocation();
    }, [selectedCountry]);

    useEffect(() => {
        void qiblaImageRotatianAnimation()
    }, [rotation, qiblaAngle, qiblaRotation])

    useEffect(() => {
        const init = async () => {
            try {
                await fetchQiblaDirection();
            } catch (error) {
                console.error("Error during initialization:", error);
            }
        };
        void init();
    }, [selectedCountry]);

    useFocusEffect(
        useCallback(() => {
            const fetchSelectedCountryOnFocus = async () => {
                try {
                    await fetchSelectedCountry();
                } catch (error) {
                    console.error("Error during initialization:", error);
                }
            };
            void fetchSelectedCountryOnFocus();
            return () => {};
        }, [])
    );

    useEffect(() => {
        const loadSound = async () => {
            try {
                const { sound } = await Audio.Sound.createAsync(
                    require('../../assets/music/qibla_sound1.wav'),
                    { shouldPlay: false }
                );
                setSound(sound);
            } catch (error) {
                console.log('Error loading sound', error);
            }
        };

        loadSound();

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    useEffect(() => {
        const playQiblaSound = async () => {
            if (isInQiblaDirection && sound) {
                try {
                    await sound.replayAsync();
                } catch (error) {
                    console.log('Error playing sound', error);
                }
            }
        };

        playQiblaSound();
    }, [isInQiblaDirection, sound]);

    const checkQiblaDirection = useCallback(() => {
        const isNowInQiblaDirection =  Math.round(qiblaRotation) >= -QIBLA_TOLERANCE && Math.round(qiblaRotation) <= QIBLA_TOLERANCE;

        if (isNowInQiblaDirection !== isInQiblaDirection) {
            setIsInQiblaDirection(isNowInQiblaDirection);
        }
    }, [qiblaRotation, isInQiblaDirection]);

    useEffect(() => {
        void checkQiblaDirection()
    }, [qiblaRotation]);

    const calculateAzimuth = useCallback((mx: number, my: number): number => {
        let azimuth = Math.atan2(-my, -mx) * 180 / Math.PI;
        azimuth = (azimuth + 360) % 360;

        const offsetCorrection = -275;

        azimuth = (azimuth + offsetCorrection + 360) % 360;

        return azimuth;
    }, []);

    const _subscribeGyroscope = useCallback(() => {
        if (gyroSubscription) return;

        const newSubscription = Gyroscope.addListener(gyroscopeData => {
            const currentTime = Date.now();
            const deltaTime = (currentTime - lastTimestamp) / 1000;

            const smoothingFactor = 0.1;
            const rotationDelta = -gyroscopeData.z * deltaTime * 57.3 * smoothingFactor;

            setRotation(prevRotation => {
                let smoothedRotation = prevRotation + rotationDelta;
                smoothedRotation = (smoothedRotation + 360) % 360;

                return smoothedRotation;
            });

            setLastTimestamp(currentTime);
        });

        setGyroSubscription(newSubscription);
    }, [gyroSubscription]);

    const _subscribeMagnetometer = useCallback(() => {
        if (magnetSubscription) return;

        const newSubscription = Magnetometer.addListener(magnetometerData => {
            setMagnetData(magnetometerData);
        });

        setMagnetSubscription(newSubscription);
    }, [magnetSubscription]);

    const _unsubscribeGyroscope = useCallback(() => {
        if (gyroSubscription) {
            gyroSubscription.remove();
            setGyroSubscription(null);
        }
    }, [gyroSubscription]);

    const _unsubscribeMagnetometer = useCallback(() => {
        if (magnetSubscription) {
            magnetSubscription.remove();
            setMagnetSubscription(null);
        }
    }, [magnetSubscription]);

    useEffect(() => {
        _subscribeGyroscope();
        _subscribeMagnetometer();

        return () => {
            _unsubscribeGyroscope();
            _unsubscribeMagnetometer();
        };
    }, [_subscribeGyroscope, _subscribeMagnetometer, _unsubscribeGyroscope, _unsubscribeMagnetometer]);

    return (
        <Modal animationType="fade" transparent={true}>
            <View style={styles.container}>
                <View style={{flexDirection: "row", marginTop: 70}}>
                    <Text style={styles.titleText}>Qibla-Kompass</Text>
                    <Pressable onPress={onClose}>
                        <MaterialIcons style={styles.closeIcon} name="close" size={35}  />
                    </Pressable>
                </View>

                <Image
                    source={require('../../assets/images/qiblaCompass2.png')}
                    style={[styles.kabaImage, { transform: [{ rotate: `${qiblaRotation}deg` }] }]}
                />

                <Text style={[styles.directionText, {
                    color: isInQiblaDirection ? 'green' : 'red'
                }]}>
                    {isInQiblaDirection
                        ? 'Zur Qibla ausgerichtet 🕌'
                        : 'Richtung anpassen'}
                </Text>

                <Text style={styles.rotationText}>
                    Stadt: {selectedCountry.name}
                </Text>
                <Text style={styles.rotationText}>
                    Koordinate: {`${selectedCountry.latitude} : ${selectedCountry.longitude}`}°
                </Text>
                <Text style={styles.rotationText}>
                    Gerät Rotationsgrad: {Math.round(calculateAzimuth(magnetData.x, magnetData.y))}°
                </Text>
                <Text style={styles.rotationText}>
                    Qibla-Winkel: {Math.round(qiblaAngle)}°
                </Text>
                <Text style={styles.rotationText}>
                    Gerät-Qibla Abweichungsgrad: {Math.round(qiblaRotation)}°
                </Text>

                <View style={styles.buttonContainer}>
                </View>
            </View>
        </Modal>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'black',
        padding: 20,
    },
    closeIcon: {
        color: "white",
    },
    titleText: {
        fontSize: 28,
        fontWeight: '400',
        color: 'white',
        marginBottom: 20,
        paddingLeft: 80,
        paddingRight: 50,
    },
    directionText: {
        marginTop: 30,
        fontSize: 25,
        fontWeight: '400',
    },
    rotationText: {
        fontSize: 16,
        marginVertical: 5,
        color: 'white',
    },
    kabaImage: {
        width: 330,
        height: 330,
        alignSelf: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    resetButton: {
        backgroundColor: '#FF3B30',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});