class DataTable extends HTMLElement {
    constructor() {
        super();

        this.fetchTableData();
    }

    fetchTableData() {
        fetch('https://api.coincap.io/v2/assets', {
            method: 'GET', 
            credentials: 'same-origin', 
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then((response) => response.json())
        .then((response) => {
            const fetchedData = response.data;

            for(let i = 0; i < 25; i++) {
                const exchangeRateKey = 'e7c69b1348790fa092cee3fa';
                const tableTR = document.createElement('tr');

                this.querySelector('table tbody').appendChild(tableTR);

                const tableTdRank = document.createElement('td');
                const tableTdId = document.createElement('td');
                const tableTdSymbol = document.createElement('td');
                const tableTdExplorer = document.createElement('td');
                const tableTdPriceUSD = document.createElement('td');
                const tableTdPriceGBP = document.createElement('td');
                const tableTdPriceEUR = document.createElement('td');
                const tableTdPriceAED = document.createElement('td');

                const USDdecimal = Math.round(fetchedData[i].priceUsd * 100) / 100;

                tableTdRank.innerHTML = fetchedData[i].rank;
                tableTdId.innerHTML = fetchedData[i].id.toUpperCase();
                tableTdSymbol.innerHTML = fetchedData[i].symbol;
                tableTdExplorer.innerHTML = fetchedData[i].explorer;
                tableTdExplorer.href = fetchedData[i].explorer;
                tableTdExplorer.setAttribute('target', '_blank');
                tableTdPriceUSD.innerHTML = USDdecimal;

                this.convertUSDtoGBP(exchangeRateKey, fetchedData[i].priceUsd, tableTdPriceGBP);
                this.convertUSDtoEUR(exchangeRateKey, fetchedData[i].priceUsd, tableTdPriceEUR);
                this.convertUSDtoAED(exchangeRateKey, fetchedData[i].priceUsd, tableTdPriceAED);
      
                tableTR.appendChild(tableTdRank);
                tableTR.appendChild(tableTdId);
                tableTR.appendChild(tableTdSymbol);
                tableTR.appendChild(tableTdExplorer);
                tableTR.appendChild(tableTdPriceUSD);
                tableTR.appendChild(tableTdPriceGBP);
                tableTR.appendChild(tableTdPriceEUR);
                tableTR.appendChild(tableTdPriceAED);
            }
        })
        .catch((error) => {
            console.error('Coincap Error: ' + error);
        });
    }

    convertUSDtoGBP(exchangeRateKey, originalPrice, content) {
        const url = 'https://v6.exchangerate-api.com/v6/' + exchangeRateKey + '/pair/USD/GBP/' + originalPrice + '';
        this.fetchCurrencyConversion(url, content);
    }

    convertUSDtoEUR(exchangeRateKey, originalPrice, content) {
        const url = 'https://v6.exchangerate-api.com/v6/' + exchangeRateKey + '/pair/USD/EUR/' + originalPrice + '';
        this.fetchCurrencyConversion(url, content);
    }

    convertUSDtoAED(exchangeRateKey, originalPrice, content) {
        const url = 'https://v6.exchangerate-api.com/v6/' + exchangeRateKey + '/pair/USD/AED/' + originalPrice + '';
        this.fetchCurrencyConversion(url, content);
    }

    fetchCurrencyConversion(url, content) {
        fetch(url, {
            method: 'GET', 
            credentials: 'same-origin', 
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then((response) => response.json())
        .then((response) => {
            const roundedResult = Math.round(response.conversion_result * 100) / 100;
            content.innerHTML = roundedResult;
        })
        .catch((error) => {
            console.error('ExchangeRate Error: ' + error);
        });
    }
}

customElements.define('data-table', DataTable);