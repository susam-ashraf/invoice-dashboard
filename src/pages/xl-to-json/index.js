// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Demo Components Imports
import FormLayoutsBasic from 'src/views/form-layouts/FormLayoutsBasic'
import FormLayoutsIcons from 'src/views/form-layouts/FormLayoutsIcons'
import FormLayoutsSeparator from 'src/views/form-layouts/FormLayoutsSeparator'
import FormLayoutsAlignment from 'src/views/form-layouts/FormLayoutsAlignment'
import Button from '@mui/material/Button'
import axios from 'axios'
import { BASE_URL } from '../../../env'

import { useState } from 'react'


// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

import WithAuth from '../../components/WithAuth'
import Cookies from 'js-cookie'

import * as xlsx from 'xlsx'

const RegisterUser = () => {

  const [clientsData, setClientsData] = useState([])

  const readUploadFile = e => {
    e.preventDefault()
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

  const submitRegister = e => {
    e.preventDefault()

    // if(!errors['email'] && !errors['password']) {
    const submitData = {
      clientsData: clientsData,
      userId: 1
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
            // return Router.push('/users/')
          }
        })

        .catch(err => {

          console.log('token print error ----- : ', err)
        })
    )
    // }
  }

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        {/* <Grid item xs={12}>
          <FormLayoutsBasic />
        </Grid> */}

        <Grid item xs={12}>
          <form onSubmit={submitRegister}>
            <label htmlFor='upload'>Upload File</label>
            <input type='file' name='upload' id='upload' onChange={readUploadFile} />

            <Button type='submit' variant='contained' size='large'>
              Bulk upload
            </Button>
          </form>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default WithAuth(RegisterUser, ['superadmin'])
