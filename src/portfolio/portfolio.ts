import {Holding} from "./holding.ts";
import {Asset} from "./asset.ts";
import {Contribution} from "./contribution.ts";
import {assets} from "../../data/data.ts";

export type PortfolioReport = {
    account: string,
    contributions: number,
    value: number,
    irr: number,
    domestic: number,
    international: number,
    equity: number,
    fixed: number,
    cash: number,
    expenseRatio: number,
};

export class Portfolio {

    account: string;
    holdings: Holding[];
    contributions: Contribution[];
    assets: Map<string, Asset>;

    constructor(account: string, holdings: Holding[], contributions: Contribution[], assets: Map<string, Asset>) {
        this.account = account;
        this.holdings = holdings;
        this.contributions = contributions;
        this.assets = assets;
    }

    value() {
        return this.holdings.reduce((sum, holding) => {
            return sum + holding.shares * this.assetPrice(holding.symbol);
        }, 0);
    }

    assetPrice(symbol: string): number {
        return this.assets.get(symbol)?.price ?? 0;
    }

    assetExpenses(symbol: string): number {
        return this.assets.get(symbol)?.expenseRatio ?? 0;
    }

    filterByTag(tag: string): Portfolio {
        return new Portfolio(
            this.account,
            this.holdings.filter((holding) => {
                return this.assets.get(holding.symbol)?.tags.includes(tag);
            }),
            this.contributions,
            this.assets,
        );
    }

    report(): PortfolioReport {
        const contributionSum = this.contributions.reduce((sum, c) => c.amount + sum, 0);
        const value = this.value();
        const domestic = this.filterByTag('domestic').value();
        const international = this.filterByTag('international').value();
        const equity = this.filterByTag('equity').value();
        const fixed = this.filterByTag('fixed').value();
        const cash = this.filterByTag('cash').value();

        const irr = Contribution.findIRR(this.contributions, value);

        return {
            account: this.account,
            contributions: contributionSum,
            value,
            irr,
            domestic: domestic / value,
            international: international / value,
            equity: equity / value,
            fixed: fixed / value,
            cash: cash / value,
            expenseRatio: this.expenseRatio(),
        };
    }

    merge(other: Portfolio): Portfolio {
        return new Portfolio(
            'Total',
            this.holdings.concat(other.holdings),
            this.contributions.concat(other.contributions),
            assets,
        );
    }

    expenseRatio(): number {
        const expenses = this.holdings.reduce((sum, holding) => {
            return sum + holding.shares * this.assetPrice(holding.symbol) * this.assetExpenses(holding.symbol);
        }, 0);
        return expenses / this.value();
    }
}
