//variable imports
import store from '../store'
import { retrieveHistoricData } from '../reducers/weatherData'
import { retrieveForecastData } from '../reducers/weatherForecast'
import { retrieveWarningData } from '../reducers/weatherWarnings'
import { retrieveWarningPollingData } from '../reducers/weatherWarningsPolling'

//function to dipatch weather forecast & weather history, function called by eventListeners for exammple
export const retrieveAllData = (type, filter, sDate, eDate) => {
    store.dispatch(retrieveHistoricData("data/" + type, filter, sDate, eDate));
    store.dispatch(retrieveForecastData("forecast/" + type, filter, sDate, eDate));
    console.log("retrievewar");
    store.dispatch(retrieveWarningData("warnings/", filter, sDate, eDate));
    store.dispatch(retrieveWarningPollingData("warnings/", filter, sDate, eDate));
}