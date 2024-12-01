import {Asset} from "./asset.ts";
import {Contribution} from "./contribution.ts";
import {Portfolio} from "#src/portfolio/portfolio.ts";
import {Holding} from "#src/portfolio/holding.ts";

export class PortfolioReport {
    portfolio: Portfolio;
    assets: Map<string, Asset>;
    contributions: number;
    value: number;
    irr: number;
    domestic: number;
    international: number;
    equity: number;
    fixed: number;
    cash: number;
    expenseRatio: number;

    constructor(portfolio: Portfolio, assets: Map<string, Asset>) {
        this.portfolio = portfolio;
        this.assets = assets;

        this.contributions = this.portfolio.contributions.reduce((sum, c) => c.amount + sum, 0);
        this.value = this.presentValue();
        const domestic = this.presentValue(this.filterHoldingsByTag('domestic'));
        const international = this.presentValue(this.filterHoldingsByTag('international'));
        const equity = this.presentValue(this.filterHoldingsByTag('equity'));
        const fixed = this.presentValue(this.filterHoldingsByTag('fixed'));
        const cash = this.presentValue(this.filterHoldingsByTag('cash'));

        this.irr = Contribution.findIRR(this.portfolio.contributions, this.value);
        this.domestic = domestic / this.value;
        this.international = international / this.value;
        this.equity = equity / this.value;
        this.fixed = fixed / this.value;
        this.cash = cash / this.value;
        this.expenseRatio = this.calculateExpenseRatio();
    }

    presentValue(holdings?: Holding[]): number {
        holdings ??= this.portfolio.holdings;

        return holdings.reduce((sum, holding) => {
            return sum + holding.shares * this.assetPrice(holding.symbol);
        }, 0);
    }

    assetPrice(symbol: string): number {
        return this.assets.get(symbol)?.price ?? 0;
    }

    assetExpenses(symbol: string): number {
        return this.assets.get(symbol)?.expenseRatio ?? 0;
    }

    filterHoldingsByTag(tag: string): Holding[] {
        return this.portfolio.holdings.filter((holding) => {
            return this.assets.get(holding.symbol)?.tags.includes(tag);
        });
    }

    calculateExpenseRatio(): number {
        const expenses = this.portfolio.holdings.reduce((sum, holding) => {
            return sum + holding.shares * this.assetPrice(holding.symbol) * this.assetExpenses(holding.symbol);
        }, 0);
        return expenses / this.value;
    }

}
