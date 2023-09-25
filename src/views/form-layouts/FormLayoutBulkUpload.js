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

import * as xlsx from 'xlsx'

const FormLayoutsBulkUpload = () => {
  // ** States
  const [users, setUsers] = useState([])
  const [clientsData, setClientsData] = useState([])
  const [userId, setUserId] = useState()

  const [selectedFile, setSelectedFile] = useState(null)
  const [excelData, setExcelData] = useState([])

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

  const readUploadFile = e => {
    e.preventDefault()
    setSelectedFile(e.target.files[0])
    if (e.target.files) {
      const reader = new FileReader()
      reader.onload = e => {
        const data = e.target.result
        const workbook = xlsx.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = xlsx.utils.sheet_to_json(worksheet)
        console.log('json----', json)
        setClientsData(json)
      }
      reader.readAsArrayBuffer(e.target.files[0])
    }
  }

  const submitBulkUpload = e => {
    e.preventDefault()

    // if(!errors['email'] && !errors['password']) {
    const submitData = {
      clientsData: clientsData,
      userId: userId
    }

    return (
      axios({
        url: `${BASE_URL}/api/bulk-upload-clients`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: submitData,
        method: 'post'
      })
        .then(response => {

          if (response?.data?.status === 'success') {
            console.log('------bulk-upload-clients Succ-----')
            return Router.push('/users/')
          }
        })

        .catch(err => {

          console.log('token print error ----- : ', err)
        })
    )
    // }
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
      <CardHeader title='Bulk Upload Clients' titleTypographyProps={{ variant: 'h6' }} sx={{margin: '20px 0'}} />
      <CardContent>
        <form onSubmit={submitBulkUpload}>
          <Grid container spacing={5}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel id='User'>User</InputLabel>
                <Select
                  label='User'
                  defaultValue=''
                  id='user'
                  labelId='User'
                  name='userId'
                  onChange={(e) => {
                    setUserId(e.target.value)
                  }}
                  helperText='You can use letters, numbers & periods'
                >

                  {users ? users.map(user => <MenuItem value={user.id}>{user.name}</MenuItem>) : <MenuItem value=''>None</MenuItem>}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl>
                <Button component='label' variant='contained' startIcon={<CloudUploadIcon />}>
                  Select file
                  <input type='file' name='upload' id='upload' onChange={readUploadFile} style={{ display: 'none' }} />
                </Button>
                <Box sx={{ pt: 2 }}>
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
