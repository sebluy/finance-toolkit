import dayjs from "dayjs";

export class Asset {

    static apiKey: string;

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

    async fetchPrice(refresh = false) {

        if (this.symbol === 'CASH') {
            this.price = 1.0;
            return;
        }

        const storageKey = `price-${this.symbol}`;

        if (!refresh) {
            this.price = Number(localStorage.getItem(storageKey)) ?? 0;
            return;
        }

        const url =
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${this.symbol}&apikey=${Asset.apiKey}`;
        try {
            const response = await fetch(url);
            const json = await response.json();
            this.price = Number(json['Global Quote']['05. price']);
            localStorage.setItem(storageKey, String(this.price));
        } catch (error) {
            this.price = Number(localStorage.getItem(storageKey)) ?? 0;
        }

    }

    static fetchPrices(assets: Asset[], apiKey: string)
    {
        Asset.apiKey = apiKey;
        const refresh =
            localStorage.getItem('assets-last-updated') !== dayjs().format('YYYY-MM-DD');

        localStorage.setItem('assets-last-updated', dayjs().format('YYYY-MM-DD'));

        return Promise.all(assets.map(asset => asset.fetchPrice(refresh)));
    }

    static makeMap(assets: Asset[]): Map<string, Asset> {
        const map = new Map();

        assets.forEach((asset) => {
            map.set(asset.symbol, asset);
        });

        return map;
    }

}
