import Link from 'next/link'
import React from 'react'

const Product = (props) => {
    const {product} = props
  return (
    <div className='card py-3' style={{maxWidth: "540px"}}>
        <Link href={`/product/${product.slug}`} passHref>
        <div className='row g-0'>
            <div className='col-md-4 col-sm-12'>
                <img src={product.image} className='img-fluid rounded-start' alt={product.slug}/>
            </div>
            <div className='col-md-8'>
            <div className='card-body'>
                <h5 className='card-title'>{product.name}</h5>
                <p className='card-text'>
                    {product.description}
                </p>
            </div>
            <div className='card-footer'>
            <p className='text-muted'>{product.price}</p>
            <p className='text-muted'>{product.inStock || 0}</p>
        </div>
        </div>
        </div>
    </Link>
    </div>
  )
}

export default Product
