
/**
 * @param {*array} data  with all data which should be sorted out
 * @param {*date} startDate start date for filter range
 * @param {*array} endDate end date for filter range
 * @return filtered array of data
 */
export const getDataFromPeriod = (data, startDate, endDate) => {
    let filteredData = data.filter(function (later) {
        //to remove GTM +xx problem
        var t = new Date((later.time).substring(0, ((later.time).length) - 1));
        return Date.parse(t) > Date.parse(startDate) && Date.parse(t) < Date.parse(endDate);
    });
    return filteredData;
}


