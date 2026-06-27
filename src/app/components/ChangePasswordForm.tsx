/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { updatePassword } from "../../services/authService";
import { showSuccess, showError } from '../../utils/toast';
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
// import { useRouter } from "next/navigation"

const ChangePasswordForm = () => {
  // const router = useRouter()
  const userData = useSelector(
    (state: RootState) => state.auth.userData
  )
  const [userDetails, setUserDetails] = useState<any>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = (e: any) => {
    setUserDetails((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const onBtnClick = async (e: any) => {
    e.preventDefault();
    console.log(userDetails)
    if (userDetails.currentPassword === "") {
      showError("Current password is required.");
      return false
    } else if (userDetails.newPassword === "") {
      showError("New password is required.");
      return false
    } else if (userDetails.confirmNewPassword === "") {
      showError("Confirm New password is required.");
      return false
    } else if (userDetails.newPassword !== userDetails.confirmNewPassword) {
      showError("New password is not matching with confirm password.");
      return false
    }
    const res = await updatePassword(userData.userId, userDetails);
    const { success, message, data, error } = res.data
    if (success) {
      showSuccess(message);
      // console.log(data);
      setUserDetails({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      })
    } else {
      showError(message);
      console.error("Server error:", error);
    }
  }


  return (
    <Container fluid="sm">
      <Form>
        <Row>
          <Col sm={{
            offset: 3,
            size: 6
          }}>
            <FormGroup>
              <Label for="currentPassword">
                Current Password
              </Label>
              <div className="position-relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  placeholder="Enter current password"
                  type={showCurrent ? "text" : "password"}
                  onChange={handleChange}
                  value={userDetails?.currentPassword || ""}
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    color: "#6c757d",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  {showCurrent ? <VisibilityOffIcon style={{ fontSize: "20px" }} /> : <VisibilityIcon style={{ fontSize: "20px" }} />}
                </button>
              </div>
            </FormGroup>
          </Col>
          <Col sm={{
            offset: 3,
            size: 6
          }}>
            <FormGroup>
              <Label for="newPassword">
                New Password
              </Label>
              <div className="position-relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  placeholder="Enter new password"
                  type={showNew ? "text" : "password"}
                  onChange={handleChange}
                  value={userDetails?.newPassword || ""}
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    color: "#6c757d",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  {showNew ? <VisibilityOffIcon style={{ fontSize: "20px" }} /> : <VisibilityIcon style={{ fontSize: "20px" }} />}
                </button>
              </div>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={{
            offset: 3,
            size: 6
          }}>
            <FormGroup>
              <Label for="confirmNewPassword">
                Confirm New Password
              </Label>
              <div className="position-relative">
                <Input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  placeholder="Enter new password again"
                  type={showConfirm ? "text" : "password"}
                  onChange={handleChange}
                  value={userDetails?.confirmNewPassword || ""}
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    color: "#6c757d",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  {showConfirm ? <VisibilityOffIcon style={{ fontSize: "20px" }} /> : <VisibilityIcon style={{ fontSize: "20px" }} />}
                </button>
              </div>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col className="text-end">
            <Button color="danger" className="text-uppercase" onClick={onBtnClick}>
              Change
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  )
}

export default ChangePasswordForm
