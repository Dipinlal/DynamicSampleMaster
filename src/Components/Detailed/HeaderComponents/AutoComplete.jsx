import React, { useCallback, useEffect, useState } from 'react';
import { Autocomplete, TextField, Typography,ListSubheader, Paper } from "@mui/material";
// import { buttonColor1 } from '../../../config';
// import { GetAutocompleate } from '../../../apiHelper';
import { useSelector } from 'react-redux';
import { getAutocomplete, getAutocomplete1 } from '../../../apis/api';





const AutoComplete = ({
 
  formData,
  setFormData,
  width,
  autoId,
  autoLabel,
  isMandatory,
  disabled,
  iMaxSize,
  iLinkTag,
  isHeader,
  sFieldName,
  formDataHeader,
  key1

  
}) => {

 
    

      const {iId} = useSelector((state)=>state.authState)

    const [iTypeF2, setiTypeF2] = useState(1);
    const [AutoMenu, setAutoMenu] = useState([]);
    const [autoSearchKey, setautoSearchKey] = useState("");
    const [sCodeReq, setsCodeReq] = useState(false)

    const CustomListBox = React.forwardRef((props, ref) => {
      const { children, ...other } = props;
     
   
      return (
        <ul style={{paddingTop:0}} ref={ref} {...other}>
          <ListSubheader
            style={{ backgroundColor: "rgb(140, 153, 224)", padding: "5px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography style={{ marginRight: "auto" }}>Name</Typography>
              {sCodeReq &&
              <Typography style={{ marginLeft: "auto" }}>Code</Typography>
              } 
              </div>
          </ListSubheader>
          {children}
        </ul>
      );
    });
  // Effect to sync state with prop changes
  useEffect(() => {
    setautoSearchKey(formData[sFieldName] || '');
  }, [formData,sFieldName]);

    const handleAutocompleteChange = (event, newValue) => {
        const updatedFormData = {
          ...formData,
          sName: newValue ? newValue.sName : null,//"" was replaced by null
          iId: newValue ? newValue.iId : null,//"" was replaced by null
         
         
        };
        
        setFormData(updatedFormData); // This will now update the parent's state
        setiTypeF2(1)
      };
      ;

      //get AutoMenu
      const fetchData = async ({F2}) => {
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };
          const formDataiType =F2
          const iUser = iId;
          const iTag = iLinkTag;
          const response = await getAutocomplete(formDataiType,autoSearchKey)
         
          if(response?.data?.ResultData)
          setAutoMenu((JSON.parse(response.data.ResultData)));
        } catch (error) {
          console.log(error);
        }
      };
      useEffect(() => {
       
          
          fetchData({F2:iTypeF2});
    
      }, [iTypeF2,autoSearchKey]);
 
      useEffect(() => {
        
        if(AutoMenu && AutoMenu[1]?.sCode){
          setsCodeReq(true)
        }
        const matchingItem = AutoMenu.find(item => item.iId.toString() === formDataHeader[key1]?.toString());
        
        if (matchingItem) {
          setFormData({
            ...formData,
            sName: matchingItem.sName,
            sCode: matchingItem.sCode,
            iId: matchingItem.iId,
            // [sFieldName]: matchingItem.iId // assuming sFieldName is the field to store the iId
          });
        }
      }, [AutoMenu])
      // useEffect(() => {
        
      //   const matchingItem = AutoMenu.find(item => item.iId.toString() === formDataHeader[key1]?.toString());
        
      //   if(!matchingItem && formDataHeader[key1]>0){
      //     fetchData({F2:3});
      //   }
      // }, [formDataHeader[key1]])
      

  return (
    <Autocomplete
    disabled={disabled}
     PaperComponent={({ children }) => (
      <Paper style={{ minWidth: '150px', maxWidth: '300px'  }}>{children}</Paper>
    )} 
    sx={{height:"35px", marginTop:"0px"}}
      id={autoId}
      options={AutoMenu}
      getOptionLabel={(option) => option && option.sName ? option.sName : ""}
      value={
        AutoMenu.find((option) => option.sName === formData.sName) || null
      }
      onChange={handleAutocompleteChange}
      filterOptions={(options, { inputValue }) => {
        return options.filter(
          (option) =>
          option.sName?.toLowerCase().includes(inputValue.toLowerCase()) ||
          option.sCode?.toLowerCase().includes(inputValue.toLowerCase())
         
        );
      }}
      onInputChange={(event,newInputValue, reason) => {
        if (reason === 'input') { // Check if the change is due to user input
          setautoSearchKey(newInputValue);
          // You might need to update formData here to reflect the change
          setFormData({
            ...formData,
            [sFieldName]: newInputValue, // Assuming you want to track the display value in formData
          });
        }
      }}
      renderOption={(props, option) => (
        <li {...props}>
          <div
            className=""
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography style={{ marginRight: "auto", fontSize: "12px" }}>
              {option.sName}
            </Typography>
            {option.sCode &&
            <Typography style={{ marginLeft: "auto", fontSize: "12px" }}>
              {option.sCode}
            </Typography>
            }
          </div>
        </li>
      )}
      renderInput={(params) => (
        <TextField
        
          {...params}
          label={autoLabel}
          // variant="standard"
          
          InputProps={{
            ...params.InputProps,
            autoComplete: "off",
            // disableUnderline: true, // Disables the underline on the standard variant
            style: {
              // Overrides default styles
              borderWidth: "1px",
              borderColor: "transparent",
              borderStyle: "solid",
              borderRadius: "10px",
              fontSize: "12px",
              height: "35px",
              paddingLeft: "0px",
             
              
            },
            inputProps: {
              ...params.inputProps,
              autoComplete: 'off',
              maxLength: iMaxSize,
              onKeyDown: (event) => {
                if (event.key === "F2") {
                  // Clear selected option and search key before handling F2 press
                  const updatedFormData = {
                    ...formData,
                    sName: newValue ? newValue?.sName : "",
                    iId: newValue ? newValue?.iId : "",
                   
                   
                  };
                  setFormData(updatedFormData); 
                 
                  setautoSearchKey("");

                  setiTypeF2((prevType) => (prevType === 1 ? 2 : 1));
                 
                  // Prevent default F2 key action
                  event.preventDefault();
                }
              },
              
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
              padding: '8px 14px', // Reduce padding to decrease height
              transform: 'translate(10px, -7px) scale(1)',
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
                borderTopLeftRadius: isMandatory  ? "10px" : "10px", // Set the top left radius conditionally
                borderBottomLeftRadius: isMandatory  ? "10px" : "10px", // Set the bottom left radius conditionally
                borderLeftColor: isMandatory  ? "red" : "#ddd", // Set the left border color to red conditionally
                borderLeftWidth: isMandatory  ? "2px" : "default", // Adjust the width of the left border conditionally
              },
              "&.Mui-focused fieldset": {
                // Repeat the same for the focused state if necessary
                top: 0,
                borderTopLeftRadius: isMandatory  ? "10px" : "10px",
                borderBottomLeftRadius: isMandatory  ? "10px" : "10px",
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
          }}
        />
      )}
      ListboxComponent={CustomListBox}
      style={{ width: "100%" }}
    />
  );
};

export default AutoComplete;
