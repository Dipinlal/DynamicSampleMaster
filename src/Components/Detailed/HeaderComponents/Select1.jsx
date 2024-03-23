import React, { useState, useEffect } from 'react';
import { Select, MenuItem, InputLabel, FormControl, Typography, Paper } from "@mui/material";
import { useSelector } from 'react-redux';
import { getAutocomplete } from '../../../Apis/Api';

const CustomSelect1 = ({
  formData,
  setFormData,
  autoId,
  autoLabel,
  isMandatory,
  disabled,
  iMaxSize,
  iLinkTag,
  sFieldName
}) => {console.log(formData[sFieldName]);
  const { iId } = useSelector((state) => state.authState);
  const [selectedValue, setSelectedValue] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAutocomplete(iLinkTag);
        setOptions(JSON.parse(response.data.result));
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [iLinkTag]);

  useEffect(() => {;
    setSelectedValue(formData[sFieldName] || '');
  }, [formData, sFieldName]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    const selectedOption = options.find(option => option.iId === newValue) || {};

    setSelectedValue(newValue);
    setFormData({
      ...formData,
      sName: selectedOption.iId || "",
      iId: selectedOption.iId || "",
      
    });
  };

  return (
    <FormControl fullWidth variant="outlined" disabled={disabled} size="small" 
    InputProps={{
     
      // disableUnderline: true, // Disables the underline on the standard variant
      style: {
        // Overrides default styles
        borderWidth: "1px",
        borderColor: "transparent",
        borderStyle: "solid",
        borderRadius: "10px",
        fontSize: "12px",
        height: "35px",
        paddingLeft: "6px",
       
        
      },
      
    }}
    InputLabelProps={{
      style: {
          
        fontSize: '16px',
        color:isMandatory?"red":undefined
        
      

        
      },
    }}
    sx={{
      '& .MuiOutlinedInput-input': {
        padding: '5px 14px', // Reduce padding to decrease height
        transform: 'translate(10px, 4px) scale(1)',
        fontSize:"12px"
      },
      '& .MuiInputLabel-outlined': {
        transform: 'translate(14px, 12px) scale(0.75)', // Adjust the label position
      },
      '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.75)', 
        backgroundColor: '#fff',
        padding:"0px 2px"
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          top: 0,
          borderTopLeftRadius:"10px", // Set the top left radius conditionally
          borderBottomLeftRadius:"10px", // Set the bottom left radius conditionally
          borderTopRightRadius:"10px",
          borderBottomRightRadius:"10px",
          borderLeftColor: isMandatory  ? "red" : "#ddd", // Set the left border color to red conditionally
          borderLeftWidth: isMandatory  ? "2px" : "default", // Adjust the width of the left border conditionally
        },
        "&.Mui-focused fieldset": {
          // Repeat the same for the focused state if necessary
          top: 0,
          borderTopLeftRadius: isMandatory  ? "10px" : "10px",
          borderBottomLeftRadius: isMandatory  ? "10px" : "10px",
          borderTopRightRadius:"10px",
          borderBottomRightRadius:"10px",
          borderLeftColor: isMandatory  ? "red" : "currentColor",
          borderLeftWidth: isMandatory ? "2px" : "default",
        },
      },
      '& .MuiInputLabel-outlined.Mui-focused': {
        color: 'currentColor', // Keeps the current color of the label
      },
      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'currentColor', // Keeps the current border color
      }
    }}>
      <InputLabel id={`${autoId}-${sFieldName}-label`}>{autoLabel}</InputLabel>
      <Select
        labelId={`${autoId}-label`}
        id={`${autoId}-${sFieldName}-label`}
        value={selectedValue}
        onChange={handleChange}
        label={autoLabel}
        
        
        
      >
        {options.map((option) => (
          <MenuItem key={option.iId} value={option.iId}>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Typography variant="body2">{option.sName}</Typography>
              {/* <Typography variant="body2">{option.iId}</Typography> */}
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect1;
