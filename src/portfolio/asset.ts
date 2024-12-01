
export class Asset {

    static apiKey: string;

    symbol: string;
    tags: string[];
    price: number;
    expenseRatio: number;

    constructor(symbol: string, tags: string[], expenseRatio: number = 0, price: number = 0) {
        this.symbol = symbol;
        this.tags = tags;
        this.price = price;
        this.expenseRatio = expenseRatio;
    }

    static deserialize(o: any) {
        return new Asset(o.symbol, o.tags, o.expenseRatio, o.price);
    }

}
