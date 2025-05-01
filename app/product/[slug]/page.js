'use client'

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { URL } from '../../constants'
import axios from 'axios'
import { MDBCardText, MDBBtn, MDBRange, MDBTooltip, MDBAccordion, MDBAccordionItem, MDBInput } from 'mdb-react-ui-kit'
import TimeSlotSelector from '../../components/TimeSlots'
import { getCartItems, useCartStore, useOrderDetails } from '../../../Store'
import { useRouter } from 'next/navigation'
import Accessory from '../../components/Accessory'

const ProductScreen = () => {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [zoomable, setZoomable] = useState(false)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0, mouseX: 0, mouseY: 0 })
  const [quantity, setQuantity] = useState(1)
  
  
  //const [showAccessoriesModal, setShowAccessoriesModal] = useState(false)
  //const [selectedAccessories, setSelectedAccessories] = useState([])
  //const [accessoryQuantities, setAccessoryQuantities] = useState({});

  const [showAccessoriesModal, setShowAccessoriesModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [accessoryQuantities, setAccessoryQuantities] = useState({});

  

  const MAGNIFIER_SIZE = 150
  const ZOOM_LEVEL = 2

  const { date, slot, city } = useOrderDetails()
  const { addItem } = useCartStore()
  const router = useRouter()

  // Sample accessories data - consider moving to API or props
  const accessories = [
    { _id: 'acc1', name: 'book', price: 10, inStock: 3, image: "https://www.floralshopuae.com/wp-content/uploads/2025/02/red-rose-bouquet-delivery-uae-300x300.jpg" },
    { _id: 'acc2', name: 'balloon', price: 10, inStock: 3, image: "https://www.floralshopuae.com/wp-content/uploads/2025/02/red-rose-bouquet-delivery-uae-300x300.jpg" },
    { _id: 'acc3', name: 'socks', price: 10, inStock: 3, image: "https://www.floralshopuae.com/wp-content/uploads/2025/02/red-rose-bouquet-delivery-uae-300x300.jpg" },
    { _id: 'acc4', name: 'bear', price: 10, inStock: 3, image: "https://www.floralshopuae.com/wp-content/uploads/2025/02/red-rose-bouquet-delivery-uae-300x300.jpg" },
  ]

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

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value)
    setQuantity(Math.max(1, Math.min(newQuantity, product?.inStock || 1)))
  }

  const handleInputChange = (e) => {
    let newQuantity = parseInt(e.target.value) || 1
    newQuantity = Math.max(1, Math.min(newQuantity, product?.inStock || 1))
    setQuantity(newQuantity)
  }

  const handleAccessoryQuantityChange = (accessoryId, newQuantity) => {
    setAccessoryQuantities(prev => ({
      ...prev,
      [accessoryId]: newQuantity
    }));
  };



  const handleAddToCart = () => {
    if (!product || product.inStock <= 0) return;
    
    // First show accessories selection modal if not shown yet
    if (!showAccessoriesModal && accessories.length > 0) {
      setShowAccessoriesModal(true);
      return;
    }
    
    // Prepare the item with selected accessories
    const selectedAccessories = accessories
    .filter(acc => accessoryQuantities[acc._id] > 0)
    .map(acc => ({
      ...acc,
      quantity: accessoryQuantities[acc._id]
    }));

  addItem({
    ...product,
    quantity,
    deliveryDate: date,
    city: city,
    deliverySlot: slot,
    accessories: selectedAccessories
  }); 

    // Add to cart
    //addItem(cartItem);
    
    // Show confirmation before redirecting
    setShowAccessoriesModal(false);
    setShowConfirmationModal(true);
  };


  const handleBuyNow = () => {
    if (!product) return;
    
    // First show accessories selection modal if not shown yet
    if (!showAccessoriesModal && accessories.length > 0) {
      setShowAccessoriesModal(true);
      return;
    }
    
    // Prepare the item with selected accessories
    const selectedAccessories = accessories
    .filter(acc => accessoryQuantities[acc._id] > 0)
    .map(acc => ({
      ...acc,
      quantity: accessoryQuantities[acc._id]
    }));

  addItem({
    ...product,
    quantity,
    deliveryDate: date,
    city: city,
    deliverySlot: slot,
    accessories: selectedAccessories
  }); 

    // Add to cart
    //addItem(cartItem);
    
    // Show confirmation before redirecting
    setShowAccessoriesModal(false);
    setShowConfirmationModal(true);
  };

  const handleConfirm = () => {
    setShowConfirmationModal(false);
    router.push('/cart');
  };

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
        {/* Image Column */}
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

        {/* Product Details Column */}
        <div className="col-lg-4 col-md-6">
          <div className="card h-100 p-3 shadow-2-strong">
            <h1 className="h2 mb-3">{product.name}</h1>
            <hr className="my-2" />
            <p className="h3 text-primary mb-3">
              <sup className="fs-6">AED</sup> {product.price}
            </p>
            
            <MDBAccordion initialActive={1} className="mb-4">
              <MDBAccordionItem collapseId={1} headerTitle="SELECT DETAILS">
                <TimeSlotSelector />
              </MDBAccordionItem>
            </MDBAccordion>
          </div>
        </div>


        {/* Action Column */}
        <div className="col-lg-3 col-md-12 mt-md-0 mt-3">
          <div className="card p-3 shadow-2-strong sticky-top" style={{ top: '20px' }}>
            <div className="quantity-selector mb-2">
              <MDBBtn color={product.inStock ? 'success' : "danger"} ripple="true" className="w-100 shadow-0">
                <i className="fas fa-circle-info me-2"></i> 
                {product.inStock ? 'AVAILABLE' : "OUT OF STOCK"}
              </MDBBtn>
            </div>
            
            {date && (
              <div className="my-4 p-3 rounded alert-primary">
                <h5>Summary</h5>
                <p className="mb-0">
                  {city} delivery <br/> 
                  On {new Date(date).toDateString()} <br/>
                  {slot?.key} ({slot?.time})<br/>
                  {slot.price}-aed
                </p>
              </div>
            )}
            
          <MDBBtn
              disabled={!slot || !date || !product.inStock} 
                onClick={handleAddToCart}
                color="dark" 
                ripple="true" 
                rippleColor="light" 
                className="w-100 mb-2 py-2 shadow-0"
            >
            {showAccessoriesModal ? 'CONFIRM SELECTION' : 'ADD TO BASKET'}
            </MDBBtn>
            <MDBBtn data-mdb-modal-init data-mdb-target="#accessories-modal"
              disabled={!slot || !date || !product.inStock}
              color="primary" 
              ripple="true" 
              className="w-100 mb-3 py-2 shadow-0"
              onClick={handleBuyNow}
            >
              BUY NOW
            </MDBBtn>
            
            <MDBTooltip
              tag="a" wrapperProps={{ href: '#' }} title="Add to wishlist">
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

      {/* Accessories Modal */}
      <div className="container container-fluid mt-4">
      {/* ... existing product display code ... */}

      {/* Accessories Selection Modal */}
      {showAccessoriesModal && (
        <div className='modal' style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className='modal-dialog modal-lg'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Select Accessories</h5>
                <button type="button" className="btn-close" onClick={() => setShowAccessoriesModal(false)}></button>
              </div>
              <div className='modal-body'>
                <div className='row'>
                  {accessories.map((accessory) => (
                    <div key={accessory._id} className='col-md-6 mb-3'>
                      <Accessory 
                        accessory={accessory}
                        onQuantityChange={handleAccessoryQuantityChange}
                        initialQuantity={accessoryQuantities[accessory._id] || 0}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className='modal-footer'>
                <MDBBtn color='secondary' onClick={() => setShowAccessoriesModal(false)}>
                  Cancel
                </MDBBtn>
                <MDBBtn 
                  color='primary' 
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </MDBBtn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className='modal' style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Added to Cart</h5>
              </div>
              <div className='modal-body'>
                <p>Your items have been added to the cart!</p>
                <div className="d-flex gap-2">
                  <MDBBtn color='light' onClick={() => setShowConfirmationModal(false)}>
                    Continue Shopping
                  </MDBBtn>
                  <MDBBtn color='primary' onClick={handleConfirm}>
                    View Cart
                  </MDBBtn>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
      <MDBCardText className='text-muted mb-2 text-truncate' style={{ maxHeight: '3.6em' }}>
        {product.description}
      </MDBCardText>
    </div>
  )
}

export default ProductScreen