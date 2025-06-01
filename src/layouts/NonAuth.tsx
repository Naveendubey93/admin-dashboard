import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store';

const NonAuth = () => {

  const { user } = useAuthStore();
  const location = useLocation();
  if(user) {
    const  retuenTo = new URLSearchParams(location.search).get('returnTo') || '/';
    if(retuenTo) {
      return <Navigate to={retuenTo} replace={true} />;
    }
    // return <Navigate to="/" replace={true} />;
  }
  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default NonAuth