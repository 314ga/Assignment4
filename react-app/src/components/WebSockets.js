import React from 'react';
//redux
//bootstrap imports
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'

import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from "react";
import { BehaviorSubject, from,merge, observable, Observable, of} from 'rxjs';
import { map, filter, delay, mergeMap, distinctUntilChanged, debounceTime, toArray } from "rxjs/operators";
import { webSocket } from "rxjs/webSocket";
import store from '../store'
import { useSelector } from 'react-redux';
import {setWarningData} from '../actions';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
var ws = null;
let initData = true;
let severityChange = 0;
let severityNumber = 0;
function WebSockets() {
       
        const warningData = useSelector(state => state.warningData);
        const open = () => {
        if (!ws) 
        {
            ws = new WebSocket("ws://localhost:8090/warnings");
            ws.onopen = onOpen;
            ws.onclose = onClose;
            ws.onmessage = onMessage;
            ws.onerror = onError;
            console.log('OPENING ...');
        }
        }
        const close = () =>  {
            if (ws) {
                console.log('CLOSING ...');
                ws.close();
            }
            console.log('CLOSED');
        }
        var onOpen = function() {
            console.log("OPENED:");
            ws.send("subscribe");
        };
        
        var onClose = function() {
            console.log("CLOSED:");
            ws = null;
            initData = true;
        };
        
        var onMessage = function(event) 
        {
        let response = JSON.parse(event.data);
        console.log("Init Data"+initData);
        if(initData)
        {
            initData = false;
            console.log("dispatching");
            //remove null rpediction from response
            let filteredWarnings = response.warnings.filter(x => x.prediction != null);
            console.log(filteredWarnings);
            response.warnings = filteredWarnings;
            store.dispatch(setWarningData(response));
        }
        else
        {
           // newWarning.next(response);
           console.log(response);
           let currentData = store.getState().warningData.warnings;
           console.log(currentData);
            const initWarnings = of(response);
            const merged = merge(initWarnings.pipe(
                mergeMap(val => from(currentData).pipe(
                    filter(x => x.id != val.id)
                ))),initWarnings.pipe(
                filter(remove => remove.prediction != null))).pipe(
                    filter(all => all.severity >= severityNumber),
                    toArray());
            
            
                merged.subscribe(changedWarnings => 
                { 
                    updateData(changedWarnings);
                    console.log(changedWarnings);
                });
                
        }};
        
        const updateData = (data) =>{
            //need to ssgine new object so redux notice change
            let newData = Object.assign({},store.getState().warningData);
            newData.warnings = data;
            store.dispatch(setWarningData(newData));
        };
        var onError = function(event) {
            alert(event.data);
        }
        open();
      
        const onReceiveWarningChange = (state) => 
        {
            if(state)
                open();
            else
                close();
        }
        const onSeverityButton = () => 
        {
            severityNumber = severityChange;
        }
        const onSeverityChange = (event) => 
        {
            severityChange = event.target.value;
        }
         
    return (
        <>
          <ToggleButtonGroup type="radio" name="options" defaultValue={0}>
                            <ToggleButton variant="info" value={0} onClick={() => onReceiveWarningChange(true)}>On Life Update</ToggleButton>
                            <ToggleButton variant="info" value={1} onClick={() => onReceiveWarningChange(false)}>Off Life Update</ToggleButton>
          </ToggleButtonGroup>
          <InputGroup className="mb-3" onChange={onSeverityChange}>
                <FormControl
                placeholder="Severity"
                aria-label="Severity"
                aria-describedby="basic-addon2"
                />
                <InputGroup.Append>
                <InputGroup.Text id="basic-addon2">Severity(1-10)</InputGroup.Text>
                </InputGroup.Append>
          </InputGroup>
          <Button variant="dark" onClick={() => onSeverityButton()}>Change Severity</Button>{' '}
              <Card>
                <Accordion.Collapse eventKey="2">
                    <Card.Body>
                       
                        <p className="text-center lead"> Showing Weather Warnings</p>


                        <Table id="weatherWarnings" responsive striped bordered hover>
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
export default WebSockets;