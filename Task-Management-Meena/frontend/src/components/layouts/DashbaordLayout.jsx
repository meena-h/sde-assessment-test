import React from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';

const Dashboard = ({children, activeMenu}) => {
    useUserAuth();
    const { user } = useContext(UserContext);

    return (
       <div classname="">
        <Navbar activeMenu={activeMenu} />

        {user && (
            <div className='flex'>
                <div className="max-[1080px]:hidden">
                    <SideMenu activeMenu={activeMenu} />
                </div>

                <div className='grow mx-5'>{children}</div>
            </div>
        )}
       </div>
    );
};

export default Dashboard;



