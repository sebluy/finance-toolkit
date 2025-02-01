<script setup lang="ts">

import Chart, {ChartItem} from 'chart.js/auto'
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import {useGlobalStore} from "#src/stores/global.ts";
import dayjs from "dayjs";
import {saveNetWorth, getNetWorthOverTime, NetWorthLog} from "#src/db.ts";

const store = useGlobalStore();
let chart: Chart|undefined = undefined;

const render = function (log: NetWorthLog[]) {

    const element = document.getElementById('net-worth');

    if (!element) return;

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(element as ChartItem, {
        type: 'line',
        data: {
            labels: log.map(l => l.date),
            datasets: [
                {
                    label: 'Net Worth',
                    data: log.map(l => l.amount),
                },
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                }
            }
        }
    });
};

const capture = () => {
    const total = store.reports[store.reports.length - 1];
    saveNetWorth(dayjs().format('YYYY-MM-DD'), total.value);
    initialize();
};

const initialize = async () => {
    const log = await getNetWorthOverTime();
    render(log);
}

initialize();

</script>

<template>
    <h1>Net Worth Over Time</h1>
    <button @click="capture">Capture</button>
    <canvas id="net-worth"></canvas>
</template>