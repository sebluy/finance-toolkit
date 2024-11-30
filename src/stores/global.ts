import {defineStore} from "pinia";
import {computed, reactive, ref} from "vue";
import {alphaVantageApiKey, assets, portfolios} from "../../data/data.ts";
import {Asset} from "#src/portfolio/asset.ts";

export const useGlobalStore = defineStore('global', () => {

    const pricesLoaded = ref(false);
    const rPortfolios = ref(portfolios);

    const reports = computed(() => {
        if (!pricesLoaded.value) return undefined;
        const rs = rPortfolios.value.map((p) => p.report());
        rs.push(rPortfolios.value.reduce((t, p) => t.merge(p)).report());
        return rs;
    });

    Asset.fetchPrices([...assets.values()], alphaVantageApiKey).then(() => {
        pricesLoaded.value = true;
    });

    return {
        pricesLoaded,
        portfolios: rPortfolios,
        editPortfolio: reactive({
            visible: false,
            id: 0,
        }),
        reports,
    }
})