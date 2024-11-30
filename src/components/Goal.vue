<script setup lang="ts">

import Chart, {ChartItem} from 'chart.js/auto'
import {onMounted} from "vue";
import {portfolios} from "../../data/data.ts";

const render = function () {

    const categories = ['Saved', 'Remaining'];
    let saved = 0;

    for (let portfolio of portfolios) {
        if (portfolio.tags.includes('taxable')) {
            saved += portfolio.value();
        }
    }

    const goal = 250e3;
    const remaining = goal - saved;
    const values = [saved, remaining];

    const element = document.getElementById('goal');

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
    <h1>Goal</h1>
    <div>
        <canvas id="goal"></canvas>
    </div>
</template>

<style scoped>
    div {
        width: 400px;
        margin: auto;
    }
</style>