// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'
import Router, { useRouter } from 'next/router'

import axios from 'axios'

import { BASE_URL } from '../../../env'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import EditIcon from '@mui/icons-material/Edit'
import Button from '@mui/material/Button'

const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'email', label: 'Email', minWidth: 170 },
  { id: 'phone', label: 'Phone No', minWidth: 170 },
  { id: 'action', label: 'Action', minWidth: 170 }
]
// function createData(name, email, phone) {
//   return { name, email, phone}
// }

// const rows = [
//   createData('Sakib Al Hasan', 'sakib@gmail.com', 1324171354),
//   createData('Mushfiq Rahim', 'mushi@gmail.com', 1403500365),
//   createData('Mahmudul', 'mahmud@gmailcom', 60483973),
//   createData('Tamim Iqbal', 'tamim@gmail.com', 327167434),
//   createData('Liton Das', 'lkd@gmail.com', 37602103),
//   createData('Tawhid Hridoy', 'tawhid@gmail.com', 25475400)
// ]

const TableStickyHeader = () => {
  const router = useRouter()

  // ** States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [rows, setRows] = useState([])

  let buffer = []

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  useEffect(() => {
    let initialData = axios({
      url: `${BASE_URL}/api/users`,
      headers: {
        'Content-Type': 'application/json'
        // Authorization: `Bearer ${Cookies.get('cToken')}`
      },
      // data: submitData,
      method: 'get'
    })
      .then(response => {
        // setResDatas(response.data);
        console.log('user print----- : ', response.data)

        response.data.users.map(item => {
          if (item.role !== 'superadmin') {
            buffer.push({ id: item.id, name: item.name, email: item.email, phone: item.phone })
          }
        })

        setRows(buffer)

        // console.log(resDatas, '---buffer==')

        // return Router.push('/admin/table-list')
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

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
            {console.log('rows---', rows)}
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
                  {columns
                    .filter(column => column.id != 'action')
                    .map(column => {
                      const value = row[column.id]

                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                      )
                    })}
                  <TableCell>
                    <Button
                      sx={{ marginBottom: 7 }}
                      onClick={() =>
                        router.push({
                          pathname: '/edit-user',
                          query: { userData: JSON.stringify(row) }
                        })
                      }
                      type='button'
                    >
                      <EditIcon sx={{ marginRight: 2, fontSize: '1.375rem', color: '#EC533D' }} />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default TableStickyHeader
