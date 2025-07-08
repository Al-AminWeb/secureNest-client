import {Outlet} from 'react-router'
import Navbar from '../components/Navbar/Header.jsx'

const MainLayout = () => {
    return (
        <div className='bg-background'>
            <Navbar></Navbar>
            <Outlet></Outlet>
        </div>
    )
}

export default MainLayout
