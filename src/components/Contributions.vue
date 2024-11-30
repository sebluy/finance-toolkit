<script setup lang="ts">

import Chart, {ChartItem} from 'chart.js/auto'
import {onMounted} from "vue";
import {fakeContributions, portfolios} from "../../data/data.ts";
import {min} from "lodash";
import dayjs, {Dayjs} from "dayjs";
import {Util} from "../Util.ts";

const render = function () {

    const contributions = portfolios.flatMap((portfolio) => portfolio.contributions);
    contributions.push(...fakeContributions);

    const data = new Map();
    const minDate = min(contributions.map(c => c.date)) as Dayjs;

    for (let i = minDate.startOf('month'); i <= dayjs(); i = i.add(1, 'month')) {
        data.set(i.format('YYYY-MM'), 0);
    }

    contributions.forEach((contribution) => {
        const month = contribution.date.startOf('month').format('YYYY-MM');
        data.set(month, data.get(month) + contribution.amount);
    });

    const months = [...data.keys()].sort();
    const values = months.map((month) => data.get(month));
    const rolling12 = Util.rollingAverage(values, 12);

    const element = document.getElementById('contributions');

    if (!element) return;

    new Chart(element as ChartItem, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Contributions by month',
                        data: values,
                    },
                    {
                        label: 'Rolling 12 Month Average',
                        data: rolling12,
                    }
                ]
            }
        }
    );
};

onMounted(() => render());

</script>

<template>
    <h1>Contributions Per Month</h1>
    <canvas id="contributions"></canvas>
</template>