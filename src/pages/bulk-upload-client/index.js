import { Grid } from '@mui/material'
import React from 'react'
import FormLayoutsBulkUpload from 'src/views/form-layouts/FormLayoutBulkUpload'


const BulkUploadClient = () => {
  return (
    <Grid container spacing={6}>
    <Grid item xs={12}>
      <FormLayoutsBulkUpload />
    </Grid>
    </Grid>
  )
}

export default BulkUploadClient