/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
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
} from "reactstrap"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { getUserAddresses } from "../../services/authService";
import { showSuccess, showError } from '../../utils/toast';
import { useRouter } from "next/navigation"

const AddressList = () => {
  const router = useRouter()
  const userData = useSelector(
    (state: RootState) => state.auth.userData
  )
  const [addressData, setAddressData] = useState<any>([])

  const handleChange = (e: any) => {
    setAddressData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const fetchUserAddresses = async () => {
    const res = await getUserAddresses(userData.userId);
    const { success, message, data, error } = res.data
    if (success) {
      showSuccess(message);
      // console.log(data);
      if (data.length) {
        setAddressData(data);
      }
    } else {
      showError(message);
      console.error("Server error:", error);
    }
  }

  // const onUpdate = async (e: any) => {
  //   e.preventDefault();
  //   const res = await updateUser(userData.userId, userDetails);
  //   const { success, message, data, error } = res.data
  //   if (success) {
  //     showSuccess(message);
  //     // console.log(data);
  //   } else {
  //     showError(message);
  //     console.error("Server error:", error);
  //   }
  // }

  useEffect(() => {
    fetchUserAddresses();
  }, [])


  return (
    <Container fluid="sm">
      {addressData.length === 0 && (
        <Row>
          <Col className={`d-flex justify-content-center flex-column align-items-center ${styles.no_data_div}`}>
            <h6 className="text-danger py-3 px-5">No Addresses found</h6>
            <Button color="danger" className="text-uppercase" onClick={() => {
              router.push("addresses/add")
            }}>
              Add
            </Button>
          </Col>
        </Row>
      )}
      {/* <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="fName">
                First Name
              </Label>
              <Input
                id="fName"
                name="firstName"
                placeholder="John"
                type="text"
                onChange={handleChange}
                value={userDetails?.firstName || ""}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="lName">
                Last Name
              </Label>
              <Input
                id="lName"
                name="lastName"
                placeholder="Doe"
                type="text"
                onChange={handleChange}
                value={userDetails?.lastName || ""}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="email">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                placeholder="abc@gmail.com"
                type="email"
                disabled
                value={userDetails?.email || ""}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="mNumber">
                Mobile Number
              </Label>
              <Input
                id="mNumber"
                name="mobileNumber"
                placeholder="Enter mobile number"
                type="text"
                onChange={handleChange}
                value={userDetails?.mobileNumber || ""}
              />
            </FormGroup>
          </Col>
        </Row> */}

    </Container>
  )
}

export default AddressList
