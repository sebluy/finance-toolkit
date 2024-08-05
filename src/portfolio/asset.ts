export class Asset {

    symbol: string;
    tags: string[];
    price: number;
    expenseRatio: number;

    constructor(account: string, tags: string[], expenseRatio: number = 0) {
        this.symbol = account;
        this.tags = tags;
        this.price = 0;
        this.expenseRatio = expenseRatio;
    }

    async fetchPrice() {

        if (this.symbol === 'CASH') {
            this.price = 1.0;
            return;
        }

        const url =
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${this.symbol}&apikey=7UTCO483UR3XP866`;
        const storageKey = `price-${this.symbol}`;
        try {
            const response = await fetch(url);
            const json = await response.json();
            this.price = Number(json['Global Quote']['05. price']);
            localStorage.setItem(storageKey, String(this.price));
        } catch (error) {
            this.price = Number(localStorage.getItem(storageKey)) ?? 0;
        }
    }

    static makeMap(assets: Asset[]): Map<string, Asset> {
        const map = new Map();

        assets.forEach((asset) => {
            map.set(asset.symbol, asset);
        });

        return map;
    }

}
