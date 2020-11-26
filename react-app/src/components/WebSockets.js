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
var ws = null;
let initData = true;
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
        };
        
        var onMessage = function(event) 
        {
        let response = JSON.parse(event.data);
        console.log("Init Data"+initData);
        if(initData)
        {
            initData = false;
            console.log("dispatching");
            store.dispatch(setWarningData(response));
        }
        else
        {
           // newWarning.next(response);
           console.log(response);
           let currentData = store.getState().warningData.warnings;
           console.log(currentData);
            const initWarnings = of(response);
            const newWarnings = from(currentData);
            const filtered = initWarnings.pipe(
                mergeMap(val => from(currentData).pipe(
                    filter(x => x.id != val.id)
                ))
            );
            const merged = merge(initWarnings.pipe(
                mergeMap(val => from(currentData).pipe(
                    filter(x => x.id != val.id)
                ))
               
            ),initWarnings.pipe(
                filter(remove => remove.prediction != null)
            )).pipe(
                toArray()
            );
           /* const result = initWarnings.pipe
            (
                mergeMap(val => from(currentData))
            )*/
            merged.subscribe(changedWarnings => 
                { 
                    updateData(changedWarnings);
                    console.log(changedWarnings);
                });
               /* filtered.subscribe(changedWarnings => 
                    { 
                        console.log(changedWarnings);
                    });*/
                
        }};
        
        const updateData = (data) =>{
            let newData =  store.getState().warningData;
            newData.warnings = data;
            store.dispatch(setWarningData(newData));
        };
        var onError = function(event) {
            alert(event.data);
        }
        open();
      
         
    return (
        <>
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