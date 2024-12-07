<script setup lang="ts">

import Chart, {ChartItem} from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {onMounted, useId} from "vue";
import {useGlobalStore} from "#src/stores/global.ts";
import {PortfolioReport} from "#src/portfolio/portfolio-report.ts";
import {AssetManager} from "#src/portfolio/asset-manager.ts";

const store = useGlobalStore();
const props = defineProps<{
    title: string,
    categories: string[],
    tags: string[][],
}>();

const id = useId();

const render = () => {

    const values = props.tags.map(tagList => {
        const portfolios = store.portfolios.filter(portfolio => {
            return tagList.every(tag => portfolio.tags.includes(tag))
        });

        const merged = portfolios.reduce((t, p) => t.merge(p));
        const report = new PortfolioReport(merged, <AssetManager>store.assetManager);

        return report.value;
    });

    const canvas = document.getElementById(id);

    new Chart(canvas as ChartItem, {
        plugins: [ChartDataLabels],
        type: 'doughnut',
        data: {
            labels: props.categories,
            datasets: [
                {
                    data: values,
                }
            ]
        },
        options: {
            plugins: {
                datalabels: {
                    formatter: (value, ctx) => {
                        const data = <number[]>ctx.chart.data.datasets[0].data;
                        const total = data.reduce((total, data) => total + data, 0)
                        const percentage = value / total * 100
                        return percentage.toFixed(2) + "%";
                    },
                    color: '#fff',
                }
            }
        }
    });
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