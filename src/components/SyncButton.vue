<script setup lang="ts">

import {useGlobalStore} from "#src/stores/global.ts";
import {useToast} from "primevue";
import {Dropbox} from "dropbox";

const store = useGlobalStore();
const toast = useToast();

const sync = () => {
    store.sync.pending = true;

    const dbx = new Dropbox({accessToken: store.sync.accessToken});

    dbx.filesUpload({
        path: '/Apps/FinanceToolkit/finance-data.json',
        contents: JSON.stringify(store.serialize()),
        autorename: true,
    }).then((response: any) => {
        console.log(response);
        store.sync.pending = false;
        store.sync.required = false;
        store.save();
        toast.add({severity: 'success', summary: 'Success!', detail: 'Data synced!', life: 3000});
    }).catch((err: any) => {
        console.log(err);
        toast.add({severity: 'error', summary: 'Error!', detail: 'Something went wrong...', life: 3000});
    });

};

</script>

<template>
    <button @click="sync()" :disabled="store.sync.pending || !store.sync.required">Sync</button>
</template>