import Drawer from '@mui/material/Drawer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setDrawer, updateBalance } from '../redux/appSlice';
import { ProductType, UserType } from '../types/Types';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import { calculateBasket, removeProductFromBasket, setBasket } from '../redux/basketSlice';
import { toast } from 'react-toastify';
import '../css/components-css/BasketDetails.css'


function BasketDetails() {

    const {drawer, currentUser} = useSelector((state:RootState) => state.app);
    const {basket, totalAmount} = useSelector((state:RootState) => state.basket);

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(calculateBasket());
    },[basket])

    const closeDrawer = () => {
        dispatch(setDrawer(false));
    }

    const removeProduct = (productId:number) => {
        dispatch(removeProductFromBasket(productId))
    }

    const buy = () => {
        if (currentUser?.balance && currentUser.balance < totalAmount) {
            toast.warning("Bakiyeniz yeterli değildir!")
            return;
        }
        if (currentUser?.balance) {
            const remaningTotal = currentUser.balance - totalAmount;

            const payload: UserType = {
                ...currentUser,
                balance: remaningTotal
            }
            dispatch(updateBalance(payload));
            dispatch(setBasket([]));
            localStorage.removeItem("basket");
            toast.success("Ürünler satın alınmıştır.");
        }
    }

  return (
    <Drawer open={drawer} anchor='right' sx={{width:'400px'}} onClose={closeDrawer}>
        {
           basket && basket.map((product: ProductType) => (
                <>
                    <div className="basket-item">
                        <div className="basket-item-image"><img src={product.image} alt="" /></div>
                        <div className="basket-item-details">
                            <div className="basket-item-title">{product.title.substring(0, 30)}</div>
                            <div className='basket-item-description'>{product.description.substring(0, 40)}</div>
                        </div>
                        <div className="basket-item-count">{product.count}</div>
                        <div className="basket-item-price">{product.price}₺</div>
                        <div className="basket-item-remove">
                            <Button onClick={() => removeProduct(product.id)} size='small' className="remove-button" variant='outlined'>Çıkar</Button></div>
                    </div>
                    
                </>
            ))
        }
        <div className="basket-total">
            <div className="total-amount">Toplam Tutar:{totalAmount}</div>
            <div>
                <Button onClick={buy} className="buy-button" size='small' variant='contained' color='success'>Satın Al</Button></div>
        </div>
      </Drawer>
  )
}

export default BasketDetails
