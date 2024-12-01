import {defineStore} from "pinia";
import {computed, reactive, ref} from "vue";
import {alphaVantageApiKey, assets, fakeContributions, portfolios, rentVsBuy} from "../../data/data.ts";
import {Asset} from "#src/portfolio/asset.ts";
import {PortfolioReport} from "#src/portfolio/portfolio-report.ts";

export const useGlobalStore = defineStore('global', () => {

    const pricesLoaded = ref(false);
    const rPortfolios = ref(portfolios);
    // const rAssets = ref(assets);

    const reports = computed(() => {
        if (!pricesLoaded.value) return undefined;
        const rs = rPortfolios.value.map((p) => new PortfolioReport(p, assets));
        const merged = rPortfolios.value.reduce((t, p) => t.merge(p));
        rs.push(new PortfolioReport(merged, assets));
        return rs;
    });

    Asset.fetchPrices([...assets.values()], alphaVantageApiKey).then(() => {
        pricesLoaded.value = true;
        save();
    });

    const save = () => {
        localStorage.setItem('ft-data', JSON.stringify({
            portfolios,
            assets: [...assets.values()],
            fakeContributions,
            rentVsBuy,
            alphaVantageApiKey,
        }));
    };

    const load = () => {};

    return {
        pricesLoaded,
        portfolios: rPortfolios,
        editPortfolio: reactive({
            visible: false,
            id: 0,
        }),
        reports,
        save,
        load,
    }
})