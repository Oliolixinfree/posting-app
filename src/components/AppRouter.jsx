import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useContext } from 'react'
import { publicRoutes, privatRoutes } from '../router'
import { AuthContext } from '../context'
import Loader from './UI/Loader/Loader'

const AppRouter = () => {
    const {isAuth, isLoading} = useContext(AuthContext)

    if(isLoading) {
        return <Loader />
    }

    return (
        isAuth
            ?
            <Routes>
                {/* Новый react-router-dom. Switch и Redirect(у Redirect новая конструкия через Route) удалены */}
                {/* <Route path='/error' element={<Error />} /> */}
                {privatRoutes.map(route => 
                    <Route 
                        element={route.component} 
                        path ={route.path} 
                        exact={route.exact}
                        key={route.path} 
                    />
                )}
                
                <Route path='*' element={<Navigate replace to='/posts' />} />
            </Routes>
            :
            <Routes>
                {publicRoutes.map(route => 
                    <Route 
                        element={route.component} 
                        path ={route.path} 
                        exact={route.exact}
                        key={route.path} 
                    />
                )}
                <Route path='*' element={<Navigate replace to='/login' />} />
            </Routes>
        
    )
}

export default AppRouter