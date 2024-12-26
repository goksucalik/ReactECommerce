import * as React from 'react';
import { ProductType } from '../types/Types'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import '../css/components-css/ProductCard.css'

interface ProductCardProps{
    product:ProductType
}

function ProductCard(props:ProductCardProps) {
    const {id, title, price, description, category, image, rate} = props.product;

    const navigate = useNavigate();

    return (
        <Card className="product-card">
        <img src={image} className="product-card-image" alt="Product"/>
        <CardContent className="product-card-content">
          <Typography gutterBottom variant="h5" component="div">
            {title.substring(0,70)}
          </Typography>
          <Typography variant="body2" className="product-card-description">
            {description.substring(0,200)}...
          </Typography>
        </CardContent>
        <div className="product-card-price">
          <h2 style={{fontFamily:'arial'}}>{price}₺</h2>
        </div>
        <CardActions className="product-card-actions">
          <Button onClick={() => navigate("/product-detail/" + id)} size="small" variant="outlined" color="info">Detay</Button>
        </CardActions>
      </Card>
  )
}

export default ProductCard
