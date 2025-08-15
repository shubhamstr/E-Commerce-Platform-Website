/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useEffect, useState } from "react"
import styles from './addressList.module.css';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Container,
  Row,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Badge,
} from "reactstrap"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { addAddress } from "../../services/authService";
import { showSuccess, showError } from '../../utils/toast';
import { useRouter } from "next/navigation"

const AddressList = () => {
  const router = useRouter()
  const userData = useSelector(
    (state: RootState) => state.auth.userData
  )
  const [addressDetails, setAddressDetails] = useState<any>({
    userId: userData.userId
  })

  const handleChange = (e: any) => {
    setAddressDetails((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const onCreate = async (e: any) => {
    e.preventDefault();
    console.log(addressDetails)
    const res = await addAddress(addressDetails);
    const { success, message, data, error } = res.data
    if (success) {
      showSuccess(message);
      // console.log(data);
      router.push("/addresses")
    } else {
      showError(message);
      console.error("Server error:", error);
    }
  }

  return (
    <Container fluid="sm" className="mb-5">
      <Form>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="address1">
                Address 1
              </Label>
              <Input
                id="address1"
                name="addressLine1"
                placeholder="Address Line 1"
                type="text"
                onChange={handleChange}
                value={addressDetails?.addressLine1 || ""}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="address2">
                Address 2
              </Label>
              <Input
                id="address2"
                name="addressLine2"
                placeholder="Address Line 2"
                type="text"
                onChange={handleChange}
                value={addressDetails?.addressLine2 || ""}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="city">
                City
              </Label>
              <Input
                id="city"
                name="city"
                placeholder="Enter city name"
                type="text"
                onChange={handleChange}
                value={addressDetails?.city || ""}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="state">
                State
              </Label>
              <Input
                id="state"
                name="state"
                placeholder="Enter state name"
                type="text"
                onChange={handleChange}
                value={addressDetails?.state || ""}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="pinCode">
                Pin Code
              </Label>
              <Input
                id="pinCode"
                name="pinCode"
                placeholder="Enter pincode"
                type="text"
                onChange={handleChange}
                value={addressDetails?.pinCode || ""}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="addressType">
                Address Type
              </Label>
              <Input
                id="addressType"
                name="addressType"
                placeholder="Enter addressType name"
                type="select"
                onChange={handleChange}
                value={addressDetails?.addressType || ""}
              >
                <option value={''}>
                  Select Address Type
                </option>
                <option value={'home'}>
                  Home
                </option>
                <option value={'office'}>
                  Office
                </option>
                <option value={'other'}>
                  Other
                </option>
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col className="text-end">
            <Button color="danger" className="text-uppercase" onClick={onCreate}>
              Add
            </Button>
          </Col>
        </Row>
      </Form>
    </Container >
  )
}

export default AddressList
