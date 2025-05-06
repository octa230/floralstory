'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from 'react-bootstrap'

const page = () => {
    const router = useRouter()
  return (
    <div>
    <div className="d-flex justify-content-between gap-3">
      <div className="border p-3 rounded flex-fill">
        <h3>Orders</h3>
        <p>Details about summary card 1.</p>
        <Button variant="primary" onClick={()=> router.push('/dashboard/orders')}>
            Go to Details
        </Button>
      </div>
      <div className="border p-3 rounded flex-fill">
        <h3>Products</h3>
        <p>Details about summary card 2.</p>
        <Button variant="primary" onClick={()=> router.push('/dashboard/products')}>
            Go to Details
        </Button>
      </div>
      <div className="border p-3 rounded flex-fill">
        <h3>Categories</h3>
        <p>Details about summary card 3.</p>
        <Button variant="primary" onClick={()=> router.push('/dashboard/categories')}>
            Go to Details
        </Button>
      </div>
    </div>
    </div>
  )
}

export default page
