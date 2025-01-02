import Dexie, { type EntityTable } from 'dexie';

interface NetWorthLog {
    date: string,
    amount: number,
}

const db = new Dexie('finance-toolkit') as Dexie & {
    netWorthOverTime: EntityTable<NetWorthLog, 'date'>
};

db.version(1).stores({
    netWorthOverTime: 'date',
});

const saveNetWorth = (date: string, amount: number) => {
    return db.netWorthOverTime.add({date, amount});
};

const getNetWorthOverTime = (): Promise<NetWorthLog[]> => {
    return db.netWorthOverTime.toArray();
}

export {
    saveNetWorth,
    getNetWorthOverTime,
};

export type {
    NetWorthLog,
};