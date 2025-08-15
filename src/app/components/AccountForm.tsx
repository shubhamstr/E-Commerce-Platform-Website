/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useEffect, useState } from "react"
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
import { getUser, updateUser } from "../../services/authService";
import { showSuccess, showError } from '../../utils/toast';
// import { useRouter } from "next/navigation"

const AccountForm = () => {
  // const router = useRouter()
  const userData = useSelector(
    (state: RootState) => state.auth.userData
  )
  const [userDetails, setUserDetails] = useState<any>()

  const handleChange = (e: any) => {
    setUserDetails((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const fetchUserData = async () => {
    const res = await getUser(userData.userId);
    const { success, message, data, error } = res.data
    if (success) {
      showSuccess(message);
      // console.log(data);
      if (data) {
        setUserDetails({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          mobileNumber: data.mobileNumber,
        });
      }
    } else {
      showError(message);
      console.error("Server error:", error);
    }
  }

  const onUpdate = async (e: any) => {
    e.preventDefault();
    const res = await updateUser(userData.userId, userDetails);
    const { success, message, data, error } = res.data
    if (success) {
      showSuccess(message);
      // console.log(data);
    } else {
      showError(message);
      console.error("Server error:", error);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, [])


  return (
    <Container fluid="sm">
      <Form>
        <Row>
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
        </Row>
        <Row>
          <Col className="text-end">
            <Button color="danger" className="text-uppercase" onClick={onUpdate}>
              Update
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  )
}

export default AccountForm
