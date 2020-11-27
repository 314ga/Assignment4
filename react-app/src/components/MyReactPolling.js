
import axios from "axios";
import ReactPolling from 'react-polling'
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import { from, merge, of } from 'rxjs';
import { filter, mergeMap, toArray } from "rxjs/operators";
import store from '../store'
import { useSelector } from 'react-redux';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import { setWarningPollingData } from '../actions'
const fetchWarningData = (url) => {
    let response = axios.get('http://localhost:8080/warnings');
    return response;
}

let initData = true;
let severityChange = 0;
let severityNumber = 0;

//redux
function MyReactPolling() {

    const warningData = useSelector(state => state.warningPollingData);

    function initialWarningData(data) {
        if (initData) {
            initData = false;
            // console.log("dispatching");
            //remove null rpediction from response
            let filteredWarnings = data.warnings.filter(x => x.prediction != null);
            //  console.log(filteredWarnings);
            data.warnings = filteredWarnings;
            store.dispatch(setWarningPollingData(data));
        }
        else {
            // newWarning.next(response);
            //console.log(response);
            let currentData = store.getState().warningData.warnings;
            // console.log(currentData);
            const initWarnings = of(data.warnings);
            //remove existing data from store with id matching new data from server
            const merged = merge(initWarnings.pipe(
                mergeMap(val => from(currentData).pipe(
                    filter(x => x.id != val.id)
                ))),
                // remove predictions with null values
                initWarnings.pipe(
                    filter(remove => remove.prediction != null)))
                //check the severity value and return warnings with severity >= user input
                .pipe(
                    filter(all => all.severity >= severityNumber),
                    toArray());


            merged.subscribe(changedWarnings => {
                updateData(changedWarnings);

                //  console.log(changedWarnings);
            });

        }
        //console.log(data)
    }
    const updateData = (data) => {
        //need to ssgine new object so redux notice change
        let newData = Object.assign({}, store.getState().warningData);
        newData.warnings = data;
        store.dispatch(setWarningPollingData(newData));
    };
    const onSeverityButton = () => {
        severityNumber = severityChange;
    }
    const onSeverityChange = (event) => {
        severityChange = event.target.value;
    }
    return (

        <>
            <ReactPolling
                url={'http://localhost:8080/warnings'}
                interval={5000} // in milliseconds(ms)
                retryCount={3} // this is optional
                onSuccess={resp => {
                    initialWarningData(resp.data);
                    return true;
                }}
                onFailure={() => console.log('handle failure')} // this is optional
                promise={fetchWarningData} // custom api calling function that should return a promise
                render={({ startPolling, stopPolling, isPolling }) => {
                    return (
                        <div>
                            <h2>Polling controls</h2>
                            <ToggleButtonGroup type="radio" name="options" defaultValue={0}>
                                <ToggleButton variant="dark" value={0} onClick={startPolling}>On Life Update</ToggleButton>
                                <ToggleButton variant="dark" value={1} onClick={stopPolling}>Off Life Update</ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                    );
                }}
            />

            <InputGroup className="mb-5" onChange={onSeverityChange}>
                <FormControl
                    placeholder="Severity"
                    aria-label="Severity"
                    aria-describedby="basic-addon2"
                />
                <InputGroup.Append>
                    <InputGroup.Text id="basic-addon2">Severity(1-10)</InputGroup.Text>
                </InputGroup.Append>
                <Button variant="dark" onClick={() => onSeverityButton()}>Change Severity</Button>{' '}
            </InputGroup>

            <Card>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>

                        <p className="text-center lead"> Showing Weather Warnings Polling</p>


                        <Table id="weatherWarningPolling" responsive striped bordered hover>
                            <thead className="text-center">
                                <tr>
                                    <th>Severity</th>
                                    <th>Place</th>
                                    <th>Type</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Wind Directions</th>
                                    <th>Precipitaiton Type</th>
                                    <th>Unit</th>
                                    <th>Time</th>

                                </tr>

                            </thead>
                            <tbody className="text-center">
                                {warningData.warnings === undefined ? "nothing to show" :
                                    warningData.warnings.map((warn, index) => {
                                        let str = "";
                                        let item = warn.prediction;
                                        if (item.type == 'precipitation') {
                                            return <tr key={index}>
                                                <td>{warn.severity}</td>
                                                <td>{item.place}</td>
                                                <td>{item.type}</td>
                                                <td>{item.from}</td>
                                                <td>{item.to}</td>
                                                <td>-</td>
                                                {
                                                    item.precipitation_types.forEach(x => {
                                                        if (x == "") {
                                                            str = x;
                                                        }
                                                        else {
                                                            str += " " + x + ", ";
                                                        }
                                                    })}
                                                <td>{str}</td>
                                                <td>{item.unit}</td>
                                                <td>{warningData.time}</td>

                                            </tr>
                                        }
                                        else if (item.type == 'wind speed') {
                                            return <tr key={index}>
                                                <td>{warn.severity}</td>
                                                <td>{item.place}</td>
                                                <td>{item.type}</td>
                                                <td>{item.from}</td>
                                                <td>{item.to}</td>
                                                {
                                                    item.directions.forEach(x => {
                                                        if (x == "") {
                                                            str = x;
                                                        }
                                                        else {
                                                            str += " " + x + ",";
                                                        }
                                                    })}
                                                <td>{str}</td>
                                                <td>-</td>
                                                <td>{item.unit}</td>
                                                <td>{warningData.time}</td></tr>
                                        }
                                        else

                                            return <tr key={index}><td>{item.place}</td>
                                                <td>{warn.severity}</td>
                                                <td>{item.type}</td>
                                                <td>{item.from}</td>
                                                <td>{item.to}</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>{item.unit}</td>
                                                <td>{warningData.time}</td></tr>
                                    })}


                            </tbody>
                        </Table>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </>


    );


}
export default MyReactPolling;