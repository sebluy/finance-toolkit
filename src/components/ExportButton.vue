<script setup lang="ts">

import {useGlobalStore} from "#src/stores/global.ts";

const store = useGlobalStore();

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
</template>