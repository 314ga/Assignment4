/** this index.js describes the actions for reducers*/
export const setHistoricData = (data) => {
    return {
        type: 'SETDATA',
        payload: data
    };
};
export const resetHistoricData = () => {
    return {
        type: 'RESETDATA'
    };
};
export const setForecastData = (data) => {
    return {
        type: 'SETFORECAST',
        payload: data
    };
};
export const resetForecastData = () => {
    return {
        type: 'RESETFORECAST'
    };
};
export const setWarningData = (data) => {
    return {
        type: 'SETWARNING',
        payload: data
    };
};
export const resetWarningData = () => {
    return {
        type: 'RESETWARNING'
    };
};
export const setWarningPollingData = (data) => {
    return {
        type: 'SETPOLLING',
        payload: data
    };
};
export const resetWarningPollingData = () => {
    return {
        type: 'RESETPOLLING'
    };
};
