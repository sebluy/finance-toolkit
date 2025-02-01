import {Contribution} from "./contribution.ts";
import {Portfolio} from "#src/portfolio/portfolio.ts";
import {Holding} from "#src/portfolio/holding.ts";
import {AssetManager} from "#src/portfolio/asset-manager.ts";

export class PortfolioReport {
    portfolio: Portfolio;
    assetManager: AssetManager;
    contributions: number;
    value: number;
    irr: number;
    realIrr: number;
    domestic: number;
    international: number;
    equity: number;
    fixed: number;
    cash: number;
    expenseRatio: number;

    constructor(portfolio: Portfolio, assetManager: AssetManager) {
        this.portfolio = portfolio;
        this.assetManager = assetManager;

        this.contributions = this.portfolio.contributions.reduce((sum, c) => c.amount + sum, 0);
        this.value = this.presentValue();
        const domestic = this.presentValue(this.filterHoldingsByTag('domestic'));
        const international = this.presentValue(this.filterHoldingsByTag('international'));
        const equity = this.presentValue(this.filterHoldingsByTag('equity'));
        const fixed = this.presentValue(this.filterHoldingsByTag('fixed'));
        const cash = this.presentValue(this.filterHoldingsByTag('cash'));

        this.irr = Contribution.findIRR(this.portfolio.contributions, this.value);
        this.realIrr = Contribution.findRealIRR(this.portfolio.contributions, this.value);
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
            return sum + holding.shares * this.assetManager.get(holding.symbol).price;
        }, 0);
    }

    filterHoldingsByTag(...tags: string[]): Holding[] {
        return this.portfolio.holdings.filter((holding) => {
            const asset = this.assetManager.get(holding.symbol);
            return tags.every((tag) => asset.tags.includes(tag));
        });
    }

    calculateExpenseRatio(): number {
        const expenses = this.portfolio.holdings.reduce((sum, holding) => {
            return sum + (
                holding.shares *
                this.assetManager.get(holding.symbol).price *
                this.assetManager.get(holding.symbol).expenseRatio
            );
        }, 0);
        return expenses / this.value;
    }

}
