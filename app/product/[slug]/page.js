'use client'

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { URL } from '../../constants'
import axios from 'axios'
import { MDBBtn, MDBRange, MDBTooltip, MDBAccordion, MDBAccordionItem } from 'mdb-react-ui-kit'
import TimeSlotSelector from '@/app/components/TimeSlots'




const ProductScreen = () => {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [zoomable, setZoomable] = useState(false)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0, mouseX: 0, mouseY: 0 })

  const MAGNIFIER_SIZE = 150
  const ZOOM_LEVEL = 2

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await axios.get(`${URL}/products/${slug}`)
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    if (slug) getProduct()
  }, [slug])

  const handleMouseEnter = (e) => {
    const { width, height } = e.currentTarget.getBoundingClientRect()
    setImageSize({ width, height })
    setZoomable(true)
    updatePosition(e)
  }

  const handleMouseLeave = () => setZoomable(false)
  
  const handleMouseMove = (e) => updatePosition(e)

  const updatePosition = (e) => {
    const { left, top } = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - left
    const y = e.clientY - top
    
    setPosition({
      x: -x * ZOOM_LEVEL + (MAGNIFIER_SIZE / 2),
      y: -y * ZOOM_LEVEL + (MAGNIFIER_SIZE / 2),
      mouseX: x - (MAGNIFIER_SIZE / 2),
      mouseY: y - (MAGNIFIER_SIZE / 2),
    })
  }

  if (loading) return <div className="text-center py-5"><div className="spinner-border"></div></div>
  if (!product) return <div className="alert alert-danger">Product not found</div>

  return (
    <div className="container container-fluid mt-4">
      <div className="row gx-4">
        {/* Image Column (40% width) */}
        <div className="col-lg-5 col-md-6 position-relative" style={{ minHeight: '600px' }}>
          <div 
            className="h-100 w-100 position-relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            <img 
              src={product.image} 
              className="img-fluid rounded shadow-4"
              style={{ 
                height: '600px', 
                width: '100%', 
                objectFit: 'cover',
                cursor: zoomable ? 'none' : 'auto'
              }}
              alt={product.name}
            />
            
            {zoomable && (
              <div
                className="position-absolute rounded-circle shadow-4 border border-3 border-light"
                style={{
                  backgroundPosition: `${position.x}px ${position.y}px`,
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: `${imageSize.width * ZOOM_LEVEL}px ${imageSize.height * ZOOM_LEVEL}px`,
                  backgroundRepeat: 'no-repeat',
                  top: `${position.mouseY}px`,
                  left: `${position.mouseX}px`,
                  width: `${MAGNIFIER_SIZE}px`,
                  height: `${MAGNIFIER_SIZE}px`,
                  pointerEvents: 'none',
                  zIndex: 100,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            )}
          </div>
        </div>

        {/* Product Details Column (35% width) */}
        <div className="col-lg-4 col-md-6">
          <div className="card h-100 p-3 shadow-2-strong">
            <h1 className="h2 mb-3">{product.name}</h1>
            <hr className="my-2" />
            <p className="h3 text-primary mb-3">
              <sup className="fs-6">AED</sup> {product.price}
            </p>
            {/* Delivery Time Selector - Collapsible */}
            <MDBAccordion initialActive={0} className="mb-4">
              <MDBAccordionItem collapseId={1} headerTitle="Select Delivery Time">
                <div className="p-2">
                  <TimeSlotSelector />
                </div>
              </MDBAccordionItem>
            </MDBAccordion>
            
            <div className="mb-3">
              <p className="text-muted">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Action Column (25% width) */}
        <div className="col-lg-3 col-md-12 mt-md-0 mt-3">
          <div className="card p-3 shadow-2-strong sticky-top" style={{ top: '20px' }}>
            <div className="mb-3">
              <label htmlFor="quantityRange" className="form-label">Quantity</label>
              <MDBRange 
                defaultValue="1" 
                min="1" 
                max={product.inStock} 
                id="quantityRange" 
              />
              <div className="text-center mt-1">
                <small className="text-muted">Available: {product.inStock}</small>
              </div>
            </div>
            
            <MDBBtn color="dark" ripple="true" rippleColor="light" className="w-100 mb-2 py-2">
              ADD TO BASKET
            </MDBBtn>
            <MDBBtn color="primary" ripple="true" className="w-100 mb-3 py-2">
              BUY NOW
            </MDBBtn>
            
            <MDBTooltip tag="a" wrapperProps={{ href: '#' }} title="Add to wishlist">
              <MDBBtn color="light" ripple="true" className="w-100 mb-2">
                <i className="far fa-heart me-2"></i> WISHLIST
              </MDBBtn>
            </MDBTooltip>
            
            <div className="text-center small mt-2">
              <span className="text-muted">Free returns • Secure payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductScreen