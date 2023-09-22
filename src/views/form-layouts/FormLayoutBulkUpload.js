// ** React Imports
import { useEffect, useState } from 'react'
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
import { styled } from '@mui/material/styles'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import { MenuItem, Select } from '@mui/material'

import XLSX from 'xlsx'

const FormLayoutsBulkUpload = () => {
  // ** States
  const [users, setUsers] = useState([])
  const [values, setValues] = useState({
    userId: ''
  })

  const [selectedFile, setSelectedFile] = useState(null);
  const [excelData, setExcelData] = useState([]);

  const [confirmPassValues, setConfirmPassValues] = useState({
    password: '',
    showPassword: false
  })

  // ** Hooks

  useEffect(() => {
    let initialData = axios({
      url: `${BASE_URL}/api/users`,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'get'
    })
      .then(response => {
        console.log('user print----- : ', response.data)
        setUsers(response.data.users)
      })

      .catch(err => {
        // if (getToken() && err && err.response && err.response.status === 401) {
        //   logOut()
        // } else {
        //   return {
        //     type: 'FAIL',
        //   }
        // }
        console.log('token print----- : ', err)
      })
  }, [])

  // ** Functions
  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

    // Function to handle file input change
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setSelectedFile(file);
  
      // Read the Excel file and convert it to a JavaScript object
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0]; // Assuming you have only one sheet
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          setExcelData(jsonData);
        };
        reader.readAsArrayBuffer(file);
      }
    };

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

    const submitData = {
      user_id: values.userId,
      users: excelData
    }

    console.log(submitData)

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
            console.log('------register Succ-----')
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

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
  })

  return (
    <Card>
      <CardHeader title='Bulk Upload Clients' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={submitRegister}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='User'>User</InputLabel>
                <Select
                  label='User'
                  defaultValue=''
                  id='user'
                  labelId='User'
                  name='userId'
                  onChange={handleChange('userId')}
                  helperText='You can use letters, numbers & periods'
                >
                  <MenuItem value=''>None</MenuItem>
                  {users ? users.map(user => <MenuItem value={user.id}>{user.name}</MenuItem>) : null}
                </Select>
              </FormControl>
            </Grid>



<Grid item xs={12}>
      <FormControl>
        <Button
          component='label'
          variant='contained'
          startIcon={<CloudUploadIcon />}
        >
          Select file
          <input
            type='file'
            accept=''
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </Button>
        <Box sx={{pt: 2}}>
          {selectedFile ? (
            <Typography>{selectedFile.name}</Typography>
          ) : (
            <Typography>No file selected yet</Typography>
          )}
        </Box>
      </FormControl>
    </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 10
              }}
            >
              <Button type='submit' variant='contained' size='large'>
                Submit
              </Button>
            </Box>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormLayoutsBulkUpload
