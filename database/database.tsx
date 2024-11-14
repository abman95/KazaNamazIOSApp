// DatabaseService.ts
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

interface KazaNamaz {
    id: number;
    date: string;
    prayerTime: string;
    status: string;
}

interface KazaPrayerStatus {
    status: string;
}

class DatabaseService {
    // Eine private Eigenschaft `db`, die entweder eine SQLite-Datenbankinstanz oder `null` sein kann.
    // Anfangs ist `db` auf `null` gesetzt, bis die Datenbank geöffnet wird.
    private db: SQLite.SQLiteDatabase | null = null;

    // Der Name der Datenbank, der als Konstante gespeichert ist und nur intern verwendet wird.
    private readonly dbName = 'kaza-namaz.db';

    // Eine asynchrone Methode zur Initialisierung der Datenbank
    public async initializeDatabase() {
        // Überprüft, ob `db` bereits eine Datenbankinstanz enthält, um doppelte Initialisierungen zu verhindern.
        if (this.db) return;

        try {
            // Pfad zum Verzeichnis, in dem die SQLite-Datenbank gespeichert wird /optional
            const dbDirectory = FileSystem.documentDirectory + 'SQLite/';

            // Überprüft, ob das Datenbankverzeichnis bereits existiert. /optional
            const dbDirInfo = await FileSystem.getInfoAsync(dbDirectory);

            // Wenn das Verzeichnis nicht existiert, wird es erstellt.
            // `intermediates: true` stellt sicher, dass alle Zwischenverzeichnisse ebenfalls erstellt werden. /optional
            if (!dbDirInfo.exists) {
                await FileSystem.makeDirectoryAsync(dbDirectory, { intermediates: true });
            }

            // Öffnet die Datenbank mit dem festgelegten Namen (`this.dbName`).
            // Wenn die Datenbank nicht existiert, wird sie automatisch erstellt.
            // Die geöffnete Datenbankinstanz wird `this.db` zugewiesen, sodass `db` nicht mehr `null` ist.
            this.db = await SQLite.openDatabaseAsync(this.dbName);

            // Erstellt die benötigten Tabellen in der Datenbank, falls sie noch nicht existieren.
            await this.createTables();

            // Ausgabe zur Bestätigung der erfolgreichen Initialisierung der Datenbank in der Konsole.
            console.log('Database initialized successfully');
        } catch (error) {
            // Falls während der Initialisierung ein Fehler auftritt, wird dieser in der Konsole ausgegeben.
            // Der Fehler wird erneut ausgelöst (throw), sodass er weiter oben im Code behandelt werden kann.
            console.error('Database initialization error:', error);
            throw error;
        }
    }


    private async createTables() {
        if (!this.db) throw new Error('Database not initialized');

        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS KazaNamaz (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                prayerTime TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'Nicht verrichtet'
            )
        `);
    }

    async addKazaNamaz(date: string, prayerTime: string, status: string): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        try {
            // First check if an entry exists for this date and prayer time
            const existing = await this.db.getAllAsync<KazaNamaz>(
                'SELECT * FROM KazaNamaz WHERE date = ? AND prayerTime = ?',
                [date, prayerTime]
            );

            if (existing.length > 0) {
                // Update existing entry
                await this.db.runAsync(
                    'UPDATE KazaNamaz SET status = ? WHERE date = ? AND prayerTime = ?',
                    [status, date, prayerTime]
                );
            } else {
                // Insert new entry
                await this.db.runAsync(
                    'INSERT INTO KazaNamaz (date, prayerTime, status) VALUES (?, ?, ?)',
                    [date, prayerTime, status]
                );
            }
        } catch (error) {
            console.error('Error adding/updating prayer status:', error);
            throw error;
        }
    }

    async getPrayerStatus(date: string, prayerTime: string): Promise<string> {
        if (!this.db) throw new Error('Database not initialized');

        try {
            const result = await this.db.getAllAsync<KazaPrayerStatus>(
                'SELECT status FROM KazaNamaz WHERE date = ? AND prayerTime = ? ORDER BY id DESC LIMIT 1',
                [date, prayerTime]
            );

            return result.length > 0 ? result[0].status : 'Nicht verrichtet';
        } catch (error) {
            console.error('Error getting prayer status:', error);
            throw error;
        }
    }

    async getPrayerStatusByChoosenDate(date: string): Promise<string> {
        if (!this.db) throw new Error('Database not initialized');

        try {
            const result = await this.db.getAllAsync<KazaPrayerStatus>(
                'SELECT prayerTime, status FROM KazaNamaz WHERE date = ? AND prayerTime IN ("Morgen", "Mittag", "Nachmittag", "Abend", "Nacht") ORDER BY CASE prayerTime WHEN "Morgen" THEN 1 WHEN "Mittag" THEN 2 WHEN "Nachmittag" THEN 3 WHEN "Abend" THEN 4 WHEN "Nacht" THEN 5 END',
                [date]
            );

            return result.length > 0 ? result[0].status : 'Nicht verrichtet';
        } catch (error) {
            console.error('Error getting prayer status:', error);
            throw error;
        }
    }
}

export default DatabaseService;