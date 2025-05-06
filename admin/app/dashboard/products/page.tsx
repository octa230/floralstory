'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container,
  Button,
  Card,
  ListGroup,
  Modal,
  Badge,
  Stack,
  Alert,
  Form,
  Offcanvas,
  Spinner
} from 'react-bootstrap';
import axios from 'axios'
import { URL } from '@/constants';
import { Category, CategoryRelationship, NavigationItem, ProductProps } from '@/types';


const ManageProducts = () => {
    const [loading, setLoading] = useState(false)
    const [products, setProducts]= useState<ProductProps[]>([])
    const [showCanvas, setShowCanvas] = useState<boolean>(false)
    const [loadingImage, setLoadingImage] = useState<boolean>(false)
    const [product, setProduct] = useState<ProductProps|null>( null)
    const [categories, setCategories] = useState<Category[]>([])
    const [formData, setFormData ] = useState({
        name:"",
        brand:"",
        productType: '',
        price: 0,
        image: "",
        images: [],
        inStock: 0,
        category: "",

    })

    const handleInputChange=(field: string, value: string | number)=>{
        setFormData(prevState => ({...prevState, [field]: value}))
    }

    const setProductType=(pdctType: string)=>{
        setFormData((prevState => ({...prevState, productType:  pdctType})))
    }

    const handleSelectProduct=async(productId: string)=> {
        setLoading(true)
        const {data} = await axios.get<ProductProps>(`${URL}/products/${productId}`)
        setFormData({
            name: data.name,
            brand: data.brand,
            price: data.price,
            image: data.image,
            images: data.images,
            inStock: data.inStock,
        })
        setShowCanvas(true)
        setProduct(data)
        setLoading(false)
    }

    const handleSubmit: React.FormEventHandler =async(e)=>{
        e.preventDefault()
        if(product && product._id){
            console.log('put request', formData)
            const {data} = await axios.put(`${URL}/products/${product._id}`, formData)
            console.log(data)
        }else{
            console.log(formData)
            const {data} = await axios.post(`${URL}/products`, formData)
            console.log(data)

        }
    }

    const getProducts = async()=>{
        const [prodctsData, categoriesData ]= await Promise.all([
            axios.get(`${URL}/products/`),
            axios.get(`${URL}/categories/`)
        ]) 
        setProducts(prodctsData.data)
        setCategories(categoriesData.data)
        
    }

    const handleImageUpload = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return;
    
        try {
          setLoadingImage(true)
          const formData = new FormData();
          formData.append('image', files[0]);
    
          const {data} = await axios.post<string>(`${URL}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
    
          setFormData(prev => ({ ...prev, image: data}));
          setLoadingImage(false)
        } catch (error) {
          console.error('Upload failed:', error);
        }finally{
          setLoadingImage(false)
        }
      }, []);
    
    
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleImageUpload(e.target.files);
        //e.target.value = ''; 
      };
    
    useEffect(()=>{
        getProducts()
    }, [])
  return (
    <Container>
    <Card className='mb-4'>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className='mb-0'>Products</h5>
        <Badge className='secondary' pill>{products.length}(items)</Badge>
        <Badge className='secondary bg-danger p-2' onClick={()=> setShowCanvas(true)}>create Product</Badge>
      </Card.Header>
        {loading ? (
            <div>Loading Products...</div>
        ):(
            <ListGroup variant='flush'>
                {products.map(product => (
                    <ListGroup.Item key={product._id}>
                        <div className='d-flex justify-content-between align-items-center'>
                            <div>
                                <h6 className='mb-1'>{product.name}: {product.price}</h6>
                                <small className='text-muted'>SLUG: {product.slug} • SKU: {product.sku} • Stock: {product.inStock}</small>
                            </div>
                            <Stack direction='horizontal' gap={2}>
                                <Button className='sm' variant='outline-success' onClick={()=> handleSelectProduct(product._id)}>edit x</Button>
                                <Button className='sm' variant='outline-danger'>delete x</Button>
                                <Button className='sm' variant='outline-warning text-dark'>action x</Button>
                            </Stack>
                        </div>

                    </ListGroup.Item>
                )
            )}
            </ListGroup>
        )}
    </Card>

    <Offcanvas show={showCanvas} onHide={()=> setShowCanvas(false)}>
        <Offcanvas.Header closeButton>
            <Offcanvas.Title>Create/Edit Product</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            Some text as placeholder. In real life you can have the elements you
            have chosen. Like, text, images, lists, etc.
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>product Name</Form.Label>
                    <Form.Control type='text'
                        onChange={(e)=> handleInputChange("name", e.target.value)}
                        value={formData.name}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Price</Form.Label>
                    <Form.Control type='number'
                        onChange={(e)=> handleInputChange('price', e.target.value)}
                        value={formData.price}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>InStock</Form.Label>
                    <Form.Control type='number'
                        onChange={(e)=> handleInputChange('inStock', e.target.value)}
                        value={formData.inStock}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Brand</Form.Label>
                    <Form.Control type='text'
                        onChange={(e)=> handleInputChange('brand', e.target.value)}
                        value={formData.brand}
                    />
                </Form.Group>
                <div className='m-2'>
                {['product', 'accessory', 'collection', 'combo'].map((productType, index)=>(
                    <Button className='p-2' 
                    variant={ formData.productType === productType ? "primary" : 'btn-outline-primary'} 
                    key={index}
                    onClick={()=> setProductType(productType)}
                    >
                        {productType}
                    </Button>
                ))}
                </div>
                <Form.Group>
                    <Form.Label>Category</Form.Label>
                    <Form.Select onChange={(e)=> handleInputChange('category', e.target.value)}>
                        <option>--choose--</option>
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>{category.canonicalName}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                //required
              />
              {loadingImage ? (
                <Spinner animation='grow'/>
              ): formData.image && (
                <div className="mt-2">
                  <img
                    src={formData?.image}
                    alt="Preview"
                    style={{ maxHeight: '200px' }}
                  />
                </div>
              )}
            </Form.Group>
                <Button className='my-1' type='submit'>SAVE</Button>
            </Form>
        </Offcanvas.Body>
    </Offcanvas>
    </Container>
  )
}

export default ManageProducts
