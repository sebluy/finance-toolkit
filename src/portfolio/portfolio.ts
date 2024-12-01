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

    merge(other: Portfolio): Portfolio {
        return new Portfolio(
            'Total',
            this.tags.concat(other.tags),
            this.holdings.concat(other.holdings),
            this.contributions.concat(other.contributions),
        );
    }

    update(contributions: Contribution[], holdings: Holding[]) {
        this.contributions = contributions;
        this.holdings = holdings;
    }

}
