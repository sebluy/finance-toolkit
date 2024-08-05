import {Dayjs} from "dayjs";
import dayjs from "dayjs";
import {Util} from "./../Util.ts";

export class Contribution {

    date: Dayjs;
    amount: number;

    constructor(date: string, amount: number) {
        this.date = dayjs(date);
        this.amount = amount;
    }

    holdingPeriod() {
        return dayjs().diff(this.date, 'year', true);
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
}

