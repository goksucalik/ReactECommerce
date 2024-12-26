import '../css/ProductDetail.css'
import { Container } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom'
import { setLoading } from '../redux/appSlice';
import { toast } from 'react-toastify';
import productService from '../services/ProductService';
import { ProductType } from '../types/Types';
import { Button } from '@mui/material';
import { addProductToBasket } from '../redux/basketSlice';

function ProductDetail() {

const {productId} = useParams();
const dispatch = useDispatch();

const [count,setCount] = useState<number>(0);

const[product,setProduct] = useState<ProductType | null>();

const getProductById = async(productId:number) => {
    try {
        dispatch(setLoading(true))
        const product:ProductType = await productService.getProductById(productId);
        setProduct(product);
    } catch (error) {
        toast.error("Ürün getirilirken bir hata oluştu: " + error)
    }
    finally{
        dispatch(setLoading(false))
    }
}

const addBasket = () => {
    if (product) {
        const payload:ProductType = {
            ...product,
            count:count
        }
        dispatch(addProductToBasket(payload))
        toast.success("Ürün sepete eklendi.");
    }
}

useEffect(() => {
    getProductById(Number(productId));
},[])

  return (
    <Container maxWidth="lg">
            {product && <>
                <div className='product-detail'>
                    <div className='product-detail-image'>
                        <img src={product.image} alt="" />
                    </div>
                    <div className="product-detail-info">
                        <div className="product-title">{product.title}</div>
                        <div className="product-description">{product.description}</div>
                        <div className="product-price">{product.price}₺</div>
                        <div className='product-quantity'>
                            <span onClick={() => setCount(count>0 ? count-1 : 0)} className="quantity-button"> - </span>
                            <span className="quantity-display">{count}</span>
                            <span onClick={() => setCount(count+1)} className="quantity-button"> + </span>
                        </div>

                        <div>
                            <Button onClick={addBasket} color='info' variant='contained' size='small'className="add-basket-button">Sepete Ekle</Button>
                        </div>

                    </div>
                </div>

            </>}
        </Container>
    )
}

export default ProductDetail
