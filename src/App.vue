<script setup lang="ts">

import {Ref, ref} from "vue";
import {assets, portfolios} from "../data/data.ts";
import {PortfolioReport} from "./portfolio.ts";

const format = (number: number) => new Intl.NumberFormat().format(number);

Promise.all(Array.from(assets.values()).map(asset => asset.fetchPrice())).then(() => {
    reports.value = portfolios.map((p) => p.report());
});

const reports: Ref<PortfolioReport[]> = ref([]);

</script>

<template>
    <div v-for="report in reports">
        <h2>{{ report.account }}</h2>
        <p>Contributions: {{ format(report.contributions) }}</p>
        <p>Current Value: {{ format(report.value) }}</p>
        <p>IRR: {{ format(report.irr * 100) + '%' }}</p>
        <p>International: {{ format(report.international * 100) + '%' }}</p>
        <p>Domestic: {{ format(report.domestic * 100) + '%' }}</p>
        <p>Equity: {{ format(report.equity * 100) + '%' }}</p>
        <p>Fixed: {{ format(report.fixed * 100) + '%' }}</p>
        <p>Cash: {{ format(report.cash * 100) + '%' }}</p>
    </div>
</template>

<style scoped>
</style>
