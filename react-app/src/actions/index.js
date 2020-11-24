/** this index.js describes the actions for reducers*/
export const setHistoricData = (data) =>
{
    return {
        type: 'SETDATA',
        payload: data
    };
};
export const resetHistoricData = () =>
{
    return {
        type: 'RESETDATA'
    };
};
export const setForecastData = (data) =>
{
    return {
        type: 'SETFORECAST',
        payload: data
    };
};
export const resetForecastData = () =>
{
    return {
        type: 'RESETFORECAST'
    };
};