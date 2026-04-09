<<<<<<< HEAD
import React from 'react'

const Profile = () => {
  return (
    <div>
      
    </div>
  )
}

export default Profile
=======
import React, {useEffect, useState} from 'react';
import topNav from '../../components/topNavBar';
import './Profile.css';


export default function ProfilePage() {


    return (
        
        <div className='container'>
            <topNav/>
            <div className='profile-container'>
                <h1>Profile Page</h1>
                {/* Add profile details and functionality here */}
            </div>

                
           
        </div>
    );
}
>>>>>>> d49c1243302157ca14c30f410b5230ab13488885
