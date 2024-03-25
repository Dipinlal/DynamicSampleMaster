import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton'; // Import IconButton
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './login.css';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/actions/userAction';
import { useNavigate } from 'react-router-dom';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Login_GetCompany, Login_Login } from '../../apis/Api';
import AlertBox from "../AlertBox/AlertBox"


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCompanyName, setselectedCompanyName] = useState('');
  const [companyList, setcompanyList] = useState([])
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertcolor, setalertcolor] = useState("#000000")


  const {isAuthenticated} = useSelector((state)=>state.authState)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // const companyList = [
  //   { sDatabase: 'Company A', iId: '1' },
  //   { sDatabase: 'Company B', iId: '2' },
    
  // ];

  //To change loginname
  const handleUsernameChange = (event) => {
    const value = event.target.value;
    setUsername(value);
    //validateUsername(value);
  };

  //Tochange password
  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    // validatePassword(value);
  };
  //username validation
  const validateUsername = (value) => {
    const regex = '' || /^[a-zA-Z]+$/;
    const isValid = regex.test(value);
    setErrors((prevErrors) => ({ ...prevErrors, username: !isValid }));
  };

  //password validation
  const validatePassword = (value) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    const isValid = regex.test(value);
    setErrors((prevErrors) => ({ ...prevErrors, password: !isValid }));
  };
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async(event) => {
    event.preventDefault();
    const formData = {
      "username":username ,
      "password": password,
      "database": selectedCompanyName
    }
   try {
    const response = await Login_Login(formData)
    
   if(response.status === 200){
    setAlertMessage(response.data.message);
    setShowAlert(true);
    setalertcolor("#28a745")//green
 
    const { accessToken, refreshToken } = response?.data?.tokens;
   
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    setTimeout(() => {
      setShowAlert(false);
      navigate('/Home')

    }, 1000);
   }
   else{
    setAlertMessage(response.data.message);
    setShowAlert(true);
    setalertcolor("#ffcc00")//yellow

    
    setTimeout(() => {
      setShowAlert(false);
      // navigate('/Home')

    }, 1000);
   }
     
   } catch (error) {
    console.log(error);
    if (error.response && error.response.status) {
      switch (error.response.status) {
        case 400://bad request
         
        setAlertMessage(error.response.data.message);
        setShowAlert(true);
        setalertcolor("#ffcc00")//yellow
      

        setTimeout(() => {
          setShowAlert(false);
          

        }, 1000);
          break;
        case 401://unauthorized
          
          setAlertMessage(error.response.data.message);
          setShowAlert(true);
          setalertcolor("#ffcc00")//yellow
        
  
          setTimeout(() => {
            setShowAlert(false);
            
  
          }, 1000);
         
          break;
        case 403://forbidden
        setAlertMessage(error.response.data.message);
        setShowAlert(true);
        setalertcolor("#ffcc00")//yellow
      

        setTimeout(() => {
          setShowAlert(false);
          

        }, 1000);
         
          break;
        case 404://Notfound
          
          setAlertMessage(error.response.data.message);
        setShowAlert(true);
        setalertcolor("#ffcc00")//yellow
      

        setTimeout(() => {
          setShowAlert(false);
        

        }, 1000);
          break;
        case 409://conflict
        setAlertMessage(error.response.data.message);
        setShowAlert(true);
        setalertcolor("#ffcc00")//yellow
      

        setTimeout(() => {
          setShowAlert(false);
          

        }, 1000);
         
          break;
        case 500:
          console.error("A 500 Internal Server Error occurred.");
          // Handle server errors
          break;
        default:
          console.error(`An error occurred: ${error.response.status}`);
          // Handle other types of errors
          break;
      }
    } else {
      // If the error does not have a response status code, it might be a network error or something else
      console.error("An error occurred:", error.message);
      // Handle errors that aren't server responses, like network errors
    }
   }
  };

  const handleCompanyChange = (event) => {
    setselectedCompanyName(event.target.value);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Login_GetCompany();
        if (response.statusCode === 200 && response.status === "Success") {
          setcompanyList(JSON.parse(response.result));
        } else {
          setcompanyList([]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    
    fetchData();
  }, []);
  

  return (<><AlertBox message={alertMessage} show={showAlert} color={alertcolor}/>
    <div className='LoginMain'>
      <div className='LMS1'>
        <div className='LMS1Left'> 
        
        <img className='LMS1Img' src="/images/login_bg.png"/>
        </div>
        <div className='LMS1Right'>
        <div className='LMS1RS' >
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={handleUsernameChange}
          error={errors.username}
          helperText={errors.username ? `Username should  contain alphabets only and Can't be empty` : ''}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handlePasswordChange}
          error={errors.password}
          helperText={
            errors.password
              ? 'Password should be a minimum 6-character combination of letters and numbers'
              : ''
          }
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                {showPassword ?  <Visibility /> :<VisibilityOff /> }
              </IconButton>
            ),
          }}
        />
        <FormControl fullWidth margin="normal">
        <InputLabel id="company-select-label">Company</InputLabel>
        <Select
          labelId="company-select-label"
          id="company-select"
          value={selectedCompanyName}
          label="Company"
          onChange={handleCompanyChange}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 200, // Set the maximum height to 200px
              },
            },
          }}
        >
          {companyList.map((company) => (
            <MenuItem key={company.iId} value={company.sDatabase}>
              {company.sDatabase}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

        <Button variant="contained" color="primary" type="submit" disabled={errors.username || errors.password || !password || !username}>
          Login
        </Button>
      </form>
    </div>

        </div>
      </div>
      

    </div>
    </>
  );
};

export default Login;
