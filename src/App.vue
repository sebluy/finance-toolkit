<script setup lang="ts">

import {computed} from "vue";
import Report from "./components/Report.vue";
import dayjs from "dayjs";
import {Util} from "./Util.ts";
import {useGlobalStore} from "#src/stores/global.ts";
import ExportButton from "#src/components/ExportButton.vue";
import SyncButton from "#src/components/SyncButton.vue";
import DoughnutChartByTag from "#src/components/DoughnutChartByTag.vue";
import DoughnutChartByPortfolioTag from "#src/components/DoughnutChartByPortfolioTag.vue";
import ContributionsByYear from "#src/components/ContributionsByYear.vue";
import NetWorthOverTime from "#src/components/NetWorthOverTime.vue";

const store = useGlobalStore();

const coastFireAmt = computed(() => {
    if (store.reports === undefined) return 0;

    const currentTotal = store.reports[store.reports.length - 1].value;
    const years = dayjs('2061-09-17').diff(dayjs(), 'year', true);
    const realReturn = 1.03;
    return currentTotal * Math.pow(realReturn, years) * 0.035;
});

</script>

<template>
    <export-button/>
    <sync-button/>
    <report/>

    <div v-if="store.reports">
        <h1>Safe Withdrawal Amount</h1>
        <p>{{ Util.formatCurrency(store.reports[store.reports.length - 1].value * 0.025) }}</p>

        <h1>Coast FIRE Amount</h1>
        <p>{{ Util.formatCurrency(coastFireAmt) }}</p>
    </div>

    <doughnut-chart-by-tag
        title="Asset Allocation"
        :categories="['Equity', 'Fixed', 'Cash']"
        :tags="[['equity'], ['fixed'], ['cash']]"
    />

    <doughnut-chart-by-tag
        title="Equity Allocation"
        :categories="['Domestic', 'International']"
        :tags="[['equity', 'domestic'], ['equity', 'international']]"
    />

    <doughnut-chart-by-tag
        title="Fixed Allocation"
        :categories="['Domestic', 'International']"
        :tags="[['fixed', 'domestic'], ['fixed', 'international']]"
    />

    <doughnut-chart-by-portfolio-tag
        title="Retirement vs Taxable"
        :categories="['Retirement', 'Taxable']"
        :tags="[['retirement'], ['taxable']]"
    />

    <doughnut-chart-by-portfolio-tag
        title="Roth vs Traditional"
        :categories="['Roth', 'Traditional']"
        :tags="[['roth'], ['traditional']]"
    />

    <contributions-by-year/>

    <net-worth-over-time/>

<!--    <rent-vs-buy/>-->
<!--    <contributions/>-->
<!--    <goal/>-->
</template>

<style scoped>


</style>
