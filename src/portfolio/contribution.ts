import {Dayjs} from "dayjs";
import dayjs from "dayjs";
import {Util} from "./../Util.ts";
import {CPI} from "#src/cpi.ts";

export class Contribution {

    date: Dayjs;
    amount: number;

    constructor(date: string|Dayjs, amount: number) {
        this.date = date instanceof dayjs ? date : dayjs(date);
        this.amount = amount;
    }

    realValue() {
        const past = CPI.get(this.date.format('YYYY-MM'));
        const current = CPI.get(dayjs().format('YYYY-MM'));

        if (past === undefined || current === undefined) {
            console.log('Missing CPI', this.date.format('YYYY-MM'));
            return 0;
        }

        return this.amount * current / past;
    }

    holdingPeriod() {
        return dayjs().diff(this.date, 'year', true);
    }

    isValid() {
        return this.date.isValid() && !isNaN(this.amount);
    }

    static valueAtIRR(contributions: Contribution[], irr: number) {
        return contributions.reduce((sum, contribution) => {
            const holdingPeriod = contribution.holdingPeriod();
            const growth = Math.pow(irr, holdingPeriod);
            return sum + contribution.amount * growth;
        }, 0);
    }

    static findIRR(contributions: Contribution[], value: number) {
        return Util.solve(
            (irr: number) => Contribution.valueAtIRR(contributions, irr),
            0.5,
            2.0,
            value
        );
    }


    static realValueAtIRR(contributions: Contribution[], irr: number) {
        return contributions.reduce((sum, contribution) => {
            const holdingPeriod = contribution.holdingPeriod();
            const growth = Math.pow(irr, holdingPeriod);
            return sum + contribution.realValue() * growth;
        }, 0);
    }

    static findRealIRR(contributions: Contribution[], value: number) {
        return Util.solve(
            (irr: number) => Contribution.realValueAtIRR(contributions, irr),
            0.5,
            2.0,
            value
        );
    }
}

