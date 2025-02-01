import {Holding} from "./holding.ts";
import {Contribution} from "./contribution.ts";

export class Portfolio {

    account: string;
    tags: string[];
    holdings: Holding[];
    contributions: Contribution[];

    constructor(account: string, tags: string[], holdings: Holding[], contributions: Contribution[]) {
        this.account = account;
        this.tags = tags;
        this.holdings = holdings;
        this.contributions = contributions;
    }

    static deserialize(o: any) {
        return new Portfolio(
            o.account,
            o.tags,
            o.holdings.map((h: any) => new Holding(h.symbol, h.shares)),
            o.contributions.map((c: any) => new Contribution(c.date, c.amount))
        );
    }

    merge(other: Portfolio): Portfolio {
        return new Portfolio(
            'Total',
            this.tags.concat(other.tags),
            this.holdings.concat(other.holdings),
            this.contributions.concat(other.contributions),
        );
    }

    update(account: string, tags: string[], contributions: Contribution[], holdings: Holding[]) {
        this.account = account;
        this.tags = tags;
        this.contributions = contributions;
        this.holdings = holdings;
    }

}
