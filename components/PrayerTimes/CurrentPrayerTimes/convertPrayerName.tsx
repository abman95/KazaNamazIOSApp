
export const convertPrayerName = (prayerName: string): string => {
    const prayerMapping: { [key: string]: string } = {
        "Morgengebet": "Morgen",
        "Mittagsgebet": "Mittag",
        "Nachmittagsgebet": "Nachmittag",
        "Abendgebet": "Abend",
        "Nachtgebet": "Nacht"
    };

    // Wenn der Gebetsname existiert, wird er konvertiert
    return prayerMapping[prayerName];
};
