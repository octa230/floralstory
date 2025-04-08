'use client'
import React, { useState, useEffect } from 'react'
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBIcon,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBSpinner,
  MDBAlert
} from 'mdb-react-ui-kit'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })
  const [validationModal, setValidationModal] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1) // 1: Form, 2: Verification
  const router = useRouter()

  // Generate random 6-digit code
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.name) return 'Name is required'
    if (!formData.email.includes('@')) return 'Valid email is required'
    if (formData.password.length < 8) return 'Password must be at least 8 characters'
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match'
    if (!formData.phone) return 'Phone number is required'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validateForm()
    
    if (validationError) {
      setError(validationError)
      return
    }

    // Show verification modal
    const code = generateVerificationCode()
    setGeneratedCode(code)
    setValidationModal(true)
    
    // In a real app, you would send this code via SMS/email
    console.log('Verification code:', code) // For demo purposes
  }

  const verifyCode = () => {
    if (verificationCode !== generatedCode) {
      setError('Invalid verification code')
      return false
    }
    return true
  }

  const completeRegistration = async () => {
    if (!verifyCode()) return

    setIsLoading(true)
    try {
      // Replace with your actual registration API call
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      router.push('/dashboard') // Redirect on success
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
      setValidationModal(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MDBContainer fluid className="p-4 bg-light min-vh-100 d-flex align-items-center">
      <MDBRow className="justify-content-center w-100">
        <MDBCol md="8" lg="6" xl="5">
          <MDBCard className="shadow-sm">
            <MDBCardBody className="p-5">
              <div className="text-center mb-4">
                <h3 className="fw-bold text-primary">Create Account</h3>
                <p className="text-muted">Join our community today</p>
              </div>

              {error && (
                <MDBAlert color="danger" dismissible onClose={() => setError('')}>
                  {error}
                </MDBAlert>
              )}

              <form onSubmit={handleSubmit}>
                <MDBInput
                  wrapperClass="mb-4"
                  label="Full Name"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />

                <MDBInput
                  wrapperClass="mb-4"
                  label="Email address"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />

                <MDBInput
                  wrapperClass="mb-4"
                  label="Password"
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength="8"
                />

                <MDBInput
                  wrapperClass="mb-4"
                  label="Confirm Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />

                <MDBInput
                  wrapperClass="mb-4"
                  label="Phone Number"
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a 10-digit phone number"
                />

                <MDBBtn
                  type="submit"
                  color="primary"
                  className="w-100 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <MDBSpinner size="sm" role="status" tag="span" className="me-2" />
                      Creating account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </MDBBtn>

                <div className="text-center mt-3">
                  <p className="text-muted">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary text-decoration-none">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* Phone Verification Modal */}
      <MDBModal show={validationModal} setShow={setValidationModal} staticBackdrop tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Phone Verification</MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody>
              <p>We've sent a 6-digit verification code to {formData.phone}</p>
              
              <MDBInput
                label="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="mb-3"
                maxLength="6"
              />
              
              {error && (
                <MDBAlert color="danger" className="mb-3">
                  {error}
                </MDBAlert>
              )}
              
              <p className="small text-muted">
                Didn't receive code? <a href="#!" onClick={() => {
                  const newCode = generateVerificationCode()
                  setGeneratedCode(newCode)
                  console.log('New code:', newCode) // For demo
                }}>Resend</a>
              </p>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={() => setValidationModal(false)}>
                Cancel
              </MDBBtn>
              <MDBBtn color="primary" onClick={completeRegistration} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <MDBSpinner size="sm" role="status" tag="span" className="me-2" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Complete'
                )}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </MDBContainer>
  )
}

export default SignUpPage