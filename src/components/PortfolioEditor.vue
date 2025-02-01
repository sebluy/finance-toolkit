<script setup lang="ts">

import {Ref, ref, watch} from "vue";
import {Dialog, Toast, Button, useToast} from "primevue";
import {useGlobalStore} from "#src/stores/global.ts";
import {cloneDeep} from "lodash";
import {Holding} from "#src/portfolio/holding.ts";
import {Util} from "#src/Util.ts";
import dayjs from "dayjs";
import {Contribution} from "#src/portfolio/contribution.ts";

interface EditableContribution {
    date: string,
    amount: number,
}

const store = useGlobalStore();
const toast = useToast();
const contributions: Ref<EditableContribution[]> = ref([]);
const holdings: Ref<Holding[]> = ref([]);
const account = ref('');
const tags = ref('');

const reset = () => {
    const portfolio = store.portfolios[store.editPortfolio.id];
    contributions.value = portfolio.contributions.map(
        c => ({date: Util.formatDate(c.date), amount: c.amount})
    );
    holdings.value = cloneDeep(portfolio.holdings);
    tags.value = portfolio.tags.join(', ');
    account.value = portfolio.account;
};

watch(() => store.editPortfolio.id, reset);
reset();

const removeContribution = (i: number) => {
    contributions.value.splice(i, 1);
};

const addContribution = () => {
    contributions.value.push({date: Util.formatDate(dayjs()), amount: 0});
};

const removeHolding = (i: number) => {
    holdings.value.splice(i, 1);
};

const addHolding = () => {
    holdings.value.push(new Holding('', 0));
};

const save = () => {
    const newHoldings = holdings.value.map(h => new Holding(h.symbol, Number(h.shares)));
    const newContributions = contributions.value.map(c => new Contribution(c.date, Number(c.amount)));
    const newTags = tags.value.split(',').map(t => t.trim());

    if (newHoldings.find(h => !h.isValid())) {
        toast.add({severity: 'error', summary: 'Error', detail: 'Invalid holding', life: 3000});
        return;
    }

    if (newContributions.find(c => !c.isValid())) {
        toast.add({severity: 'error', summary: 'Error', detail: 'Invalid contribution', life: 3000});
        return;
    }

    toast.add({severity: 'success', summary: 'Success!', detail: 'Portfolio updated!', life: 3000});

    store.portfolios[store.editPortfolio.id].update(account.value, newTags, newContributions, newHoldings);
    store.sync.required = true;
    store.save();
    store.editPortfolio.visible = false;
};

</script>

<template>
    <Toast/>
    <Dialog v-model:visible="store.editPortfolio.visible" modal header="Edit Portfolio">

        <input v-model="account" placeholder="Account"/>

        <h4>Tags</h4>

        <input v-model="tags" placeholder="Tags"/>

        <h4>Contributions</h4>

        <table>
            <thead>
            <tr>
                <th>Date</th>
                <th>Amount</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(contribution, i) in contributions">
                <td><input v-model="contribution.date"/></td>
                <td><input v-model="contribution.amount"/></td>
                <td>
                    <button @click="removeContribution(i)">X</button>
                </td>
            </tr>
            </tbody>
        </table>

        <button @click="addContribution()">
            New
        </button>

        <h4>Holdings</h4>

        <table>
            <thead>
            <tr>
                <th>Symbol</th>
                <th>Shares</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(holding, i) in holdings">
                <td><input v-model="holding.symbol"/></td>
                <td><input v-model="holding.shares"/></td>
                <td>
                    <button @click="removeHolding(i)">X</button>
                </td>
            </tr>
            </tbody>
        </table>

        <button @click="addHolding()">
            New
        </button>

        <div class="flex justify-end gap-2">
            <Button type="button" label="Save" @click="save()"></Button>
        </div>
    </Dialog>
</template>

<style scoped>

td, th {
    padding: 10px;
}

table {
    margin-left: auto;
    margin-right: auto;
}

</style>