import React, {useEffect} from 'react';
import {  Row,Col,Card,CardBody
} from 'reactstrap';
import MatButton from '@material-ui/core/Button';
import {Modal, Button} from 'react-bootstrap';
import { Badge} from "react-bootstrap";
import Countdown from 'react-countdown';
import axios from "axios";
import {url as baseUrl} from "../../../api";


const RestartModule = (props) => {

    useEffect(() => {
        async function restartApp() {
            axios
                .get(`${baseUrl}restart`)
                .then((response) => {

                })
                .catch((error) => {
                    console.log(error);
                });
        }
        restartApp();
    }, []);
    // Random component
    const Completionist = () => {
        window.location.href = '';
        <h5>Restarting</h5>;
    }

// Renderer callback with condition
    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return <Completionist />;
        } else {
            // Render a countdown
            return <h1> Seconds : {seconds}</h1>;
        }
    };

    return (
        <div >
            {/* <ModalViewResult ref={componentRef} /> */}

            <Modal show={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
                <Modal.Header toggle={props.togglestatus}>
                    <Modal.Title>Restarting Application</Modal.Title>
                    {/*<Button*/}
                    {/*    variant=""*/}
                    {/*    className="btn-close"*/}
                    {/*    onClick={props.togglestatus}*/}
                    {/*></Button>*/}
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <CardBody>
                            <Row style={{ marginTop: '20px'}}>
                                <Col xs="12">
                                    <h4>Restarting Application Please wait...</h4>
                                        <Countdown
                                            date={Date.now() + 150000}
                                            renderer={renderer}
                                        />

                                </Col>

                            </Row>

                        </CardBody>
                    </Card>
                </Modal.Body>
            </Modal>
        </div>
    );
}



export default RestartModule;
