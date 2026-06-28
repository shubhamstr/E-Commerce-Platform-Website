/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState, useEffect } from "react"
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
import { setWishlist, clearWishlist } from "../../store/slices/wishlistSlice"
import { getWishlist } from "../../services/wishlistService"
import { setCart, clearCartState } from "../../store/slices/cartSlice"
import { getCart } from "../../services/cartService"
import { jwtDecode } from "jwt-decode"
import branding from "../../branding"

function Header(args: any) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items)
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const dispatch = useDispatch()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("ecomToken")
      if (token) {
        try {
          const decoded = jwtDecode(token)
          console.log("Decoded JWT:", decoded)
          const { userId, firstName, lastName, email }: any = decoded
          dispatch(login())
          dispatch(setUserData({ userId, firstName, lastName, email }))
        } catch (error) {
          console.error("Invalid JWT:", error)
          localStorage.removeItem("ecomToken")
        }
      }
    }
  }, [dispatch])

  // Fetch wishlist and cart items when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchWishlist = async () => {
        try {
          const res = await getWishlist()
          if (res.data && res.data.success) {
            dispatch(setWishlist(res.data.data || []))
          }
        } catch (error) {
          console.error("Error fetching wishlist in header:", error)
        }
      }
      const fetchCart = async () => {
        try {
          const res = await getCart()
          if (res.data && res.data.success) {
            dispatch(setCart(res.data.data || []))
          }
        } catch (error) {
          console.error("Error fetching cart in header:", error)
        }
      }
      fetchWishlist()
      fetchCart()
    } else {
      dispatch(clearWishlist())
      dispatch(clearCartState())
    }
  }, [isAuthenticated, dispatch])

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
            {branding.name}
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
              {isAuthenticated && (
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
              )}
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
                  <ShoppingCartIcon /> Cart {isAuthenticated && cartItems.length > 0 ? `(${cartItems.reduce((acc, item) => acc + item.quantity, 0)})` : ""}
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
                      }}
                    >
                      Account
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        router.push("/addresses")
                      }}
                    >
                      Addresses
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        router.push("/orders")
                      }}
                    >
                      My Orders
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        router.push("/change-password")
                      }}
                    >
                      Change Password
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem
                      onClick={() => {
                        dispatch(logout())
                        dispatch(clearWishlist())
                        dispatch(clearCartState())
                        localStorage.removeItem("ecomToken")
                        router.push("/")
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
