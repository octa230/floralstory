'use client'


import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useCartStore, userStoreActions, useUserStore } from '../../../Store'

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBIcon,
} from 'mdb-react-ui-kit'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { URL } from '../../constants'
const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  

  const login = useUserStore(state=> state.login)
  const{ user } = useCartStore()


  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect' || '/')


  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { data } = await axios.post(`${URL}/auth/login`, {
        email,
        password
      })
      console.log(data.user)
      // Fix: You were checking response.ok but using axios which doesn't have this
      if (data.success) {
        const cleanData ={
          ...data.user,
          token: data.token
        }
        login(cleanData)
        console.log(cleanData)
        
        //router.push('/')
        router.push(redirect)
      } else {
        throw new Error(data.message || 'Login failed')
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
      toast.error(err.message)
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
                <h3 className="fw-bold text-primary">Welcome Back</h3>
                <p className="text-muted">Sign in to your account</p>
              </div>

              <form onSubmit={handleSubmit}>
                <MDBInput
                  wrapperClass="mb-4"
                  label="Email address"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <MDBInput
                  wrapperClass="mb-4"
                  label="Password"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="d-flex justify-content-between mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <Link href="/forgot-password" className="text-decoration-none">
                    Forgot password?
                  </Link>
                </div>

                
              <MDBBtn
                type="submit"
                color="primary"
                className="w-100 mb-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </MDBBtn>

                <div className="text-center text-muted my-4">— OR —</div>

                <MDBBtn
                  tag="a"
                  color="light"
                  className="w-100 mb-3 d-flex align-items-center justify-content-center"
                  href="#!"
                >
                  <MDBIcon fab icon="google" className="me-2 text-danger" />
                  Continue with Google
                </MDBBtn>

                <MDBBtn
                  tag="a"
                  color="light"
                  className="w-100 d-flex align-items-center justify-content-center"
                  href="#!"
                >
                  <MDBIcon fab icon="facebook-f" className="me-2 text-primary" />
                  Continue with Facebook
                </MDBBtn>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-primary text-decoration-none">
                    Sign up
                  </Link>
                </p>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  )
}

export default LoginPage