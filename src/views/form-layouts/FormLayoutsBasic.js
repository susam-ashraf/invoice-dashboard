// ** React Imports
import { useState } from 'react'
import Router, { useRouter } from 'next/router'

import { BASE_URL } from '../../../env'
import Cookies from 'js-cookie'
import axios from 'axios'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

const FormLayoutsBasic = () => {
  // ** States
  const [values, setValues] = useState({
    password: '',
    showPassword: false,
    name: '',
    email: '',
    phone: ''
  })

  const [confirmPassValues, setConfirmPassValues] = useState({
    password: '',
    showPassword: false
  })

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleConfirmPassChange = prop => event => {
    setConfirmPassValues({ ...confirmPassValues, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleClickConfirmPassShow = () => {
    setConfirmPassValues({ ...confirmPassValues, showPassword: !confirmPassValues.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const submitRegister = e => {
    e.preventDefault()

    // if(!errors['email'] && !errors['password']) {
    const submitData = {
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone
    }

    return (
      axios({
        url: `${BASE_URL}/api/register`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: submitData,
        method: 'post'
      })
        .then(response => {
          // console.log('token print----- : ', response.data)
          // setLoginResponse(response.data)
          // localStorage.setItem('token', response.data.token);
          if (response?.data?.status === 'success') {
            console.log('------rehister Succ-----')
            return Router.push('/users/')
          }
        })
        // .then((json) => ({
        //   type: 'SUCCESS',
        //   payload: json,
        // }))
        .catch(err => {
          // if (getToken() && err && err.response && err.response.status === 401) {
          //   logOut()
          // } else {
          //   return {
          //     type: 'FAIL',
          //   }
          // }
          console.log('token print error ----- : ', err)
        })
    )
    // }
  }

  return (
    <Card>
      <CardHeader title='Register User' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={submitRegister}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Name'
                name='name'
                onChange={handleChange('name')}
                placeholder='Leonard Carter'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='email'
                label='Email'
                name='email'
                onChange={handleChange('email')}
                placeholder='carterleonard@gmail.com'
                helperText='You can use letters, numbers & periods'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Phone'
                name='phone'
                onChange={handleChange('phone')}
                placeholder='+98827878987'
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor='form-layouts-basic-password'>Password</InputLabel>
                <OutlinedInput
                  label='Password'
                  value={values.password}
                  id='form-layouts-basic-password'
                  name='password'
                  onChange={handleChange('password')}
                  type={values.showPassword ? 'text' : 'password'}
                  aria-describedby='form-layouts-basic-password-helper'
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle password visibility'
                      >
                        {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText id='form-layouts-basic-password-helper'>
                  Use 8 or more characters with a mix of letters, numbers & symbols
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor='form-layouts-confirm-password'>Confirm Password</InputLabel>
                <OutlinedInput
                  label='Confirm Password'
                  value={confirmPassValues.password}
                  id='form-layouts-confirm-password'
                  onChange={handleConfirmPassChange('password')}
                  aria-describedby='form-layouts-confirm-password-helper'
                  type={confirmPassValues.showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickConfirmPassShow}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle password visibility'
                      >
                        {confirmPassValues.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText id='form-layouts-confirm-password-helper'>
                  Make sure to type the same password as above
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  gap: 5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Button type='submit' variant='contained' size='large'>
                  Register User
                </Button>
                {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 2 }}>Already have an account?</Typography>
                  <Link href='/' onClick={e => e.preventDefault()}>
                    Log in
                  </Link>
                </Box> */}
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormLayoutsBasic
