import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

interface KazaNamaz {
    id: number;
    date: string;
    prayerTime: string;
    status: string;
}

interface KazaPrayerStatus {
    prayerTime: string;
    status: string;
}

interface PrayerStatistic {
    prayerTime: "Morgen" | "Mittag" | "Nachmittag" | "Abend" | "Nacht";
    count: number;
}

export default class DatabaseService {
    private db: SQLite.SQLiteDatabase | null = null;
    private readonly dbName = 'kaza-namaz.db';

    public async initializeDatabase(): Promise<void> {
        if (this.db) return;

        try {
            const dbDirectory = FileSystem.documentDirectory + 'SQLite/';
            const dbDirInfo = await FileSystem.getInfoAsync(dbDirectory);

            if (!dbDirInfo.exists) {
                await FileSystem.makeDirectoryAsync(dbDirectory, { intermediates: true });
            }

            this.db = await SQLite.openDatabaseAsync(this.dbName);
            await this.createTables();
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Database initialization error:', error);
            throw error;
        }
    }

    private async createTables(): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS KazaNamaz (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                prayerTime TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'offen'
            )
        `);
    }

    async addKazaNamaz(date: string, prayerTime: string, status: string): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        try {
            const existing = await this.db.getAllAsync<KazaNamaz>(
                'SELECT * FROM KazaNamaz WHERE date = ? AND prayerTime = ?',
                [date, prayerTime]
            );

            if (existing.length > 0) {
                await this.db.runAsync(
                    'UPDATE KazaNamaz SET status = ? WHERE date = ? AND prayerTime = ?',
                    [status, date, prayerTime]
                );
            } else {
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

            return result.length > 0 ? result[0].status : 'offen';
        } catch (error) {
            console.error('Error getting prayer status:', error);
            throw error;
        }
    }

    async getNotPrayedDataStatistic(dateStart: string, dateEnd: string): Promise<PrayerStatistic[]> {
        if (!this.db) throw new Error('Database not initialized');

        try {
            return await this.db.getAllAsync<PrayerStatistic>(`
                SELECT 
                    prayerTime,
                    COUNT(*) as count
                FROM KazaNamaz 
                WHERE date BETWEEN ? AND ?
                AND status = 'offen'
                GROUP BY prayerTime
                ORDER BY CASE prayerTime 
                    WHEN 'Morgen' THEN 1 
                    WHEN 'Mittag' THEN 2 
                    WHEN 'Nachmittag' THEN 3 
                    WHEN 'Abend' THEN 4 
                    WHEN 'Nacht' THEN 5 
                END
            `, [dateStart, dateEnd]);
        } catch (error) {
            console.error('Error getting prayer statistics:', error);
            throw error;
        }
    }

    async getPrayedDataStatistic(dateStart: string, dateEnd: string): Promise<PrayerStatistic[]> {
        if (!this.db) throw new Error('Database not initialized');

        try {
            return await this.db.getAllAsync<PrayerStatistic>(`
                SELECT 
                    prayerTime,
                    COUNT(*) as count
                FROM KazaNamaz 
                WHERE date BETWEEN ? AND ?
                AND status = 'erledigt'
                GROUP BY prayerTime
                ORDER BY CASE prayerTime 
                    WHEN 'Morgen' THEN 1 
                    WHEN 'Mittag' THEN 2 
                    WHEN 'Nachmittag' THEN 3 
                    WHEN 'Abend' THEN 4 
                    WHEN 'Nacht' THEN 5 
                END
            `, [dateStart, dateEnd]);
        } catch (error) {
            console.error('Error getting prayer statistics:', error);
            throw error;
        }
    }

    async getPrayersStatusByChoosenDate(date: string): Promise<KazaPrayerStatus[]> {
        if (!this.db) throw new Error('Database not initialized');

        try {
            const result = await this.db.getAllAsync<KazaPrayerStatus>(`
                SELECT prayerTime, status 
                FROM KazaNamaz 
                WHERE date = ? AND prayerTime IN ('Morgen', 'Mittag', 'Nachmittag', 'Abend', 'Nacht') 
                ORDER BY CASE prayerTime 
                    WHEN 'Morgen' THEN 1 
                    WHEN 'Mittag' THEN 2 
                    WHEN 'Nachmittag' THEN 3 
                    WHEN 'Abend' THEN 4 
                    WHEN 'Nacht' THEN 5 
                END`, [date]);

            const prayerTimes = ['Morgen', 'Mittag', 'Nachmittag', 'Abend', 'Nacht'];

            return prayerTimes.map(prayerTime => {
                const foundPrayer = result.find(r => r.prayerTime === prayerTime);
                return {
                    prayerTime,
                    status: foundPrayer ? foundPrayer.status : 'offen'
                };
            });
        } catch (error) {
            console.error('Error getting prayer status:', error);
            throw error;
        }
    }
}