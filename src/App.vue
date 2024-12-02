<script setup lang="ts">

import {computed} from "vue";
import Report from "./components/Report.vue";
import dayjs from "dayjs";
import {Util} from "./Util.ts";
import {useGlobalStore} from "#src/stores/global.ts";
import ExportButton from "#src/components/ExportButton.vue";
import SyncButton from "#src/components/SyncButton.vue";

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

<!--    <rent-vs-buy/>-->
<!--    <contributions/>-->
<!--    <goal/>-->
<!--    <retirement-vs-taxable/>-->
</template>

<style scoped>


</style>
