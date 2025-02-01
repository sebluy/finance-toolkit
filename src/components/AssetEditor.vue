<script setup lang="ts">

import {reactive, Reactive} from "vue";
import {Dialog, Toast, Button, useToast} from "primevue";
import {useGlobalStore} from "#src/stores/global.ts";
import {Asset} from "#src/portfolio/asset.ts";

const store = useGlobalStore();
const toast = useToast();

interface EditableAsset {
    symbol: string,
    tags: string,
    expenseRatio: string,
    price: string,
}

const assets: Reactive<EditableAsset[]> = reactive([]);

if (store.assetManager) {
    store.assetManager.assets.forEach(asset => {
        assets.push({
            symbol: asset.symbol,
            tags: asset.tags.join(','),
            expenseRatio: String(asset.expenseRatio),
            price: String(asset.price),
        });
    });
}

const addAsset = () => {
    assets.push({symbol: 'NEW', tags: '', expenseRatio: '', price: ''});
};

const removeAsset = (i: number) => {
    assets.splice(i, 1);
};

const save = () => {
    const newAssets = assets.map((asset: EditableAsset) => {
        return new Asset(
            asset.symbol,
            asset.tags.split(',').map(t => t.trim()),
            Number(asset.expenseRatio),
            Number(asset.price)
        );
    })

    toast.add({severity: 'success', summary: 'Success!', detail: 'Assets updated!', life: 3000});

    store.assetManager?.update(newAssets);
    store.sync.required = true;
    store.save();
    store.editAssets.visible = false;
};

</script>

<template>
    <Toast/>
    <Dialog v-model:visible="store.editAssets.visible" modal header="Edit Assets">

        <table>
            <thead>
            <tr>
                <th></th>
                <th>Amount</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(asset, i) in assets">
                <td><input v-model="asset.symbol"/></td>
                <td><input v-model="asset.tags"/></td>
                <td><input v-model="asset.expenseRatio"/></td>
                <td><input v-model="asset.price"/></td>
                <td>
                    <button @click="removeAsset(i)">X</button>
                </td>
            </tr>
            </tbody>
        </table>

        <button @click="addAsset()">
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