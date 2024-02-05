// ** React Imports
import { useState, useEffect } from 'react'
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

const EditUserLayout = () => {
  const router = useRouter()

  // ** States
  const [values, setValues] = useState({
    showPassword: false
  })

  const [name, setName] = useState('')
  const [userId, setUserId] = useState()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [isResetPass, setIsResetPass] = useState(false)
  const [isValidateNumber, setIsValidateNumber] = useState(false)

  const [confirmPassValues, setConfirmPassValues] = useState({
    password: '',
    showPassword: false
  })

  useEffect(() => {
    if (router.query?.userData) {
      const userData = JSON.parse(router.query?.userData)

      console.log('userData--', userData)

      setUserId(userData.id)
      setName(userData.name)
      setEmail(userData.email)
      setPhone(userData.phone)
    } else {
      Router.push('/users/')
    }
  }, [])

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

  const handleLogout = () => {
    Cookies.remove('cToken')
    Cookies.remove('cRole')
    Cookies.remove('cName')
    Cookies.remove('cEmail')

    Router.push('/pages/login')
  }

  const submitRegister = e => {
    e.preventDefault()

    // if(!errors['email'] && !errors['password']) {
    const submitData = {
      name: name,
      email: email,
      password: password,
      phone: phone
    }

    return (
      axios({
        url: `${BASE_URL}/api/update-user/${userId}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('cToken')}`
        },
        data: submitData,
        method: 'put'
      })
        .then(response => {
          console.log('update print----- : ', response.data)
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
          console.log('token print error ----- : ', err.response.data)
          if (err.response.data?.message === 'Unauthenticated.') {
            handleLogout()
          }
        })
    )
    // }
  }

  const checkPasswordValidity = value => {
    const isContainsNumber = /^(?=.*[0-9]).*$/
    if (!isContainsNumber.test(value)) {
      // return 'Password must contain at least one Digit.';
      setIsValidateNumber(false)
    } else {
      setIsValidateNumber(true)
    }
  }

  return (
    <Card>
      <CardHeader title='Edit user data' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={submitRegister}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Name'
                name='name'
                value={name}
                onChange={event => {
                  setName(event.target.value)
                }}
                // placeholder='Leonard Carter'
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='email'
                label='Email'
                name='email'
                value={email}
                onChange={event => {
                  setEmail(event.target.value)
                }}
                // placeholder='carterleonard@gmail.com'
                helperText='You can use letters, numbers & periods'
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Phone'
                name='phone'
                value={phone}
                onChange={event => {
                  setPhone(event.target.value)
                }}
                // placeholder='+98827878987'
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Button
              onClick={() => {
                setIsResetPass(true)
              }}
              sx={{ background: '#EB4C3F', marginTop: '20px', marginLeft: '20px' }}
              type='button'
              variant='contained'
              size='large'
            >
              Reset Password
            </Button>
            {isResetPass && (
              <>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor='form-layouts-basic-password'>Password</InputLabel>
                    <OutlinedInput
                      label='Password'
                      value={password}
                      id='form-layouts-basic-password'
                      name='password'
                      onChange={event => {
                        setPassword(event.target.value)
                        checkPasswordValidity(event.target.value)
                      }}
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
                    <FormHelperText sx={{color: 'red'}} id='form-layouts-basic-password-helper'>{!isValidateNumber && 'Password must contain at least one Digit.'}</FormHelperText>
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
              </>
            )}
            <Grid item xs={12}>
              <Box
                sx={{
                  gap: 5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isResetPass ? (
                  <Button
                    type='submit'
                    disabled={!password || password !== confirmPassValues.password || !isValidateNumber}
                    variant='contained'
                    size='large'
                  >
                    Save user data
                  </Button>
                ) : (
                  <Button type='submit' variant='contained' size='large'>
                    Save user data
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default EditUserLayout
