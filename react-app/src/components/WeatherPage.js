//bootstrap imports
import 'bootstrap/dist/css/bootstrap.min.css';
import Jumbotron from 'react-bootstrap/Jumbotron'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'

//variable imports
import PostData from './PostData';
import { useState } from 'react';
import Filter from './Filter';
import { retrieveAllData } from '../utils/StoreHandler'

//redux
import { useSelector } from 'react-redux';




function WeatherPage() {
    //react useState for checking buttons state
    const [selectedCity, setSelectedCity] = useState('Horsens');
    const [debounce, setDebounce] = useState(false);
    const [filterSet, setFilterSet] = useState(false);
    const [selectedSDate, setselectedSDate] = useState(null);
    const [selectedEDate, setselectedEDate] = useState(null);

    //data reducers
    const historicData = useSelector(state => state.historicData);
    const forecastData = useSelector(state => state.forecastData);

    /**
     * Function is called from the Filter Component(callback function)
     * @param {boolean} filterValue if filter is applied
     * @param {date} sDate start date if filter is applied else null
     * @param {date} eDate end date if filter is applied else null
     */
    const handleCallback = (filterValue, sDate, eDate) => {
        setFilterSet(filterValue);
        setselectedSDate(sDate);
        setselectedEDate(eDate);
    }

    //toggle buttons
    const onBtnChangeHandler = (city) => {

        //fix for toggle buttons calling onbuttonchangehandler twice
        if (!debounce) {
            setSelectedCity(city);
            retrieveAllData(city, filterSet, selectedSDate, selectedEDate);
        }
        setDebounce(!debounce)
    }

    return (
        <div >
            <Jumbotron fluid id="weather-header" className="BgStyle" >
                <div className="col-md-6 mx-auto text-white text-center">
                    <h4 className="h4 mt-2 mb-5">Weather Forecast and Weather History</h4>
                    <div id="locations">
                        <PostData />{' '}

                    </div>

                    <div className="my-3">
                        <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                            <ToggleButton variant="info" value={1} onClick={() => onBtnChangeHandler('Horsens')}>Horsens</ToggleButton>
                            <ToggleButton variant="info" value={2} onClick={() => onBtnChangeHandler('Aarhus')}>Århus</ToggleButton>
                            <ToggleButton variant="info" value={3} onClick={() => onBtnChangeHandler('Copenhagen')}>Copenhagen</ToggleButton>
                        </ToggleButtonGroup>

                        <br />
                    </div>
                    <div>
                        <Filter selectedCity={selectedCity} triggerFilterSet={handleCallback} />
                        <div><Button className="outline-btn mt-3" onClick={() => retrieveAllData(selectedCity)}>Reload data</Button>{' '}</div>
                    </div>
                </div>

            </Jumbotron>
            <Accordion>
                <Card className="myCard pt-3 mt-0">
                    <div className="row text-center mb-5">
                        <div className="offset-md-3 col-md-3 text-center mb-2">
                            <Accordion.Toggle as={Button} className="outline-link " eventKey="0">SEE WEATHER FORECAST</Accordion.Toggle>

                        </div>
                        <div className="col-md-3">

                            <Accordion.Toggle as={Button} className="outline-link" eventKey="1">SEE WEATHER HISTORY</Accordion.Toggle>

                        </div>
                    </div>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <p className="text-center lead"> Weather Forecast For {selectedCity}</p>
                            <Table id="weatherForecast" responsive striped bordered hover >
                                <thead className="text-center">
                                    <tr>
                                        <th>Place</th>
                                        <th>Type</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Unit</th>
                                        <th>time</th>
                                        <th>Precipitation Type</th>
                                        <th>Wind Direction</th>

                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {forecastData.map((item, index) => {
                                        if (item.type == 'precipitation') {
                                            let precTypes = item.precipitation_types;
                                            let str = "";
                                            precTypes.forEach(x => {
                                                if (x == "") {
                                                    str = x;
                                                }
                                                else {
                                                    str += " " + x + ", ";
                                                }
                                            })
                                            return <tr key={index}>
                                                <td>{item.place}</td>
                                                <td>{item.type}</td>
                                                <td>{item.from}</td>
                                                <td>{item.to}</td>
                                                <td>{item.unit}</td>
                                                <td>{item.time}</td>
                                                <td>{str}</td>
                                                <td>-</td>

                                            </tr>
                                        }
                                        else if (item.type == 'wind speed') {
                                            let windDir = item.directions;
                                            let str1 = "";
                                            windDir.forEach(x => {
                                                if (x == "") {
                                                    str1 = x;
                                                }
                                                else {
                                                    str1 += " " + x + ", ";
                                                }
                                            })
                                            return <tr key={index}>
                                                <td>{item.place}</td>
                                                <td>{item.type}</td>
                                                <td>{item.from}</td>
                                                <td>{item.to}</td>
                                                <td>{item.unit}</td>
                                                <td>{item.time}</td>
                                                <td>-</td>
                                                <td>{str1}</td>

                                            </tr>
                                        }
                                        else
                                            return <tr key={index}>
                                                <td>{item.place}</td>
                                                <td>{item.type}</td>
                                                <td>{item.from}</td>
                                                <td>{item.to}</td>
                                                <td>{item.unit}</td>
                                                <td>{item.time}</td>
                                                <td>-</td>
                                                <td>-</td>

                                            </tr>
                                    })}


                                </tbody>
                            </Table></Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>

                    <Accordion.Collapse eventKey="1">
                        <Card.Body>
                            <p className="text-center lead"> Showing Weather History For {selectedCity}</p>


                            <Table id="weatherHistory" responsive striped bordered hover>
                                <thead className="text-center">
                                    <tr>
                                        <th>Place</th>
                                        <th>Type</th>
                                        <th>Value</th>
                                        <th>Unit</th>
                                        <th>time</th>
                                        <th>Precipitation Type</th>
                                        <th>Wind Direction</th>

                                    </tr>

                                </thead>
                                <tbody className="text-center">
                                    {historicData.map((item, index) => {
                                        if (item.type == 'precipitation') {
                                            return <tr key={index}>
                                                <td>{item.place}</td>
                                                <td>{item.type}</td>
                                                <td>{item.value}</td>
                                                <td>{item.unit}</td>
                                                <td>{item.time}</td>
                                                <td>{item.precipitation_type}</td>
                                                <td>-</td>

                                            </tr>
                                        }
                                        else if (item.type == 'wind speed') {
                                            return <tr key={index}>
                                                <td>{item.place}</td>
                                                <td>{item.type}</td>
                                                <td>{item.value}</td>
                                                <td>{item.unit}</td>
                                                <td>{item.time}</td>
                                                <td>-</td>
                                                <td>{item.direction}</td>

                                            </tr>
                                        }
                                        else
                                            return <tr key={index}>
                                                <td>{item.place}</td>
                                                <td>{item.type}</td>
                                                <td>{item.value}</td>
                                                <td>{item.unit}</td>
                                                <td>{item.time}</td>
                                                <td>-</td>
                                                <td>-</td>

                                            </tr>
                                    })}


                                </tbody>
                            </Table >
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
            <div>

            </div>

        </div>

    )


}
export default WeatherPage;
/* <ul>
    {historicData.map((value, index) => {
        return (
            <tr key={index}>{value.value}</tr>
        )
    })}
</ul> */