# KazaNamazApp – Eine Gebetszeit-Tracker und Kaza-Verwaltungs-App für Android & IOS

- **KazaNamazApp**: Eine React Native Expo Anwendung, die es Benutzern ermöglicht, ihre Gebetszeiten zu verfolgen, vergangene Gebete aufzuholen (Kaza) und Statistiken anzuzeigen. Mit einer benutzerfreundlichen Oberfläche bietet sie eine nahtlose Navigation und zahlreiche Funktionen rund um das Gebet.
![KazaNamazReadMeIMG0.png](assets%2Fimages%2FKazaNamazReadMeIMG%2FKazaNamazReadMeIMG0.png)
![KazaNamazReadMeIMG1.png](assets%2Fimages%2FKazaNamazReadMeIMG%2FKazaNamazReadMeIMG1.png)
![KazaNamazReadMeIMG2.png](assets%2Fimages%2FKazaNamazReadMeIMG%2FKazaNamazReadMeIMG2.png)
![KazaNamazReadMeIMG3.png](assets%2Fimages%2FKazaNamazReadMeIMG%2FKazaNamazReadMeIMG3.png)
![KazaNamazReadMeIMG4.png](assets%2Fimages%2FKazaNamazReadMeIMG%2FKazaNamazReadMeIMG4.png)
![KazaNamazReadMeIMG5.png](assets%2Fimages%2FKazaNamazReadMeIMG%2FKazaNamazReadMeIMG5.png)
![KazaNamazReadMeIMG6.png](assets%2Fimages%2FKazaNamazReadMeIMG%2FKazaNamazReadMeIMG6.png)
![KazaNamazReadMeIMG7.png](assets%2Fimages%2FKazaNamazReadMeIMG%2FKazaNamazReadMeIMG7.png)
![KazaNamazReadMeIMG8.png](assets%2Fimages%2FKazaNamazReadMeIMG%2FKazaNamazReadMeIMG8.png)
![KazaNamazReadMeIMG9.png](assets%2Fimages%2FKazaNamazReadMeIMG%2FKazaNamazReadMeIMG9.png)
![KazaNamazReadMeIMG10.png](assets%2Fimages%2FKazaNamazReadMeIMG%2FKazaNamazReadMeIMG10.png)

## Hauptfunktionen
- **Gebetsübersicht**:
    - Anzeige der Gebete für das aktuelle Datum.
    - Vergangene Gebete können als verrichtet oder nicht verrichtet markiert werden.
    - Automatische Deaktivierung von Einträgen für zukünftige Gebete, die noch nicht stattgefunden haben.

- **Gebetsstatistik**:
    - Anzeige von Gebetsstatistiken, einschließlich prozentualer Übersicht über verrichtete und nicht verrichtete Gebete.
    - Fortschrittsdiagramme mit Motivationsnachrichten basierend auf den Gebetsdaten.

- **Gebetseinstellungen**:
    - Auswahl der Stadt und der Berechnungsmethode für Gebetszeiten.
    - Speicherung der Einstellungen mittels AsyncStorage zur Wiederverwendung beim nächsten App-Start.

- **Qibla Finder**:
    - Ein Kompass, der die Richtung zur Qibla anzeigt, ist direkt über die aktuelle Gebetsseite zugänglich.

- **Ezan-Wiedergabe**:
    - Automatische oder manuelle Wiedergabe des Ezans (Gebetsruf) für die aktuelle Gebetszeit.
    - Möglichkeit, die Ezan-Wiedergabe vollständig zu deaktivieren.

## Weitere Features
- **Löschen von Benutzerdaten**:
    - Benutzer können ihr Konto und alle damit verbundenen Daten vollständig löschen.
    - Die App leitet nach dem Löschen zurück zur Startseite.

- **Benutzerfreundlichkeit**:
    - Optimierungen für eine flüssige und intuitive Bedienung, z. B. durch zentrierte Listen, DatePicker-Kompatibilität für iOS und Android, sowie verbesserte Ladezeiten.

- **Fehlerbehebungen**:
    - Korrektur von Berechnungsproblemen wie Division durch Null bei Statistiken.
    - Lokale Zeitzonenunterstützung für Gebetszeiten und Datenbankeinträge.

## Installation und Start
1. **Abhängigkeiten installieren**:
    - Stelle sicher, dass Node.js installiert ist, und führe dann den folgenden Befehl aus:
      `npm install`

2. **Die App starten**:
    - Starte die Anwendung mit Expo:
      `npx expo start`

3. **Die App testen**:
    - Öffne die App mit:
        - einem Android-Emulator
        - einem iOS-Simulator
        - der Expo Go App

## Technologie-Stack
- **Framework**: React Native mit Expo
- **Datenbank**: SQLite für lokale Datenspeicherung
- **State Management**: Context API
- **Storage**: AsyncStorage für persistente Einstellungen