import { setWarningPollingData } from '../actions';
import { api } from '../utils/RestAPI'
import { getDataFromPeriod } from '../utils/Filters';

export default function weatherWarningsPollingReducer(state = [], action) {
    switch (action.type) {
        case 'SETPOLLING':
            return action.payload;
        case 'RESETPOLLING':
            return state = [];
        default:
            return state;
    }
}
//retrieve data with REST API and set it to the store - described more in weatherData
/**
 * 
 * @param {*} type is ending of the base URL from axios, eg. base: 'http://localhost:8080/' type: 'forecast'
 * @param {*} filter if filter is set - if not startDate & endDate == null
 * @param {*} startDate filter start date
 * @param {*} endDate filter end date
 */
export function retrieveWarningPollingData(type, filter, startDate, endDate) {
    console.log("retrievewar");
    return async function fetchWeatherData(dispatch, getState) {
        const data = await api.get(type)
            .then(({ data }) => {
                console.log(data);
                return data
            })
            .catch((err) => {
                if (err.response) {
                    console.log(err.response.data);
                    console.log(err.response.status);
                    console.log(err.response.headers);
                    console.log(err.config);
                }
                else if (err.request) {
                    console.log(err.request);
                    console.log(err.config);
                }
                else {
                    console.log('Error', err.message);
                    console.log(err.config);
                }
            });
        console.log(data);
        console.log(data.warnings);
        if (data != undefined) {
            if (!filter)
                dispatch(setWarningPollingData(data));
            else
                dispatch(setWarningPollingData(getDataFromPeriod(data, startDate, endDate)));
        }

    }
}

