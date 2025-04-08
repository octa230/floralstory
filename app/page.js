'use client'


import { useEffect, useState } from "react";
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import axios from "axios";
import Product from "./components/Product";
import { URL } from "./constants";
import HomeGrid from "./components/HomeGrid";

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(()=>{
    const getData = async()=>{
      const {data} = await axios.get(`${URL}/products`)
      setProducts(data)
    }
    getData()
  },[])
  
  return (
    <MDBContainer fluid className="mt-4 px-lg-5">
      {/* Carousel Section */}
      <div className="mb-5">
        <HomeGrid />
      </div>

      {/* Product Grid Section */}
      <MDBRow className="g-4">
        {products.map((product) => (
          <MDBCol 
            key={product.slug}
            lg="4" 
            md="6" 
            sm="6" 
            xs="12"
            className="mb-4"
          >
            <Product product={product} />
          </MDBCol>
        ))}
      </MDBRow>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-5">
          <h4 className="text-muted">No products available</h4>
          <p>Please check back later</p>
        </div>
      )}
    </MDBContainer>
    );
}
