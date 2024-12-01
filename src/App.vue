<script setup lang="ts">

import {computed} from "vue";
import Contributions from "./components/Contributions.vue";
import Goal from "./components/Goal.vue";
import RetirementVsTaxable from "./components/RetirementVsTaxable.vue";
import Report from "./components/Report.vue";
import RentVsBuy from "./components/RentVsBuy.vue";
import dayjs from "dayjs";
import {Util} from "./Util.ts";
import {useGlobalStore} from "#src/stores/global.ts";

const store = useGlobalStore();

const coastFireAmt = computed(() => {
    if (store.reports === undefined) return 0;

    const currentTotal = store.reports[store.reports.length - 1].value;
    const years = dayjs('2061-09-17').diff(dayjs(), 'year', true);
    const realReturn = 1.03;
    return currentTotal * Math.pow(realReturn, years) * 0.035;
});

const exportJSON = () => {
    const json = JSON.stringify(store.serialize(), null, 4);
    const data = "data:text/json;charset=utf-8," + encodeURIComponent(json);
    const el = document.createElement('a');
    el.setAttribute('href', data);
    el.setAttribute('download', 'finance-toolkit.json');
    document.body.appendChild(el);
    el.click();
    el.remove();
}

</script>

<template>
    <button @click="exportJSON()">Export</button>
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
