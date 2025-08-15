/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState } from "react"
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Container,
  // NavbarText
} from "reactstrap"
import { useRouter } from "next/navigation"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store"
import { login, logout, setUserData } from "../../store/slices/authSlice"
import { jwtDecode } from "jwt-decode";
import { showError } from '../../utils/toast';

function Header(args: any) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )
  const dispatch = useDispatch()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  if (localStorage.ecomToken) {
    const token = localStorage.getItem("ecomToken");
    console.log(token)
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded JWT:", decoded);
        // showSuccess("Invalid JWT")
        const { userId }: any = decoded
        dispatch(login())
        dispatch(setUserData(
          { userId: userId }
        ))
      } catch (error) {
        console.error("Invalid JWT:", error);
        showError("Invalid JWT")
      }
    }
  }

  return (
    <div>
      <Navbar {...args}>
        <Container
          fluid="sm"
          className="d-flex justify-content-between align-ietms-center flex-wrap"
        >
          <NavbarBrand
            href="/"
            className="text-uppercase"
            onClick={(e) => {
              e.preventDefault()
              router.push("/")
            }}
          >
            Guest Market
          </NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="me-auto" navbar>
              <NavItem>
                <NavLink
                  href="/shop/"
                  onClick={(e) => {
                    e.preventDefault()
                    router.push("/shop")
                  }}
                >
                  Shop
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="/wishlist/"
                  onClick={(e) => {
                    e.preventDefault()
                    router.push("/wishlist")
                  }}
                >
                  Wishlist
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="/contact/"
                  onClick={(e) => {
                    e.preventDefault()
                    router.push("/contact")
                  }}
                >
                  Contact
                </NavLink>
              </NavItem>
            </Nav>
            <Nav className="d-flex gap-2" navbar>
              <NavItem>
                <NavLink
                  href="/cart/"
                  onClick={(e) => {
                    e.preventDefault()
                    router.push("/cart")
                  }}
                >
                  <ShoppingCartIcon /> Cart
                </NavLink>
              </NavItem>
              {isAuthenticated ? (
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav>
                    <AccountCircleIcon />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem
                      onClick={() => {
                        router.push("/account")
                      }}>Account</DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        router.push("/change-password")
                      }}>Change Password</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem
                      onClick={() => {
                        dispatch(logout())
                      }}
                    >
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              ) : (
                <>
                  <NavItem>
                    <Button
                      color="primary"
                      outline
                      onClick={() => {
                        router.push("/login")
                      }}
                    >
                      Login
                    </Button>
                  </NavItem>
                  <NavItem>
                    <Button
                      color="primary"
                      outline
                      onClick={() => {
                        router.push("/register")
                      }}
                    >
                      Register
                    </Button>
                  </NavItem>
                </>
              )}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default Header
