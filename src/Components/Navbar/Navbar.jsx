import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import './navbar.css'
import { secondaryColorTheme } from '../../config';


function Navbar() {

  const [pageName, setpageName] = useState('/')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [appBarData, setAppBarData] = useState([]);
  const [subMenu, setSubMenu] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null); // For controlling the submenu position
  const open = Boolean(anchorEl);
  const [mainMenuName, setmainMenuName] = useState("")
 
  //const { userMenu, UserExists } = useSelector((state) => state.authState); // Assuming menu data is in authState
  
 const userMenu = [{sName:"Master",iParentId:0,iId:1},{sName:"Customer",iParentId:1,iId:2}]

  const location = useLocation();
  const currentPage = location.pathname;

  // Function to extract the page name from the URL
  const getPageName = () => {
    const parts = currentPage.split('/');
    return parts[parts.length - 1] || 'Home'; // Default to 'Home' if no page name is found
  };
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate('/');
  };
  const handleLogoClick = () => {
    navigate('/Home')
  };
  
 
  useEffect(() => {
    const pageName = getPageName();
    setpageName(pageName);
  }, [currentPage]);
  
 useEffect(() => {
  // Assuming `userMenu` contains the menu items retrieved from the API
  if (userMenu) {
    const topLevelMenu = userMenu.filter(item => item.iParentId === 0);
    setAppBarData(topLevelMenu);
  }
}, []);

const handleAppBarItemClick = (event, item) => {
  if (item.iParentId === 0) {
    // Top-level item, show submenus
    const subMenus = userMenu.filter(subItem => subItem.iParentId === item.iId);
    setSubMenu(subMenus);
    setmainMenuName(item.sName)
    setAnchorEl(event.currentTarget); // Use the clicked item as anchor
  } else {
    // Navigate to the corresponding page
    navigate("/Home");
  }
};
const handleCloseSubMenu = () => {
  setAnchorEl(null); // Close the submenu
};


  
    return (
      <>
        <AppBar id='appBarMain' sx={{backgroundColor:secondaryColorTheme}} position="static">
          <Toolbar>
            <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <img src="/images/sang_logo.png" alt="Logo" style={{ marginRight: '10px', height: '40px' }} onClick={handleLogoClick}/>
              {appBarData.map((app, index) => (
            <Typography  key={app.iId}
            variant="h6"
            component="div"
            style={{ marginRight: '10px', cursor: 'pointer' }}
            onClick={(event) => handleAppBarItemClick(event,app)}>
              {app.sName}
            </Typography>
          ))}
              
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* <IconButton color="inherit">
                <SettingsIcon />
              </IconButton> */}
              <IconButton color="inherit" onClick={handleLogout}>
                <PowerSettingsNewIcon />
              </IconButton>
              {/* <img src="/images/sang_logo.png" alt="Another Logo" style={{ marginLeft: '10px', height: '40px' }} /> */}
            </div>
          </Toolbar>
        </AppBar>
        <Menu
        
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleCloseSubMenu}
        
      >
        {subMenu.map((subItem) => (
          <MenuItem key={subItem.iId} 
           onClick={() => {
            handleCloseSubMenu();
            navigate(`/${mainMenuName}`, { state: { pageTitle: subItem.sName, iDoctype: subItem.iDoctype } });
        }}>
            {subItem.sName}
          </MenuItem>
        ))}
      </Menu>
      </>
      );
}

export default Navbar