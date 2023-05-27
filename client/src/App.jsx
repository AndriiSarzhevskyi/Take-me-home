import { useEffect, useCallback} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {useRoutes} from './routes';
import {useAuth} from './hooks/auth.hook';
import {AuthContext} from './context/Auth.context';
import { useHttp } from "./hooks/http.hook";
import { ToastContainer, toast } from 'react-toastify';
function App() {

  const {request, error} = useHttp();
  const {token, userName, status, login, changeName, logout, userId, ready} = useAuth();

  const jwtTry = useCallback(async () => {
    try {
      console.log(token);
      const data = await request('/api/jwt/jwt', 'GET', null,  {Authorization: `Bearer ${token}`})
    } catch (e) {}
  }, [token,request])

  useEffect(() => {
    if(token !=null){
      jwtTry ()
    }
  }, [jwtTry ])
  
  useEffect(()=>{
    if(error != null){
      logout();
    }
  },[error]);
  
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);

  return (
    <AuthContext.Provider value={{ token, userName, status, login, changeName, logout, userId, isAuthenticated }}>
      <Router>
        {/* <div className="container"> */}
        <>
          {routes}
          </>
        {/* </div> */}
        
      </Router> 
    </AuthContext.Provider>
  );
}

export default App;
