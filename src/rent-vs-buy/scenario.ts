import {sum} from "lodash";

export class Scenario {

    homePrice: number = 0;
    downPaymentPercent: number = 0;
    mortgageRate: number = 0;
    propertyTaxRate: number = 0;
    homeInsuranceRate: number = 0;
    maintenanceCost: number = 0;
    buyingCosts: number = 0;
    sellingCosts: number = 0;
    homeAppreciation: number = 0;
    rent: number = 0;
    rentersInsurance: number = 0;
    securityDepositPercent: number = 0;
    rentAppreciation: number = 0;
    investmentReturn: number = 0;
    standardDeduction: number = 0;
    saltLimit: number = 0;
    stateTax: number = 0;
    fedTaxRate: number = 0;

    constructor(source: Partial<Scenario>) {
        Object.assign(this, source);
    }

    run(months = 1200) {

        let rent = this.rent;
        let homePrice = this.homePrice;
        let homeOC = 0;
        let debt = this.homePrice * (1 - this.downPaymentPercent / 100);

        const monthly = {
            investmentReturn: Math.pow(1 + this.investmentReturn / 100, 1/12),
            rentAppreciation: Math.pow(1 + this.rentAppreciation / 100, 1/12),
            homeAppreciation: Math.pow(1 + this.homeAppreciation / 100, 1/12),
            homeInsuranceRate: this.homeInsuranceRate / 100 / 12,
            propertyTaxRate: this.propertyTaxRate / 100 / 12,
            maintenanceCost: this.maintenanceCost / 100 / 12,
            mortgageRate: this.mortgageRate / 100 / 12,
        };

        const mortgagePayment = this.mortgagePayment();

        const records: {[p: string]: number[]} = {
            propertyTax: [],
            interest: [],
        };

        for (let i = 0; i < months; i += 1) {

            const interest = debt * monthly.mortgageRate;
            debt = debt + interest - mortgagePayment;

            // monthly costs
            let rentingExpenses = rent + rent * this.rentersInsurance / 100;

            const propertyTax = homePrice * monthly.propertyTaxRate;

            let owningExpenses = mortgagePayment +
                homePrice * monthly.homeInsuranceRate +
                homePrice * monthly.maintenanceCost +
                propertyTax;

            records.propertyTax.push(propertyTax);
            records.interest.push(interest);

            if (i === 0) {
                rentingExpenses += this.securityDepositPercent / 100 * this.rent;
                owningExpenses += (this.downPaymentPercent + this.buyingCosts) / 100 * this.homePrice;
            }

            if ((i + 1) % 12 === 0) {
                owningExpenses -= this.taxDeduction(records);
            }

            const netCost = owningExpenses - rentingExpenses;
            homeOC += netCost;

            rent *= monthly.rentAppreciation;
            homePrice *= monthly.homeAppreciation;
            homeOC *= monthly.investmentReturn;

            // sale compensation
            const salePrice = homePrice * (1 - this.sellingCosts / 100);
            const saleNet = salePrice - debt;
            const netGain = saleNet - homeOC - this.securityDepositPercent / 100 * this.rent;

            if (netGain > 0) {
                return i / 12;
            }
        }

        return 0;
    }

    mortgagePayment(n = 360) {
        const p = this.homePrice * (1 - this.downPaymentPercent / 100);
        const r = this.mortgageRate / 100 / 12;

        return p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    }

    taxDeduction(records: { [p: string]: number[] }) {
        const salt = this.stateTax + sum(records.propertyTax.slice(-12));
        const interest = sum(records.interest.slice(-12));
        const taxFree = Math.min(this.saltLimit, salt) + interest - this.standardDeduction;
        return Math.max(taxFree, 0) * this.fedTaxRate / 100;
    }
}
