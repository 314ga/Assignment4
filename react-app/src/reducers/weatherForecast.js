import {setForecastData} from '../actions';
import {api} from '../utils/RestAPI'
import {getDataFromPeriod} from '../utils/Filters';

export default function weatherForecastReducer (state = [], action) {
    switch(action.type){
        case 'SETFORECAST':
            return action.payload;
        case 'RESETFORECAST':
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
export function retrieveForecastData(type, filter, startDate, endDate)
{
    return async function fetchWeatherData(dispatch, getState){
        const data = await api.get(type)
        .then(({data}) => data)
        .catch((err) =>{
            if(err.response)
            {
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
                console.log(err.config);
            }
            else if (err.request) 
            { 
                console.log(err.request);
                console.log(err.config);
            } 
            else 
            { 
                console.log('Error', err.message);
                console.log(err.config);
            }
        });

    if(data != undefined)
    {
    
        if(!filter)
            dispatch(setForecastData(data));
        else
            dispatch(setForecastData(getDataFromPeriod(data,startDate,endDate)));           
    }
    
    }
}
