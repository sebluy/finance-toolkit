<script setup lang="ts">

import {Util} from "../Util.ts";
import PortfolioEditor from "#src/components/PortfolioEditor.vue";
import {useGlobalStore} from "#src/stores/global.ts";
import {Portfolio} from "#src/portfolio/portfolio.ts";

const store = useGlobalStore();

const edit = (i: number) => {
    store.editPortfolio.visible = true;
    store.editPortfolio.id = i;
};

const create = () => {
    store.portfolios.push(new Portfolio('NEW', [], [], []));
};

</script>

<template>
    <h1>Report</h1>
    <button @click="create">Create</button>
    <table>
        <thead>
        <tr>
            <th>Account</th>
            <th></th>
            <th>Contributions</th>
            <th>Current Value</th>
            <th>IRR</th>
            <th>Real IRR</th>
            <th>International</th>
            <th>Domestic</th>
            <th>Equity</th>
            <th>Fixed</th>
            <th>Cash</th>
            <th>Expense Ratio</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(report, i) in store.reports">
            <td>{{ report.portfolio.account }}</td>
            <td><button @click="edit(i)">Edit</button></td>
            <td>{{ Util.formatCurrency(report.contributions) }}</td>
            <td>{{ Util.formatCurrency(report.value) }}</td>
            <td>{{ Util.formatPercent(report.irr) }}</td>
            <td>{{ Util.formatPercent(report.realIrr) }}</td>
            <td>{{ Util.formatPercent(report.international) }}</td>
            <td>{{ Util.formatPercent(report.domestic) }}</td>
            <td>{{ Util.formatPercent(report.equity) }}</td>
            <td>{{ Util.formatPercent(report.fixed) }}</td>
            <td>{{ Util.formatPercent(report.cash) }}</td>
            <td>{{ Util.formatPercent(report.expenseRatio) }}</td>
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