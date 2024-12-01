<script setup lang="ts">

import Chart, {ChartItem} from 'chart.js/auto'
import {onMounted} from "vue";

const render = function () {

    const categories = ['Retirement', 'Taxable'];

    let retirement = 0;
    let taxable = 0;

    for (let portfolio of portfolios) {
        if (portfolio.tags.includes('retirement')) {
            retirement += portfolio.value();
        } else if (portfolio.tags.includes('taxable')) {
            taxable += portfolio.value();
        }
    }

    const values = [retirement, taxable];

    const element = document.getElementById('retirement-vs-taxable');

    if (!element) return;

    new Chart(element as ChartItem, {
            type: 'doughnut',
            data: {
                labels: categories,
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
    <h1>Retirement vs Taxable</h1>
    <div>
        <canvas id="retirement-vs-taxable"></canvas>
    </div>
</template>

<style scoped>
    div {
        width: 400px;
        margin: auto;
    }
</style>