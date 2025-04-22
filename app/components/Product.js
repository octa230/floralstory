import Link from 'next/link'
import React from 'react'
import { 
  MDBCard, 
  MDBCardBody, 
  MDBCardTitle, 
  MDBCardText, 
  MDBCardImage, 
  MDBRow, 
  MDBCol,
  MDBBadge,
  MDBIcon 
} from 'mdb-react-ui-kit'

const ProductCard = ({ product }) => {
  return (
    <MDBCard className='mb-4 shadow-sm hover-shadow' style={{ maxWidth: '540px' }}>
      <Link href={`/product/${product.slug}`} passHref legacyBehavior>
        <MDBRow className='g-0 align-items-center' tag="a">
          <MDBCol md='4' className='p-2'>
            <MDBCardImage
              src={product.image}
              alt={product.name}
              fluid
              className='rounded-3'
              style={{ height: '180px', objectFit: 'cover' }}
            />
          </MDBCol>
          
          <MDBCol md='8'>
            <MDBCardBody>
              <MDBCardTitle className='fw-bold'>{product.name}</MDBCardTitle>
              
              <div className='d-flex justify-content-between align-items-center'>
                <div>
                  <span className='h5 text-primary'>AED {product.price}</span>
                  {product.inStock > 0 ? (
                    <MDBBadge pill color='success' className='ms-2'>
                      <MDBIcon icon='check' className='me-1' /> In Stock
                    </MDBBadge>
                  ) : (
                    <MDBBadge pill color='danger' className='ms-2'>
                      <MDBIcon icon='times' className='me-1' /> Out of Stock
                    </MDBBadge>
                  )}
                </div>
                
                <div className='text-muted small'>
                  <MDBIcon icon='box' className='me-1' /> 
                  {product.inStock || 0} available
                </div>
              </div>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </Link>
    </MDBCard>
  )
}

export default ProductCard