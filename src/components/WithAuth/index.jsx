import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
// layout for this page
// import Admin from '../../layouts/Admin.js'

const WithAuth = (WrappedComponent, permissionArray) => {
  return props => {
    // checks whether we are on client / browser or server.
    if (typeof window !== 'undefined') {
      const Router = useRouter()

      //   const accessToken = localStorage.getItem("accessToken");
      const accessToken = Cookies.get('cToken')

      console.log('permissionArray----', permissionArray)
      console.log('Role----', Cookies.get('cRole'))

      // If there is no access token we redirect to "/" page.
      if (!accessToken) {
        // Router.replace("/");
        Router.push('/pages/login/')
        return null
      }

      // If this is an accessToken we just render the component that was passed with all its props

      if (permissionArray.includes(Cookies.get('cRole'))) {
        return <WrappedComponent {...props} />
      } else {
        Router.push('/pages/login/')
        return null
      }
    }

    // If we are on server, return null
    return null
  }
}

// WithAuth.layout = Admin

export default WithAuth
