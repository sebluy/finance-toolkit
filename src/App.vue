<script setup lang="ts">

import {computed, reactive, Ref, ref} from "vue";
import {assets, portfolios, rentVsBuy} from "../data/data.ts";
import {PortfolioReport} from "./portfolio/portfolio.ts";

const format = (number: number) => new Intl.NumberFormat().format(number);

Promise.all(Array.from(assets.values()).map(asset => asset.fetchPrice())).then(() => {
    const rs = portfolios.map((p) => p.report());
    rs.push(portfolios.reduce((t, p) => t.merge(p)).report());
    reports.value = rs;
});

const rentVsBuyR = reactive(rentVsBuy);
const reports: Ref<PortfolioReport[]> = ref([]);
const breakEven = computed(() => rentVsBuyR.run());

</script>

<template>
    <h1>Portfolios</h1>
    <table>
        <thead>
            <tr>
                <th>Account</th>
                <th>Contributions</th>
                <th>Current Value</th>
                <th>IRR</th>
                <th>International</th>
                <th>Domestic</th>
                <th>Equity</th>
                <th>Fixed</th>
                <th>Cash</th>
                <th>Expense Ratio</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="report in reports">
                <td>{{ report.account }}</td>
                <td>{{ format(report.contributions) }}</td>
                <td>{{ format(report.value) }}</td>
                <td>{{ format(report.irr * 100) + '%' }}</td>
                <td>{{ format(report.international * 100) + '%' }}</td>
                <td>{{ format(report.domestic * 100) + '%' }}</td>
                <td>{{ format(report.equity * 100) + '%' }}</td>
                <td>{{ format(report.fixed * 100) + '%' }}</td>
                <td>{{ format(report.cash * 100) + '%' }}</td>
                <td>{{ format(report.expenseRatio * 100) + '%' }}</td>
            </tr>
        </tbody>
    </table>

    <div>
        <h1>Rent vs Buy</h1>
        <div>
            <label>Home Price</label>
            <input type="number" v-model="rentVsBuyR.homePrice"/>
        </div>
        <div>
            <label>Rent</label>
            <input type="number" v-model="rentVsBuyR.rent"/>
        </div>
        <div>
            <label>Down Payment (%)</label>
            <input type="number" v-model="rentVsBuyR.downPaymentPercent"/>
        </div>
        <div>
            <label>Mortgage Rate (%)</label>
            <input type="number" v-model="rentVsBuyR.mortgageRate"/>
        </div>
        <div>
            <label>Property Tax (%)</label>
            <input type="number" v-model="rentVsBuyR.propertyTaxRate"/>
        </div>
        <div>
            <label>Home Insurance (%)</label>
            <input type="number" v-model="rentVsBuyR.homeInsuranceRate"/>
        </div>
        <div>
            <label>Maintenance Cost (%)</label>
            <input type="number" v-model="rentVsBuyR.maintenanceCost"/>
        </div>
        <div>
            <label>Buying Cost (%)</label>
            <input type="number" v-model="rentVsBuyR.buyingCosts"/>
        </div>
        <div>
            <label>Selling Cost (%)</label>
            <input type="number" v-model="rentVsBuyR.sellingCosts"/>
        </div>
        <div>
            <label>Renter's Insurance (%)</label>
            <input type="number" v-model="rentVsBuyR.rentersInsurance"/>
        </div>
        <div>
            <label>Security Deposit (%)</label>
            <input type="number" v-model="rentVsBuyR.securityDepositPercent"/>
        </div>
        <div>
            <label>Home Appreciation (%)</label>
            <input type="number" v-model="rentVsBuyR.homeAppreciation"/>
        </div>
        <div>
            <label>Rent Appreciation (%)</label>
            <input type="number" v-model="rentVsBuyR.rentAppreciation"/>
        </div>
        <div>
            <label>Investment Return (%)</label>
            <input type="number" v-model="rentVsBuyR.investmentReturn"/>
        </div>
        <div>
            <label>Standard Deduction</label>
            <input type="number" v-model="rentVsBuyR.standardDeduction"/>
        </div>
        <div>
            <label>Salt Limit</label>
            <input type="number" v-model="rentVsBuyR.saltLimit"/>
        </div>
        <div>
            <label>State Tax</label>
            <input type="number" v-model="rentVsBuyR.stateTax"/>
        </div>
        <div>
            <label>Fed Tax Rate (%)</label>
            <input type="number" v-model="rentVsBuyR.fedTaxRate"/>
        </div>

        <div>
            <label>Break-Even (Years)</label>
            <input type="number" disabled :value="breakEven"/>
        </div>
    </div>
</template>

<style scoped>

td, th {
    padding: 10px;
}

input {
    margin: 5px;
    padding: 5px;
}

label {
    margin-right: 10px;
    width: 200px;
    display: inline-block;
    text-align: end;
}

</style>
