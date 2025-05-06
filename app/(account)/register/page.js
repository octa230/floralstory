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
import axios from 'axios'
import { URL } from '../../constants'

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()


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
    console.log(formData)
    e.preventDefault()
    const validationError = validateForm()
    
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    try {
      // Replace with your actual registration API call
      const {data} = await axios.post(`${URL}/auth/signup`, formData)
      if(data && data.user){
        console.log(data)
      }

      router.push('/') // Redirect on success
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
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
    </MDBContainer>
  )
}

export default SignUpPage