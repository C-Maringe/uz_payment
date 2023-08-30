import React, { useState, useRef } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, Modal, ModalBody, ModalHeader, Table } from 'reactstrap';
import ParticlesAuth from './ParticlesAuth';
import Select from "react-select";
import { Link } from "react-router-dom";
import { Toast } from 'primereact/toast';

import logoLight from "../assets/Pictures/uzlogo-removebg-preview.png";
import axios from 'axios';
import BaseApi from '../BaseApi/BaseApi';

const FormHolder = ({ setLoading }) => {
    const toast = useRef(null);

    const [amount, setamount] = useState('')
    const [ecocash_number, setecocash_number] = useState('')
    const [reg_number, setreg_number] = useState('')

    const handleamountchange = (e) => { setamount(e.target.value); }
    const handleecocash_numberChange = (e) => { setecocash_number(e.target.value); }
    const handlereg_numberchange = (e) => { setreg_number(e.target.value); }

    const [PaymentTypeSelect, setPaymentTypeSelect] = useState({ value: "" })
    const PaymentTypeSelectOption = [{
        options: [
            { label: "ACOOMODATION FEE", value: "ACOOMODATION FEE" },
            { label: "GRADUATION FEE", value: "GRADUATION FEE" },
            { label: "LATE REGISTRATION FEE", value: "LATE REGISTRATION FEE" },
            { label: "TRANSCRIPT FEE", value: "TRANSCRIPT FEE" },
            { label: "TUITION FEE", value: "TUITION FEE" },
        ]
    }];

    const [showPaymentDetail, setShowPaymentDetail] = useState(false)

    const [paymentDetail, setPaymentDetail] = useState({
        name: '',
        program: '',
        payment_method: '',
        amount: '',
        ecocash_number: '',
        reg_number: '',
        fees_type: ''
    })

    const HandleProcessPaymentAfterConfirmationData = {
        Amount: amount,
        AppId: "string",
        ClientTransactionRef: Number(Date.now() / 1000).toFixed(0),
        CompanyId: "string",
        Description: `REG_NUMBER: ${paymentDetail.reg_number},NAME: ${paymentDetail.name},FEES_TYPE: ${paymentDetail.fees_type},AMOUNT: ${paymentDetail.amount},PROGRAM: ${paymentDetail.program}`,
        Msisdn: paymentDetail.ecocash_number,
        Beneficiary: paymentDetail.ecocash_number,
        Email: "info@poscloud.co.zw",
        Transaction_type_id: 3,
        PaymentMethod: "ECOCASH",
        ProductTYpe: "OTHER",
        MeterNumber: "NONE"
    }

    const HandleProcessPaymentAfterConfirmation = () => {
        setShowPaymentDetail(false);
        setLoading(true)
        BaseApi.post('/mobile-payments/payments/', HandleProcessPaymentAfterConfirmationData)
            .then((response) => {
                setLoading(false)
                if (response.data.statusCode === 417) {
                    toast.current.show({ severity: 'error', summary: response.data.message, life: 6000 });
                }
                else {
                    setPaymentDetail({
                        name: '',
                        program: '',
                        payment_method: '',
                        amount: '',
                        ecocash_number: '',
                        reg_number: '',
                        fees_type: ''
                    })
                    setamount('');
                    setecocash_number('');
                    setreg_number('');
                    setPaymentTypeSelect({ value: "" })
                    toast.current.show({ severity: 'success', summary: 'You Have Successfully paid your fees, Please check your emhare portal', life: 6000 })
                }
            })
            .catch((error) => {
                console.log(error)
                setLoading(false)
                if (error.response.data.success === false) {
                    toast.current.show({ severity: 'error', summary: error.response.data.message, life: 6000 });
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Oops Something went wrong, Check your internet', life: 6000 });
                }
            })
    }
    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const HandleProcessPayment = () => {
        setLoading(true)
        BaseApi.get(`/students/verify/${reg_number}`)
            .then((response) => {
                setPaymentDetail({
                    name: `${response.data.firstName} ${response.data.lastName}`,
                    program: response.data.programme,
                    payment_method: 'Ecocash',
                    amount: amount,
                    ecocash_number: ecocash_number,
                    reg_number: response.data.regNumber,
                    fees_type: PaymentTypeSelect.value
                })
                setShowPaymentDetail(true)
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
                if (error.response.data.success === false) {
                    toast.current.show({ severity: 'error', summary: `Incorrect Reg Number- ${error.response.data.message}`, life: 6000 });
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Oops Something went wrong, Check your internet', life: 6000 });
                }
            })
    }

    document.title = "UZ | Payments";
    return (
        <React.Fragment>
            <Toast ref={toast} />
            <ParticlesAuth>
                <div className="auth-page-content">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div>
                                        <Link to="/" className="d-inline-block auth-logo">
                                            <img src={logoLight} alt="" height="120" />
                                        </Link>
                                    </div>
                                    <p className="mt-3 fs-22" style={{ color: "white" }}>UNIVERSITY OF ZIMBABWE</p>
                                    <p className="mt-3 fs-18" style={{ color: "white" }}>Cloud Payments</p>
                                </div>
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">
                                    <CardBody className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Welcome !</h5>
                                            <p className="text-muted">Enter your details to pay fees.</p>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    if (PaymentTypeSelect.value === '') {
                                                        toast.current.show({ severity: 'error', summary: 'PLEASE SELECT FEES TYPE', life: 3000 });
                                                    }
                                                    else if (ecocash_number < 771000000 || ecocash_number > 791000000) {
                                                        toast.current.show({ severity: 'error', summary: 'Invalid Ecocash Number Entered', life: 3000 });
                                                    }
                                                    else { HandleProcessPayment() }
                                                    return false;
                                                }}
                                                action="#">
                                                <div className="mb-3">
                                                    <Label className="form-label">Reg Number</Label>
                                                    <Input
                                                        name="reg_number"
                                                        className="form-control"
                                                        placeholder="Enter reg number"
                                                        type="text"
                                                        value={reg_number || ""}
                                                        onChange={handlereg_numberchange}
                                                        required
                                                    />
                                                </div>
                                                <Col xxl={12} md={12} className="mb-3">
                                                    <h6 className="fw-semibold">Select Fees Type</h6>
                                                    <Select
                                                        value={PaymentTypeSelect}
                                                        onChange={(sortBy) => {
                                                            setPaymentTypeSelect(sortBy)
                                                        }}
                                                        options={PaymentTypeSelectOption}
                                                        classNamePrefix="js-example-data-array"
                                                        isLoading={true}
                                                        required
                                                    />
                                                </Col>
                                                <div className="mb-3" >
                                                    <Label className="form-label">Ecocash Number</Label>
                                                    <Input
                                                        name="reg_number"
                                                        className="form-control"
                                                        placeholder="Enter ecocash number"
                                                        type="number"
                                                        value={ecocash_number || ""}
                                                        onChange={handleecocash_numberChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">Amount</Label>
                                                    <Input
                                                        name="reg_number"
                                                        className="form-control"
                                                        placeholder="Enter amount"
                                                        type="number"
                                                        value={amount || ""}
                                                        onChange={handleamountchange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-check">
                                                    <Input className="form-check-input" type="checkbox" value="" id="auth-remember-check" />
                                                    <Label className="form-check-label" htmlFor="auth-remember-check">Confirm Above details</Label>
                                                </div>

                                                <div className="mt-4">
                                                    <Button color="success" style={{ backgroundColor: "#00147e" }} className="btn btn-success w-100" type="submit">Process Payment</Button>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
            <Modal isOpen={showPaymentDetail} centered
                onClick={(e) => { e.preventDefault() }} modalClassName="zoomIn">
                <ModalHeader className="p-3" toggle={() => { setShowPaymentDetail(false); }}>
                    Confirm Details
                </ModalHeader>
                <ModalBody>
                    <Card>
                        <CardBody >
                            <div className="table-responsive">
                                <Table className="table-borderless mb-0">
                                    <tbody>
                                        <tr>
                                            <th className="ps-0" scope="row"> Student Name :</th>
                                            <td style={{ color: "#00147e" }}>{paymentDetail.name}</td>
                                        </tr>
                                        <tr>
                                            <th className="ps-0" scope="row">Reg Number:</th>
                                            <td style={{ color: "#00147e" }}>{paymentDetail.reg_number}</td>
                                        </tr>
                                        <tr>
                                            <th className="ps-0" scope="row">Program :</th>
                                            <td style={{ color: "#00147e" }}>{paymentDetail.program}</td>
                                        </tr>
                                        <tr>
                                            <th className="ps-0" scope="row"> Fees Type :</th>
                                            <td style={{ color: "#00147e" }}>{paymentDetail.fees_type}</td>
                                        </tr>
                                        <tr>
                                            <th className="ps-0" scope="row"> Amount :</th>
                                            <td style={{ color: "#00147e", fontWeight: 600 }}>ZWL {USDollar.format(paymentDetail.amount)}</td>
                                        </tr>
                                        <tr>
                                            <th className="ps-0" scope="row">Payment Method:</th>
                                            <td style={{ color: "#00147e" }}>{paymentDetail.payment_method}</td>
                                        </tr>
                                        <tr>
                                            <th className="ps-0" scope="row">Ecocash Number :</th>
                                            <td style={{ color: "#00147e" }}>{paymentDetail.ecocash_number}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </CardBody>
                        <div className="mt-4">
                            <Button color="success" style={{ backgroundColor: "#00147e" }}
                                onClick={() => { HandleProcessPaymentAfterConfirmation() }}
                                className="btn btn-success w-100" type="submit">
                                Confirm Details
                            </Button>
                        </div>
                    </Card>
                </ModalBody>
            </Modal>
        </React.Fragment>
    );
};

export default (FormHolder);