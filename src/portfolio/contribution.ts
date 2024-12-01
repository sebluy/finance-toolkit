import {Dayjs} from "dayjs";
import dayjs from "dayjs";
import {Util} from "./../Util.ts";

export class Contribution {

    date: Dayjs;
    amount: number;

    constructor(date: string|Dayjs, amount: number) {
        this.date = date instanceof dayjs ? date : dayjs(date);
        this.amount = amount;
    }

    holdingPeriod() {
        return dayjs().diff(this.date, 'year', true);
    }

    isValid() {
        return this.date.isValid() && this.amount > 0;
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

