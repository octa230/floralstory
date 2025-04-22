'use client'

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { URL } from '../constants';
import { useUserStore, useCartStore, calculateTotalWithAccessories } from '@/Store';

// Make sure to load Stripe only once and asynchronously
const stripePromise = loadStripe('pk_test_51RA5EaPOwmNAjOPnjmMO2GdEwHEhajdLCmIU3rqcw4l8pypRuOugdAZZ7G2361mXHi2dSR5SMgJufcTavtzjUdSU001O59fgmq'); // Replace with your actual publishable key

// Separate component for the payment form
const CheckoutForm = ({ clientSecret, order }) => {
  const { useStripe, useElements, PaymentElement } = require('@stripe/react-stripe-js');
  const stripe = useStripe();
  const elements = useElements();
  const {user} = useUserStore()
  const [message, setMessage] = useState(null);


  const confirmOrder = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
  
    setMessage(null);
  
    try {
      // Get the order data directly from the store in the correct format
      const orderData = useCartStore.getState().getOrderData(user);
      
      // Send to backend
      const { data } = await axios.post(`${URL}/placeorder`, orderData);
  
      if (data && data._id) {
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/order-completed`,
          },
        });
  
        if (error) {
          setMessage(error.message);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          setMessage('🎉 Payment & Order Successful!');
          // Clear cart on successful payment
          //useCartStore.getState().clearCart();
        }
      } else {
        setMessage('❌ Failed to create order.');
      }
    } catch (err) {
      setMessage('Something went wrong during checkout.');
      console.error(err);
    }
  };
  
  /* const confirmOrder = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setMessage(null);

    try {
      const { data } = await axios.post(`${URL}/placeorder`, { order });

      if (data && data._id) {
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/order-completed`,
          },
        });

        if (error) {
          setMessage(error.message);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          setMessage('🎉 Payment & Order Successful!');
        }
      } else {
        setMessage('❌ Failed to create order.');
      }
    } catch (err) {
      setMessage('Something went wrong during checkout.');
      console.error(err);
    }
  };
 */
  return (
    <form onSubmit={confirmOrder} className="payment-form">
      <div className="mb-4">
        <PaymentElement />
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100 py-3 fw-bold"
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          border: 'none',
          fontSize: '1.1rem',
        }}
      >
        <i className="fas fa-lock me-2"></i>
        Pay Now {order.fullTotal.toFixed(2)}
      </button>
      {message && (
        <div className="alert alert-danger mt-3">
          <i className="fas fa-exclamation-circle me-2"></i>
          {message}
        </div>
      )}
    </form>
  );
};

const Checkout = () => {
  const [clientSecret, setClientSecret] = useState('');
  const { items } = useCartStore();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { deliveryFees, total, accessoriesTotal, fullTotal } = calculateTotalWithAccessories(items);

  const order = {
    ...items,
    user,
    deliveryFees,
    total,
    accessoriesTotal,
    fullTotal,
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchClientSecret = async () => {
      try {
        const { data } = await axios.post(`${URL}/checkout/intent`, {
          totalPrice: fullTotal,
          user,
        });
        setClientSecret(data.clientSecret.toString());
      } catch (error) {
        console.error('Failed to fetch clientSecret:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientSecret();
  }, [user, fullTotal]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Preparing secure payment...</p>
      </div>
    );
  }

  return (
    <div className="row checkout-container">
      <div className="col-lg-8 col-md-7 order-summary">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h2 className="mb-4">
              <i className="fas fa-receipt me-2 text-primary"></i>
              Order Summary
            </h2>
            <div className="order-items">
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span>Items</span>
                <span>AED {total.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span>Additionals</span>
                <span>AED {accessoriesTotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span>Delivery Fee</span>
                <span>AED {deliveryFees.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between py-3 fw-bold fs-5">
                <span>Total</span>
                <span>{fullTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4 col-md-5 payment-section">
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
                    },
                  },
                }}
              >
                <CheckoutForm clientSecret={clientSecret} order={order} />
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
  );
};

export default Checkout;