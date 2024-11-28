import { Audio } from 'expo-av';

let sound: Audio.Sound | null = null;

export async function playEzan() {
    try {
        if (!sound) {
            // Create the sound if it doesn't exist
            const { sound: newSound } = await Audio.Sound.createAsync(
                require('../../assets/music/a1.mp3')
            );
            sound = newSound;
        }

        const status = await sound.getStatusAsync();
        if (!(status.isLoaded) || status.isPlaying) {
            await sound.pauseAsync();
            await sound.setStatusAsync({ positionMillis: 0 });
        } else {
            await sound.playAsync();
        }
    } catch (error) {
        console.error('Error playing ezan:', error);
    }
}


export async function resetEzan() {
    try {
        if (sound) {
            console.log("SCHRITT1")
            const status = await sound.getStatusAsync();
            if (!(status.isLoaded) || status.isPlaying) {
                await sound.pauseAsync();
                await sound.setStatusAsync({ positionMillis: 0 });
            }
        } else if (!sound) {
            console.log("SCHRITT2")

            // Create the sound if it doesn't exist
            const { sound: newSound } = await Audio.Sound.createAsync(
                require('../../assets/music/a1.mp3')
            );
            sound = newSound;
            const status = await sound.getStatusAsync();
            if (!(status.isLoaded) || status.isPlaying) {
                await sound.pauseAsync();
                await sound.setStatusAsync({ positionMillis: 0 });
            }
        }
    } catch (error) {
        console.error('Error playing ezan:', error);
    }
}