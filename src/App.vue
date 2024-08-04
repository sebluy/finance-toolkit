<script setup lang="ts">

import {Ref, ref} from "vue";
import {assets, portfolios} from "../data/data.ts";
import {PortfolioReport} from "./portfolio.ts";

const format = (number: number) => new Intl.NumberFormat().format(number);

Promise.all(Array.from(assets.values()).map(asset => asset.fetchPrice())).then(() => {
    const rs = portfolios.map((p) => p.report());
    rs.push(portfolios.reduce((t, p) => t.merge(p)).report());
    reports.value = rs;
});

const reports: Ref<PortfolioReport[]> = ref([]);

</script>

<template>
    <table>
        <thead>
            <tr>
                <th>Account</th>
                <th>Contributions</th>
                <th>Current Value</th>
                <th>IRR</th>
                <th>International</th>
                <th>Domestic</th>
                <th>Equity</th>
                <th>Fixed</th>
                <th>Cash</th>
                <th>Expense Ratio</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="report in reports">
                <td>{{ report.account }}</td>
                <td>{{ format(report.contributions) }}</td>
                <td>{{ format(report.value) }}</td>
                <td>{{ format(report.irr * 100) + '%' }}</td>
                <td>{{ format(report.international * 100) + '%' }}</td>
                <td>{{ format(report.domestic * 100) + '%' }}</td>
                <td>{{ format(report.equity * 100) + '%' }}</td>
                <td>{{ format(report.fixed * 100) + '%' }}</td>
                <td>{{ format(report.cash * 100) + '%' }}</td>
                <td>{{ format(report.expenseRatio * 100) + '%' }}</td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped>

td, th {
    padding: 10px;
}
</style>
