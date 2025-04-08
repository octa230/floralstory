'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement } from '@stripe/react-stripe-js'
import axios from 'axios'
import { URL } from '../constants'
import { useUserStore, useCartStore } from '@/Store'

const stripePromise = loadStripe('pk_test_51RA5EaPOwmNAjOPnjmMO2GdEwHEhajdLCmIU3rqcw4l8pypRuOugdAZZ7G2361mXHi2dSR5SMgJufcTavtzjUdSU001O59fgmq')

const Checkout = () => {
  const [clientSecret, setClientSecret] = useState('')
    const { items, totalPrice, removeItem, updateItemQuantity } = useCartStore()
    const { user } = useUserStore()
    const[message, setMessage] = useState(null)

    console.log(user)

  const handleSubmit=()=>{
    console.log(items, totalPrice, user)
  }

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const {data} = await axios.post(`${URL}/checkout/intent`, {
          items,
          user,
          totalPrice
        })
        console.log(data)
        const secret = (data.clientSecret).toString()
        setClientSecret(secret)
        console.log(secret)
      } catch (error) {
        console.error('Failed to fetch clientSecret:', error)
        setMessage(error)
      }
    }
    fetchClientSecret()
  }, [])

  return (
    <div className='row checkout-container'>
  {/* Order Summary Section */}
  <div className='col-lg-8 col-md-7 order-summary'>
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="mb-4">
          <i className="fas fa-receipt me-2 text-primary"></i>
          Order Summary
        </h2>
        {/* Your order items would go here */}
        <div className="order-items">
          {/* Example item */}
          <div className="d-flex justify-content-between py-2 border-bottom">
            <span>Product Name x 1</span>
            <span>AED 50.00</span>
          </div>
          {/* Total */}
          <div className="d-flex justify-content-between py-3 fw-bold fs-5">
            <span>Total</span>
            <span>AED 50.00</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Payment Section */}
  <div className='col-lg-4 col-md-5 payment-section'>
    <div className="card shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
      <div className="card-body">
        <h2 className="mb-4">
          <i className="fas fa-credit-card me-2 text-primary"></i>
          Payment
        </h2>
        
        {clientSecret ? (
          <Elements 
            stripe={stripePromise} 
            options={{ 
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#4f46e5',
                  borderRadius: '8px',
                }
              }
            }}
          >
            <form onSubmit={handleSubmit} className="payment-form">
              <div className="mb-4">
                <PaymentElement 
                  options={{
                    layout: {
                      type: 'tabs',
                      defaultCollapsed: false
                    }
                  }}
                />
              </div>
              <button 
                className="btn btn-primary w-100 py-3 fw-bold"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  border: 'none',
                  fontSize: '1.1rem'
                }}
              >
                <i className="fas fa-lock me-2"></i>
                Pay Now
              </button>
              {message && (
                <div className="alert alert-danger mt-3">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {message}
                </div>
              )}
            </form>
          </Elements>
        ) : (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Preparing secure payment...</p>
          </div>
        )}
      </div>
    </div>
  </div>
</div>
  )
}

export default Checkout