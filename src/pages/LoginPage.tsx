import '../css/Authentication.css'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { FaUserCircle } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { Button } from '@mui/material';
import { useFormik } from 'formik';
import { registerPageSchema } from '../schemas/RegisterPageSchema';
import '../css/LoginPage.css'
import loginPageService from '../services/LoginPageService';
import { useDispatch } from 'react-redux';
import { setCurrentUser, setLoading } from '../redux/appSlice';
import { UserType } from '../types/Types';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface CheckUserType{
  result: boolean,
  currentUser: UserType | null
}

function LoginPage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegisterNavigation = () => { navigate("/register"); };
  

  const checkUser = (userList:UserType[], username:string, password:string):CheckUserType => {
    const response: CheckUserType = { result:false, currentUser:null}

    userList.forEach((user:UserType) => {
      if (user.username === username && user.password === password) {
        response.result=true;
        response.currentUser=user;
      }
    });
    return response;
  }

  const submit = async (values:any, action:any) => {
    try{
      dispatch(setLoading(true));
      const response: UserType[] = await loginPageService.login();
      if (response) {
        const checkUserResponse:CheckUserType = checkUser(response,values.username,values.password);
        if (checkUserResponse.result && checkUserResponse.currentUser) {
          dispatch(setCurrentUser(checkUserResponse.currentUser));
          localStorage.setItem("currentUser", JSON.stringify(checkUserResponse.currentUser));
          navigate("/");
        }else{
          toast.error("Kullanıcı adı veya şifre hatalı!")
        }
      }
    } catch(error){
      toast.error("Giriş yapılırken hata oluştu: "+error)
    } finally{
      dispatch(setLoading(false));
    }
  }
  const {values, handleSubmit, handleChange, errors, resetForm} = useFormik({
      initialValues: {
        username: '',
        password: ''
      },
      onSubmit: submit,
      validationSchema:registerPageSchema
    });
  
    const clear = () => {
      resetForm()
    }

  return (
    <div className="authentication-page">
      <div className='main'>
        <form onSubmit={handleSubmit}>
          <div className='form-div'>
          <TextField className="form-field"
          id="username"
          label='Kullanıcı Adı'
          value={values.username}
          onChange={handleChange}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <FaUserCircle />
                </InputAdornment>
              ),
            },
          }}
        variant="standard"
        helperText={errors.username && <span className='error-text'>{errors.username}</span>}
        />
        <TextField className='form-field'
          id="password"
          type='password'
          label='Şifre'
          value={values.password}
          onChange={handleChange}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <RiLockPasswordFill />
                </InputAdornment>
              ),
            },
          }}
          variant="standard"
          helperText={errors.password && <span className='error-text'>{errors.password}</span>}
        />
        <div className='button-group'>
        <Button
       type='submit' 
       size='large'
       className='submit-button'
       variant='contained'>Giriş Yap</Button>
        <Button onClick={clear} 
       size='large' 
       className="clear-button"
       variant='contained'>Temizle</Button>
       <Button
       onClick={handleRegisterNavigation} 
       type='button'
       size='large' 
       className='register-button' 
       variant='contained'>Kaydol </Button>
        </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
