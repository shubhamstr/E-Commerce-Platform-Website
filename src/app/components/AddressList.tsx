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
import { getUserAddresses, deleteAddress, makeAddressDefault } from "../../services/authService";
import { showSuccess, showError } from '../../utils/toast';
import { useRouter } from "next/navigation"

const AddressList = () => {
  const router = useRouter()
  const userData = useSelector(
    (state: RootState) => state.auth.userData
  )
  const [addressData, setAddressData] = useState<any>([])

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

  const onDelete = async (id: any) => {
    const res = await deleteAddress(id);
    const { success, message, data, error } = res.data
    if (success) {
      showSuccess(message);
      // console.log(data);
      fetchUserAddresses()
    } else {
      showError(message);
      console.error("Server error:", error);
    }
  }

  const makeDefault = async (id: any) => {
    const res = await makeAddressDefault(id, userData.userId);
    const { success, message, data, error } = res.data
    if (success) {
      showSuccess(message);
      // console.log(data);
      fetchUserAddresses()
    } else {
      showError(message);
      console.error("Server error:", error);
    }
  }

  function formatAddress(addressArr: any) {
    return addressArr
      .filter(Boolean) // removes null, undefined, and empty strings
      .join(', ');
  }

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
              const addr = formatAddress([
                ad?.addressLine1,
                ad?.addressLine2,
                ad?.city,
                ad?.state,
                ad?.pinCode,
              ]);
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
                        {addr}
                      </CardText>
                      <div className="d-flex">
                        <Button color="danger" size="sm" className="text-uppercase me-2" onClick={() => {
                          router.push(`/addresses/${ad.id}`)
                        }}>
                          Edit
                        </Button>
                        <Button color="danger" size="sm" className="text-uppercase me-2" onClick={() => {
                          onDelete(ad.id)
                        }}>
                          Delete
                        </Button>
                        {!ad.isDefault && <Button color="danger" size="sm" className="text-uppercase me-2" onClick={() => {
                          makeDefault(ad.id)
                        }}>
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
