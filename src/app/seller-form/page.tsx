/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { registerSeller } from "../../services/authService"
import { showSuccess, showError } from "../../utils/toast"
import styles from "./sellerForm.module.css"

// Password strength helper
const getPasswordStrength = (password: string) => {
  if (!password) return { level: 0, label: "", segments: [false, false, false] }
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { level: 1, label: "Weak", segments: [true, false, false] }
  if (score <= 2) return { level: 2, label: "Medium", segments: [true, true, false] }
  return { level: 3, label: "Strong", segments: [true, true, true] }
}

const strengthClass: Record<string, string> = {
  Weak: styles.weak,
  Medium: styles.medium,
  Strong: styles.strong,
}

const SellerFormPage = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const strength = getPasswordStrength(form.password)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.firstName.trim()) newErrors.firstName = "First name is required"
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!form.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email address"
    if (!form.password) newErrors.password = "Password is required"
    else if (form.password.length < 8) newErrors.password = "Minimum 8 characters"
    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    if (!agreed) newErrors.agreed = "You must accept the terms"
    return newErrors
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const { confirmPassword, ...payload } = form
      const res = await registerSeller(payload)
      const { success, message } = res.data
      if (success) {
        showSuccess(message, { autoClose: false, closeOnClick: false })
        setSubmitted(true)
      } else {
        showError(message)
      }
    } catch (err: any) {
      showError(err?.response?.data?.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.badge}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          Become a Seller
        </div>
        <h1 className={styles.heroTitle}>
          Start Selling on <span>Our Platform</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Register your seller account today. After admin approval you can list products and reach thousands of customers.
        </p>
      </div>

      {/* Benefits */}
      <div className={styles.benefitsRow}>
        <div className={styles.benefitCard}>
          <div className={`${styles.benefitIcon} ${styles.purple}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          Wide Product Reach
        </div>
        <div className={styles.benefitCard}>
          <div className={`${styles.benefitIcon} ${styles.pink}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </div>
          Easy Dashboard
        </div>
        <div className={styles.benefitCard}>
          <div className={`${styles.benefitIcon} ${styles.cyan}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          Secure & Trusted
        </div>
      </div>

      {/* Form Card */}
      <div className={styles.formCard}>
        {submitted ? (
          // ── Success State ──
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className={styles.successTitle}>Application Submitted!</h2>
            <p className={styles.successText}>
              Your seller account has been created and is now <strong>pending admin approval</strong>.
              You&apos;ll be able to log in once an admin reviews and activates your account.
            </p>
            <div className={styles.successHighlight}>
              📧 We&apos;ll notify you once your account is activated
            </div>
            <br />
            <button className={styles.backToLoginBtn} onClick={() => { window.open("http://localhost:4010/ecom/seller-login", "_blank") }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Seller Login
            </button>
          </div>
        ) : (
          // ── Registration Form ──
          <form onSubmit={onSubmit} noValidate>
            <h2 className={styles.cardTitle}>Create Seller Account</h2>
            <p className={styles.cardSubtitle}>Fill in your details to apply as a seller</p>

            {/* Name Row */}
            <div className={styles.formRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>First Name</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    className={`${styles.input} ${errors.firstName ? styles.error : ""}`}
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={onChange}
                    placeholder="John"
                    id="sellerFirstName"
                  />
                </div>
                {errors.firstName && <span className={styles.errorMsg}>{errors.firstName}</span>}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Last Name</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    className={`${styles.input} ${errors.lastName ? styles.error : ""}`}
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={onChange}
                    placeholder="Doe"
                    id="sellerLastName"
                  />
                </div>
                {errors.lastName && <span className={styles.errorMsg}>{errors.lastName}</span>}
              </div>
            </div>

            {/* Email */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Email Address</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  className={`${styles.input} ${errors.email ? styles.error : ""}`}
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="you@example.com"
                  id="sellerEmail"
                />
              </div>
              {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
            </div>

            {/* Mobile */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Mobile Number <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>(optional)</span></label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                    <path d="M12 18h.01" />
                  </svg>
                </span>
                <input
                  className={styles.input}
                  type="tel"
                  name="mobileNumber"
                  value={form.mobileNumber}
                  onChange={onChange}
                  placeholder="+91 99999 99999"
                  id="sellerMobile"
                />
              </div>
            </div>

            <div className={styles.divider}>Account Security</div>

            {/* Password */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  className={`${styles.input} ${errors.password ? styles.error : ""}`}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="Min. 8 characters"
                  id="sellerPassword"
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {form.password && (
                <>
                  <div className={styles.strengthBar}>
                    {strength.segments.map((active, i) => (
                      <div
                        key={i}
                        className={`${styles.strengthSegment} ${active ? strengthClass[strength.label] : ""}`}
                      />
                    ))}
                  </div>
                  <span className={`${styles.strengthLabel} ${strengthClass[strength.label]}`}>
                    {strength.label} password
                  </span>
                </>
              )}
              {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Confirm Password</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  className={`${styles.input} ${errors.confirmPassword ? styles.error : ""}`}
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={onChange}
                  placeholder="Repeat password"
                  id="sellerConfirmPassword"
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                  {showConfirm ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && <span className={styles.errorMsg}>{errors.confirmPassword}</span>}
            </div>

            {/* Terms */}
            <div className={styles.termsRow}>
              <input
                type="checkbox"
                id="sellerTerms"
                className={styles.termsCheckbox}
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked)
                  if (errors.agreed) setErrors((prev) => ({ ...prev, agreed: "" }))
                }}
              />
              <label htmlFor="sellerTerms" className={styles.termsText}>
                I agree to the{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Seller Policy</a>. I understand that my account will be reviewed before activation.
              </label>
            </div>
            {errors.agreed && <span className={styles.errorMsg}>{errors.agreed}</span>}

            {/* Submit */}
            <button className={styles.submitBtn} type="submit" disabled={loading} id="sellerSubmitBtn">
              {loading ? (
                <>
                  <div className={styles.spinner} />
                  Submitting Application...
                </>
              ) : (
                <>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  Apply as Seller
                </>
              )}
            </button>


          </form>
        )}
      </div>

      {/* Footer seller login link */}
      <p className={styles.footerText}>
        Already have a seller account?{" "}
        <a href="http://localhost:4010/ecom/seller-login" className={styles.footerLink} target="_blank" rel="noopener noreferrer">
          Sign in as Seller
        </a>
      </p>
    </div>
  )
}

export default SellerFormPage
