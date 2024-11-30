import {Dayjs} from "dayjs";

export class Util {

    static solve(fn: Function, low: number, high: number, goal: number) {

        for (let i = 0; i < 100; i += 1) {
            const middle = (low + high) / 2;
            const result = fn(middle);

            if (Math.abs(result - goal) < 1) {
                return middle;
            }

            if (result < goal) {
                low = middle;
            } else {
                high = middle;
            }
        }

        return 0;
    }

    static rollingAverage(values: any[], period: number) {
        const result = [];
        let sum = 0;

        for (let i = 0; i < values.length; i += 1) {
            sum -= values[i - period] ?? 0;
            sum += values[i];
            result.push(sum / period);
        }

        return result;
    }

    static formatCurrency(number: number) {
        return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(number);
    }

    static formatNumber(number: number) {
        return new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(number);
    }

    static formatPercent(number: number) {
        return Util.formatNumber(number * 100) + '%';
    }

    static formatDate(date: Dayjs) {
        return date.format('YYYY-MM-DD');
    }

}
