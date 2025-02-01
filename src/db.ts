import Dexie, { type EntityTable } from 'dexie';

interface NetWorthLog {
    date: string,
    amount: number,
}

interface CPIEntry {
    date: string,
    value: number,
}

const db = new Dexie('finance-toolkit') as Dexie & {
    netWorthOverTime: EntityTable<NetWorthLog, 'date'>
    CPI: EntityTable<CPIEntry, 'date'>
};

db.version(1).stores({
    netWorthOverTime: 'date',
    CPI: 'date',
});

const saveNetWorth = (date: string, amount: number) => {
    return db.netWorthOverTime.add({date, amount});
};

const getNetWorthOverTime = (): Promise<NetWorthLog[]> => {
    return db.netWorthOverTime.toArray();
};

const putCPI = (items: CPIEntry[]) => {
    return db.CPI.bulkPut(items);
}

const getCPI = (): Promise<CPIEntry[]> => {
    return db.CPI.toArray();
};

export {
    saveNetWorth,
    getNetWorthOverTime,
};

export type {
    NetWorthLog,
};