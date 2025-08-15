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
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Badge,
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
    <Container fluid="sm" className="mb-5">
      {addressData.length === 0 && (
        <Row>
          <Col className={`d-flex justify-content-center flex-column align-items-center ${styles.no_data_div}`}>
            <h6 className="text-danger py-3 px-5">No Addresses found</h6>
            <Button color="danger" className="text-uppercase" onClick={() => {
              router.push("/addresses/add")
            }}>
              Add
            </Button>
          </Col>
        </Row>
      )}
      {addressData.length > 0 && (
        <>
          <Row>
            {addressData.map((ad: any, adIndex: number) => {
              return (
                <Col key={adIndex} md="6" className="mb-3">
                  <Card
                    className="p-3"
                  >
                    <CardBody>
                      <CardTitle tag="h5" className="text-capitalize">
                        {ad.addressType}
                        {ad.isDefault && (
                          <Badge className="ms-2">
                            Default
                          </Badge>
                        )}
                      </CardTitle>
                      {/* <CardSubtitle
                        className="mb-2 text-muted"
                        tag="h6"
                      >
                        Card subtitle
                      </CardSubtitle> */}
                      <CardText>
                        Some quick example text to build on the card title and make up the bulk of the card‘s content.
                      </CardText>
                      <div className="d-flex">
                        <Button color="danger" size="sm" className="text-uppercase me-2" >
                          Edit
                        </Button>
                        <Button color="danger" size="sm" className="text-uppercase me-2" >
                          Delete
                        </Button>
                        {!ad.isDefault && <Button color="danger" size="sm" className="text-uppercase me-2" >
                          Make Default
                        </Button>}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </>
      )}
      {addressData.length > 0 && (
        <Row>
          <Col className={`d-flex justify-content-center flex-column align-items-center mt-3`}>
            <Button color="danger" className="text-uppercase" onClick={() => {
              router.push("/addresses/add")
            }}>
              Add More
            </Button>
          </Col>
        </Row>
      )}

    </Container >
  )
}

export default AddressList
