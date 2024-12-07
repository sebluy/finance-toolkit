<script setup lang="ts">

import {Util} from "../Util.ts";
import PortfolioEditor from "#src/components/PortfolioEditor.vue";
import {useGlobalStore} from "#src/stores/global.ts";
import dayjs from "dayjs";
import dayOfYear from 'dayjs/plugin/dayOfYear';

dayjs.extend(dayOfYear);

const store = useGlobalStore();

const grid = new Map();
const yearlyTotal = new Map();

store.portfolios.forEach(portfolio => {
    portfolio.contributions.forEach(contribution => {
        let byYear = grid.get(portfolio.account) ?? new Map();
        const year = contribution.date.format('YYYY');

        byYear.set(year, (byYear.get(year) ?? 0) + contribution.amount);
        yearlyTotal.set(year, (yearlyTotal.get(year) ?? 0) + contribution.amount);
        grid.set(portfolio.account, byYear);
    })
});

const accounts = [...grid.keys()];

const years = [...yearlyTotal.keys()].sort().reverse();

</script>

<template>
    <h1>Contributions By Year</h1>
    <table>
        <thead>
        <tr>
            <th>Year</th>
            <th v-for="account in accounts">{{ account }}</th>
            <th>Total</th>
            <th>Projected</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="year in years">
            <td>{{ year }}</td>
            <td v-for="account in accounts">
                {{ Util.formatCurrency(grid.get(account)?.get(year) ?? 0) }}
            </td>
            <td>{{ Util.formatCurrency(yearlyTotal.get(year)) }}</td>
            <td v-if="year === dayjs().format('YYYY')">
                {{ Util.formatCurrency(yearlyTotal.get(year) * 365 / dayjs().dayOfYear()) }}
            </td>
        </tr>
        </tbody>
    </table>

    <portfolio-editor/>
</template>

<style scoped>

td, th {
    padding: 10px;
}

</style>