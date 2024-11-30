
export class Holding {

    symbol: string;
    shares: number;

    constructor(symbol: string, shares: number) {
        this.symbol = symbol;
        this.shares = shares;
    }

    isValid() {
        return this.symbol !== '' && this.shares > 0;
    }

}
