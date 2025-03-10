import {defineStore} from "pinia";
import {computed, Reactive, reactive} from "vue";
import {PortfolioReport} from "#src/portfolio/portfolio-report.ts";
import {Portfolio} from "#src/portfolio/portfolio.ts";
import {AssetManager} from "#src/portfolio/asset-manager.ts";
import {Contribution} from "#src/portfolio/contribution.ts";
import {Scenario} from "#src/rent-vs-buy/scenario.ts";

interface State {
    portfolios: Portfolio[],
    assetManager: AssetManager|undefined,
    fakeContributions: Contribution[],
    rentVsBuy: Scenario,
    editPortfolio: {
        visible: boolean,
        id: number,
    },
    editAssets: {
        visible: boolean,
    },
    sync: {
        pending: boolean,
        required: boolean,
        clientId: string,
        clientSecret: string,
        refreshToken: string,
    }
}

export const useGlobalStore = defineStore('global', () => {

    const state: Reactive<State> = reactive({
        portfolios: [],
        assetManager: undefined,
        fakeContributions: [],
        rentVsBuy: new Scenario({}),
        editPortfolio: {
            visible: false,
            id: 0,
        },
        editAssets: {
            visible: false,
        },
        sync: {
            pending: false,
            required: false,
            clientId: '',
            clientSecret: '',
            refreshToken: '',
        },
    });

    const serialize = () => {
        return {
            portfolios: state.portfolios,
            assetManager: state.assetManager?.serialize(),
            fakeContributions: state.fakeContributions,
            rentVsBuy: state.rentVsBuy,
            sync: {
                required: state.sync.required,
                clientId: state.sync.clientId,
                clientSecret: state.sync.clientSecret,
                refreshToken: state.sync.refreshToken,
            }
        };
    };

    const save = () => {
        console.log('writing ft-data');
        localStorage.setItem('ft-data', JSON.stringify(serialize()));
    };

    const load = async () => {
        const obj = JSON.parse(localStorage.getItem('ft-data') || '');
        console.log(obj);
        state.portfolios = obj.portfolios.map((p: Portfolio) => Portfolio.deserialize(p));
        state.assetManager = AssetManager.deserialize(obj.assetManager);
        state.fakeContributions = obj.fakeContributions.map((c: Contribution) => new Contribution(c.date, c.amount));
        state.rentVsBuy = new Scenario(obj.rentVsBuy);
        state.sync.required = obj.sync.required;
        state.sync.clientId = obj.sync.clientId;
        state.sync.clientSecret = obj.sync.clientSecret;
        state.sync.refreshToken = obj.sync.refreshToken;
        await state.assetManager.fetchPrices();
        save();
    };

    load();

    const reports = computed(() => {
        if (state.assetManager === undefined) return [];
        const rs = state.portfolios.map((p) => new PortfolioReport(p, <AssetManager>state.assetManager));
        const merged = state.portfolios.reduce((t, p) => t.merge(p));
        rs.push(new PortfolioReport(merged, state.assetManager));
        return rs;
    });

    return {
        ...state,
        reports,
        save,
        serialize,
    }
});