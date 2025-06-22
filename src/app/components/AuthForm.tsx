/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useDispatch } from "react-redux"
// import { RootState } from "../../store"
import { login, setUserData } from "../../store/slices/authSlice"
import { registerUser, loginUser } from "../../services/authService";
import { showSuccess, showError } from '../../utils/toast';

const AuthForm = ({ type }: any) => {
  // const isAuthenticated = useSelector(
  //   (state: RootState) => state.auth.isAuthenticated
  // )
  const dispatch = useDispatch()
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  const resetForm = () => {
    setUserDetails({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    })
  }

  const onSubmit = async () => {
    if (type === "register") {
      const res = await registerUser(userDetails);
      const { success, message, data, error } = res.data
      if (success) {
        showSuccess(message);
        console.log(data);
        resetForm();
      } else {
        showError(message);
        console.error("Server error:", error);
      }
    } else if (type === "login") {
      const res = await loginUser({
        email: userDetails.email,
        password: userDetails.password
      });
      const { success, message, data, error } = res.data
      if (success) {
        showSuccess(message);
        console.log(data);
        localStorage.setItem("ecomToken", data.token)
        resetForm();
        dispatch(login())
        const { id, firstName, lastName, email } = data.userResp
        dispatch(setUserData({
          userId: id,
          firstName: firstName,
          lastName: lastName,
          email: email,
        }))
      } else {
        showError(message);
        console.error("Server error:", error);
      }
    }
  }

  useEffect(() => {
    resetForm()
  }, [])


  return (
    <Container fluid="sm">
      <Row xs="1">
        <Col
          xs="12"
          sm={{
            offset: 4,
            size: 4,
          }}
        >
          {type === "register" && (
            <Form className="p-5 border border-secondary shadow rounded mb-5">
              <FormGroup>
                <Label for="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={userDetails.firstName}
                  name="firstName"
                  placeholder="John"
                  type="text"
                  onChange={(e) => {
                    setUserDetails((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={userDetails.lastName}
                  name="lastName"
                  placeholder="Doe"
                  type="text"
                  onChange={(e) => {
                    setUserDetails((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  value={userDetails.email}
                  name="email"
                  placeholder="abc@example.com"
                  type="email"
                  onChange={(e) => {
                    setUserDetails((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  id="password"
                  value={userDetails.password}
                  name="password"
                  placeholder="1 Special Char, 1 Number, 1 Uppercase"
                  type="password"
                  onChange={(e) => {
                    setUserDetails((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }}
                />
              </FormGroup>
              <FormGroup className="text-center">
                <Button
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    onSubmit();
                  }}
                >
                  Register
                </Button>
              </FormGroup>
            </Form>
          )}
          {type === "login" && (
            <Form className="p-5 border border-secondary shadow rounded mb-5">
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  value={userDetails.email}
                  name="email"
                  placeholder="abc@example.com"
                  type="email"
                  onChange={(e) => {
                    setUserDetails((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  id="password"
                  value={userDetails.password}
                  name="password"
                  placeholder="1 Special Char, 1 Number, 1 Uppercase"
                  type="password"
                  onChange={(e) => {
                    setUserDetails((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }}
                />
              </FormGroup>
              <FormGroup className="text-center">
                <Button
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    onSubmit();
                  }}
                >
                  Login
                </Button>
              </FormGroup>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default AuthForm
