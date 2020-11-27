import weatherDataReducer from './weatherData';
import weatherForecastReducer from './weatherForecast';
import weatherWarningsReducer from './weatherWarnings';
import weatherWarningsPollingReducer from './weatherWarningsPolling'
import { combineReducers } from 'redux';

/**
 * this class is merging all reducers into one reducer
 */
const allReducers = combineReducers({
    historicData: weatherDataReducer,
    forecastData: weatherForecastReducer,
    warningData: weatherWarningsReducer,
    warningPollingData: weatherWarningsPollingReducer
});

export default allReducers;