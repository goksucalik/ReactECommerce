import React from 'react'
import '../css/Authentication.css'
import '../css/RegisterPage.css'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { FaUserCircle } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { Button } from '@mui/material';
import { useFormik } from 'formik';
import { UserType } from '../types/Types';
import { registerPageSchema } from '../schemas/RegisterPageSchema';
import registerPageService from '../services/RegisterPageService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


function RegisterPage() {

  const navigate = useNavigate();

  const submit = async (values:any, actions: any) => {
    try{
      const payload: UserType = {
        id:String(Math.floor(Math.random()*999999)),
        username: values.username,
        password: values.password,
        balance:1000
      }
      const response = await registerPageService.register(payload)
      if (response) {
        clear();
        toast.success("Kullanıcı başarıyla kaydedildi.");
        navigate("/login");
      }
    }catch (error) {
      toast.error("Kullanıcı kaydedilirken hata oluştu");
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
          <TextField
          className="form-field"
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
        helperText={errors.username && <span className="error-text">{errors.username}</span>}
        />
        <TextField
          className='form-field'
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
          helperText={errors.password && <span className="error-text">{errors.password}</span>}
        />
        <div className='button-group'>
        <Button
       type='submit' 
       size='large' 
       className='submit-button' 
       variant='contained'>Kaydol</Button>
        <Button onClick={clear} 
       size='large' 
       className="clear-button" 
       variant='contained' 
       color='info'>Temizle</Button>
        </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
