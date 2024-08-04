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
}
