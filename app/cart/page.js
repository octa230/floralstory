'use client'
import React from 'react'
import { useCartStore } from '@/Store'
import { MDBBtn } from 'mdb-react-ui-kit'
import { useRouter } from 'next/navigation'
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa'
import AddressForm from '../components/AddressForm'

const CartScreen = () => {
  const router = useRouter()
  const { items, totalPrice, removeItem, updateItemQuantity } = useCartStore()

  const handleUpdateQuantity = (itemId, change) => {
    updateItemQuantity(itemId, change)
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <MDBBtn color='light' onClick={() => router.back()} className="me-3">
          <FaArrowLeft />
        </MDBBtn>
        <h1 className="mb-0">Your Shopping Cart</h1>
        <span className="badge bg-primary ms-3" style={{ fontSize: '1rem' }}>
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="row">
        {/* Items List */}
        <div className="col-lg-8 mb-4">
          {items.length === 0 ? (
            <div className="text-center py-5">
              <img 
                src="/empty-cart.svg" 
                alt="Empty cart" 
                style={{ width: '200px', opacity: 0.7 }}
                className="mb-4"
              />
              <h4 className="text-muted">Your cart is empty</h4>
              <MDBBtn 
                color="primary" 
                className="mt-3 px-4"
                onClick={() => router.push('/')}
              >
                Continue Shopping
              </MDBBtn>
            </div>
          ) : (
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h4 className="mb-4 d-flex align-items-center">
                  <FaShoppingCart className="me-2 text-muted" />
                  Items Summary
                </h4>
                
                {items.map((item) => (
                  <div
                    key={item.cartId}
                    className="border-bottom pb-3 mb-3"
                  >
                    {/* Delivery Info */}
                    {item.deliveryDate && item.deliverySlot && (
                      <div className="alert alert-primary p-2 mb-3">
                        <small className="d-block">
                          <strong>Delivery:</strong> {new Date(item.deliveryDate).toDateString()}
                        </small>
                        <small>{item.deliverySlot.key}</small>
                      </div>
                    )}

                    {/* Item Row */}
                    <div className="d-flex flex-column flex-md-row gap-3">
                      {/* Product Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="rounded shadow-sm"
                        style={{ 
                          width: '100px', 
                          height: '100px',
                          objectFit: 'cover',
                          alignSelf: 'flex-start'
                        }}
                      />

                      {/* Product Details */}
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <h6 className="mb-1">{item.name}</h6>
                          <p className="mb-1 fw-bold">AED {item.price.toFixed(2)}</p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="d-flex align-items-center justify-content-between mt-2">
                          <div className="d-flex align-items-center border rounded">
                            <MDBBtn 
                              size="sm" 
                              color="light" 
                              className="px-3 py-1"
                              onClick={() => handleUpdateQuantity(item.cartId, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus />
                            </MDBBtn>
                            <span className="px-3">{item.quantity}</span>
                            <MDBBtn 
                              size="sm" 
                              color="light" 
                              className="px-3 py-1"
                              onClick={() => handleUpdateQuantity(item.cartId, 1)}
                            >
                              <FaPlus />
                            </MDBBtn>
                          </div>
                          <MDBBtn 
                            size="sm" 
                            color="danger" 
                            className="px-3"
                            onClick={() => removeItem(item.cartId)}
                          >
                            <FaTrash />
                          </MDBBtn>
                        </div>

                        {/* Accessories */}
                        {item.accessories?.length > 0 && (
                          <div className="mt-2">
                            <small className="text-muted">Includes:</small>
                            {item.accessories.map(acc => (
                              <div key={acc._id} className="ms-2">
                                <small>- {acc.name} (x{acc.quantity})</small>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Address Form */}
                    <div className="mt-3">
                      <AddressForm />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
            <div className="card-body">
              <h4 className="mb-3">Order Summary</h4>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>AED {totalPrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Shipping</span>
                  <span className="text-success">FREE</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total</span>
                  <span>AED {totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {items.length > 0 && (
                <>
                  <MDBBtn 
                    color="dark" 
                    className="w-100 py-2 mb-2"
                    onClick={() => router.push('/checkout')}
                  >
                    Proceed to Checkout
                  </MDBBtn>
                  <MDBBtn 
                    color="light" 
                    className="w-100 py-2"
                    onClick={() => router.push('/')}
                  >
                    Continue Shopping
                  </MDBBtn>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartScreen