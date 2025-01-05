import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Tours from '../pages/Tours'
import TourDetails from '../pages/TourDetails'
import Login from '../pages/Login'
import Register from '../pages/Register'
import SearchResultList from '../pages/SearchResultList'
import UserProfile from '../pages/UserProfile'
import ThankYou from '../pages/ThankYou'
import About from '../pages/About'
import ProtectedRoute from './ProtectedRoute'

const Routers = () => {
   return (
      <Routes>
         <Route path='/' element={<Navigate to='/home'/>} />
         <Route path='/home' element={<Home/>} />
         <Route path='/tours' element={<Tours/>} />
         <Route path='/tours/:id' element={<TourDetails/>} />
         <Route path='/login' element={<Login/>} />
         <Route path='/register' element={<Register/>} />
         <Route path='/thank-you' element={<ThankYou/>} />
         <Route path='/about' element={<About/>} />
         <Route path='/tours/search' element={<SearchResultList/>} />
         
         {/* Protected Routes */}
         <Route 
            path='/profile' 
            element={
               <ProtectedRoute>
                  <UserProfile />
               </ProtectedRoute>
            } 
         />
         <Route 
            path='/bookings' 
            element={
               <ProtectedRoute>
                  <UserProfile activeTab="bookings" />
               </ProtectedRoute>
            } 
         />
      </Routes>
   )
}

export default Routers
