import Button from 'react-bootstrap/Button';
import { postHistoricData } from '../reducers/weatherData';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Row, Col } from 'react-bootstrap';
import DateTimePicker from 'react-datetime-picker';
import store from '../store';
import React from 'react';
//redux
import { useSelector } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css';



function PostData() {

    const historicData = useSelector(state => state.historicData);
    const [show, setShow] = useState(false);
    const [type, setType] = useState("temperature");
    const [unit, setUnit] = useState("°C");
    const [place, setPlace] = useState("Horsens");
    const [value, setValue] = useState(0);
    const [prec, setPrecT] = useState("-");
    const [wind, setWindT] = useState("-");
    const [dateTime, setDateTime] = useState(new Date());


    //handles closing and opening modal popup dialog window
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //handles posting data into the server
    const handleSaveData = () => {
        switch (type) {
            case "temperature":
            case "cloud coverage":
                {
                    store.dispatch(postHistoricData("data", type, value, unit, dateTime, place, null));
                    break;
                }
            case "precipitation":
                {
                    store.dispatch(postHistoricData("data", type, value, unit, dateTime, place, prec));
                    break;
                }
            case "wind speed":
                {
                    store.dispatch(postHistoricData("data", type, value, unit, dateTime, place, wind));
                    break;
                }
            default:
                break;

        }
        //closing the dialog window
        setShow(false);
    };

    const onChange = dateTime => setDateTime(dateTime);

    return (
        <>
            <Button className="outline-btn" onClick={handleShow}>
                Post History Data
      </Button>

            <Modal show={show} onHide={handleClose} className="myModal">
                <Modal.Header closeButton>
                    <Modal.Title>Adding new weather data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId="addDataForm.SelectPlace">
                                    <Form.Label>Select type of data</Form.Label>
                                    <Form.Control as="select" onChange={e => setPlace(e.target.value)}>
                                        <option>Horsens</option>
                                        <option>Copenhagen</option>
                                        <option>Aarhus</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="addDataForm.SelectType">
                                    <Form.Label>Select type of data</Form.Label>
                                    <Form.Control as="select" onChange={e => setType(e.target.value)}>
                                        <option>temperature</option>
                                        <option>cloud coverage</option>
                                        <option>precipitation</option>
                                        <option>wind speed</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="addDataForm.SelectWType">
                                    <Form.Label>Type (just for WIND)</Form.Label>
                                    <Form.Control as="select" onChange={e => setWindT(e.target.value)}>
                                        <option>-</option>
                                        <option>West</option>
                                        <option>East</option>
                                        <option>South</option>
                                        <option>North</option>
                                        <option>Southeast</option>
                                        <option>Northeast</option>
                                        <option>Southwest</option>
                                        <option>Northwest</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="addDataForm.SelectUnit">
                                    <Form.Label>Select unit for data</Form.Label>
                                    <Form.Control as="select" onChange={e => setUnit(e.target.value)}>
                                        <option>°C</option>
                                        <option>F</option>
                                        <option>km/h</option>
                                        <option>m/s</option>
                                        <option>%</option>
                                        <option>mm</option>
                                        <option>inch</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="formGridAddress2">
                                    <Form.Label>Write value</Form.Label>
                                    <Form.Control placeholder="Just numbers!" onChange={e => setValue(e.target.value)} />
                                </Form.Group>
                                <Form.Group controlId="addDataForm.SelectPType">
                                    <Form.Label>Type (just for PRECIPITATION)</Form.Label>
                                    <Form.Control as="select" onChange={e => setPrecT(e.target.value)}>
                                        <option>-</option>
                                        <option>rain</option>
                                        <option>snow</option>
                                        <option>sleet</option>
                                        <option>hail</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Label>Set time of measurement:&nbsp;&nbsp;&nbsp;</Form.Label>
                        <DateTimePicker onChange={onChange} value={dateTime} />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
          </Button>
                    <Button variant="primary" onClick={handleSaveData}>
                        Add value
          </Button>
                </Modal.Footer>
            </Modal>
        </>
    );


}
export default PostData;