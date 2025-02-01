import dayjs, {Dayjs} from "dayjs";
import {Asset} from "#src/portfolio/asset.ts";

export class AssetManager {

    apiKey: string;
    assets: Map<string, Asset>;
    lastUpdated: Dayjs;

    constructor(apiKey: string, assets: Asset[], lastUpdated: Dayjs) {
        this.apiKey = apiKey;
        this.assets = this.makeMap(assets);
        this.lastUpdated = lastUpdated;
    }

    static deserialize(obj: any) {
        return new AssetManager(
            obj.apiKey,
            obj.assets.map((a: Asset) => Asset.deserialize(a)),
            dayjs(obj.lastUpdated)
        );
    }

    serialize() {
        return {
            apiKey: this.apiKey,
            assets: [...this.assets.values()],
            lastUpdated: this.lastUpdated,
        };
    }

    async fetchPrice(symbol: string) {

        const url =
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`;
        try {
            const response = await fetch(url);
            const json = await response.json();
            return Number(json['Global Quote']['05. price']);
        } catch (error) {
            return 0;
        }

    }

    fetchPrices() {
        if (dayjs().isSame(this.lastUpdated, 'day')) return;
        console.log('fetching prices');
        this.lastUpdated = dayjs();
        return Promise.all([...this.assets.values()].map(async (asset) => {
            if (asset.symbol.startsWith('!')) return;
            asset.price = await this.fetchPrice(asset.symbol);
        }));
    }

    makeMap(assets: Asset[]): Map<string, Asset> {
        const map = new Map();

        assets.forEach((asset) => {
            map.set(asset.symbol, asset);
        });

        return map;
    }

    get(symbol: string): Asset {
        return this.assets.get(symbol) || new Asset(symbol, [], 0, 0);
    }

    update(assets: Asset[]) {
        this.assets = this.makeMap(assets);
    }

}
