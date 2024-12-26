import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Logo from '../images/logo.png'
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { useDispatch, useSelector } from 'react-redux';
import { filterProducts, setCurrentUser, setDrawer, setProducts } from '../redux/appSlice';
import { toast } from 'react-toastify';
import { ProductType } from '../types/Types';
import productService from '../services/ProductService';
import { SlBasket } from "react-icons/sl";
import Badge from '@mui/material/Badge';
import { RootState } from '../redux/store';
import '../css/components-css/Navbar.css'

export default function Navbar() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {basket} = useSelector((state:RootState)=>state.basket);

  const logout = () => {
    localStorage.removeItem("currentUser");
    dispatch(setCurrentUser(null));
    navigate("/login");
    toast.success("Çıkış yapıldı.")
  }

  const handleFilter = async(e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.value) {
        dispatch(filterProducts(e.target.value));
      }
      else{
        const products: ProductType[] = await productService.getAllProducts();
        dispatch(setProducts(products));
      }
    } catch (error) {
        toast.error("Filtreleme yaparken hata oluştu: "+error)
    }
  }

  const openDrawer = () => {
    dispatch(setDrawer(true));
  }


  return (
    <AppBar position="static" className='navbar' sx={{backgroundColor:'#4b4453'}}>
    <Toolbar>
      <IconButton
      onClick={() => navigate("/")}
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        className="navbar-icon-button"
      >
        <img src={Logo} width={60} height={60}/>
      </IconButton>
      <Typography onClick={() => navigate("/")} variant="h6" component="div" className="navbar-title">
      </Typography>
      <div className="navbar-search">
      <TextField
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilter(e)}
          className="navbar-search-input"
          id="searchInput"
          placeholder='bir şey ara...'
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                </InputAdornment>
              ),
              style:{
                color:'lightgrey',
                borderBottom:'1px solid lightgrey'
              }
            },
          }}
        variant="standard"
        />
      <Badge badgeContent={basket.length} color="warning" className="navbar-badge">
        <SlBasket onClick={openDrawer} className="navbar-basket-icon"/>
      </Badge>
      </div>
      <Button onClick={logout} className="navbar-logout-button" color="inherit">Çıkış</Button>
    </Toolbar>
  </AppBar>
  )
}

