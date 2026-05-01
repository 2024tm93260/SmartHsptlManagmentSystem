import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentDoctor } from './services/doctorApi.js'
import { Outlet } from 'react-router-dom'

const App = () => {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state) => state.auth);
  const shouldBootstrapAuth = typeof window !== 'undefined' && localStorage.getItem('doctorSession') === 'true';

  useEffect(() => {
    if (shouldBootstrapAuth) {
      dispatch(getCurrentDoctor());
    }
  }, [dispatch, shouldBootstrapAuth]);
    
  if (shouldBootstrapAuth && !isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }
  return (
    <>
     
      <main className="min-h-screen bg-muted p-4">
        <Outlet />
      </main>
    </>
  )
}

export default App
