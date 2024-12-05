<script setup lang="ts">

import Chart, {ChartItem} from 'chart.js/auto'
import {onMounted, useId} from "vue";
import {useGlobalStore} from "#src/stores/global.ts";
import {PortfolioReport} from "#src/portfolio/portfolio-report.ts";
import {AssetManager} from "#src/portfolio/asset-manager.ts";

const store = useGlobalStore();
const props = defineProps<{
    title: string,
    categories: string[],
    tags: string[][],
    total: string[],
}>();

const id = useId();

const render = () => {

    const merged = store.portfolios.reduce((t, p) => t.merge(p));
    const totalReport = new PortfolioReport(merged, <AssetManager>store.assetManager);

    const totalValue = totalReport.presentValue(totalReport.filterHoldingsByTag(...props.total));

    const values = props.tags.map((tagList) => {
        return totalReport.presentValue(totalReport.filterHoldingsByTag(...tagList)) / totalValue * 100;
    })

    const canvas = document.getElementById(id);

    new Chart(canvas as ChartItem, {
            type: 'doughnut',
            data: {
                labels: props.categories,
                datasets: [
                    {
                        data: values,
                    }
                ]
            }
        }
    );
};

onMounted(() => render());

</script>

<template>
    <h1>{{ props.title }}</h1>
    <div>
        <canvas :id="id"></canvas>
    </div>
</template>

<style scoped>
    div {
        width: 400px;
        margin: auto;
    }
</style>