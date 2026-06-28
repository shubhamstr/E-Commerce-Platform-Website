"use client"
import React from "react"
import { Col, Container, NavLink, Row } from "reactstrap"
import EmailIcon from "@mui/icons-material/Email"
import CallIcon from "@mui/icons-material/Call"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import GitHubIcon from "@mui/icons-material/GitHub"
import LanguageIcon from "@mui/icons-material/Language"
import StorefrontIcon from "@mui/icons-material/Storefront"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import SupportAgentIcon from "@mui/icons-material/SupportAgent"
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser"
import styles from "./footer.module.css"

function Footer() {
  return (
    <footer>
      {/* Features strip */}
      <Container fluid className={styles.featuresStrip}>
        <Container fluid="sm">
          <Row xs="2" md="4" className="text-center py-4">
            <Col className="py-2">
              <LocalShippingIcon className={styles.featureIcon} />
              <p className={styles.featureText}>Free Shipping</p>
              <span className={styles.featureSubtext}>On orders over $50</span>
            </Col>
            <Col className="py-2">
              <SupportAgentIcon className={styles.featureIcon} />
              <p className={styles.featureText}>24/7 Support</p>
              <span className={styles.featureSubtext}>Dedicated help anytime</span>
            </Col>
            <Col className="py-2">
              <VerifiedUserIcon className={styles.featureIcon} />
              <p className={styles.featureText}>Secure Checkout</p>
              <span className={styles.featureSubtext}>100% protected payments</span>
            </Col>
            <Col className="py-2">
              <StorefrontIcon className={styles.featureIcon} />
              <p className={styles.featureText}>Easy Returns</p>
              <span className={styles.featureSubtext}>30-day return policy</span>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* Main footer */}
      <Container fluid className={styles.footerMain}>
        <Container fluid="sm">
          <Row xs="1" sm="2" md="4" className="py-5">
            {/* Brand column */}
            <Col className="mb-4">
              <h2 className={styles.brandName}>ShopNest</h2>
              <p className={styles.brandDesc}>
                Your one-stop destination for electronics, fashion, home essentials, and more.
                Quality products at the best prices.
              </p>
            </Col>

            {/* Quick Links */}
            <Col className="mb-4">
              <h6 className={styles.footerHeading}>Quick Links</h6>
              <ul className={styles.listStyle}>
                <li><NavLink href="/shop/" className={styles.footerLink}>Shop All</NavLink></li>
                <li><NavLink href="/cart/" className={styles.footerLink}>Shopping Cart</NavLink></li>
                <li><NavLink href="/track-order/" className={styles.footerLink}>Track Order</NavLink></li>
                <li><NavLink href="/wishlist/" className={styles.footerLink}>Wishlist</NavLink></li>
              </ul>
            </Col>

            {/* Company */}
            <Col className="mb-4">
              <h6 className={styles.footerHeading}>Company</h6>
              <ul className={styles.listStyle}>
                <li><NavLink href="/contact/" className={styles.footerLink}>Contact Us</NavLink></li>
                <li><NavLink href="/seller-form/" className={styles.footerLink}>Become a Seller</NavLink></li>
                <li><NavLink href="/login/" className={styles.footerLink}>My Account</NavLink></li>
                <li><NavLink href="/orders/" className={styles.footerLink}>My Orders</NavLink></li>
              </ul>
            </Col>

            {/* Contact */}
            <Col className="mb-4">
              <h6 className={styles.footerHeading}>Contact Info</h6>
              <div className={styles.contactItem}>
                <LocationOnIcon className={styles.contactIcon} />
                <span>San Francisco, CA, USA</span>
              </div>
              <div className={styles.contactItem}>
                <CallIcon className={styles.contactIcon} />
                <span>+1 (800) 123-4567</span>
              </div>
              <div className={styles.contactItem}>
                <EmailIcon className={styles.contactIcon} />
                <span>support@shopnest.com</span>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* Bottom bar */}
      <Container fluid className={styles.footerBottom}>
        <Container fluid="sm">
          <div className={styles.footerBottomContent}>
            <span>© {new Date().getFullYear()} ShopNest. All rights reserved.</span>
            <span>
              Built by{" "}
              <a href="https://codeguest.in" target="_blank" rel="noopener noreferrer" className={styles.portfolioLink}>
                Shubham
              </a>
            </span>
          </div>
        </Container>
      </Container>
    </footer>
  )
}

export default Footer
