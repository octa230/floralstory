'use client'
import { useEffect, useState } from "react";
import Carousel from "./components/Carousel";
import axios from "axios";
import Product from "./components/Product";
import { URL } from "./constants";

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
    <div>
      <Carousel/>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {products.map((product)=> <Product product={product} key={product._id}/>)}
      </div>
    </div>
    );
}
