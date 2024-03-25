import React, { useCallback, useEffect, useState } from 'react';
import { Autocomplete, TextField, Typography,ListSubheader, Paper } from "@mui/material";
// import { buttonColor1 } from '../../../config';
// import { GetAutocompleate } from '../../../apiHelper';
import { useSelector } from 'react-redux';
import { getAutocomplete } from '../../../Apis/Api';





const AutoComplete1 = ({
 
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
  sFieldName

  
}) => {

 
    const CustomListBox = React.forwardRef((props, ref) => {
        const { children, ...other } = props;
        let codeReq = false
        if(AutoMenu && AutoMenu[0].sCode){
          codeReq = true
        }
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
                {codeReq &&
                <Typography style={{ marginLeft: "auto" }}>Code</Typography>
                } 
                </div>
            </ListSubheader>
            {children}
          </ul>
        );
      });

      const {iId} = useSelector((state)=>state.authState)

    const [iTypeF2, setiTypeF2] = useState(1);
    const [AutoMenu, setAutoMenu] = useState([]);
    const [autoSearchKey, setautoSearchKey] = useState("");
  // Effect to sync state with prop changes
  useEffect(() => {
    setautoSearchKey(formData[sFieldName] || '');
  }, [formData,sFieldName]);

    const handleAutocompleteChange = (event, newValue) => {
        const updatedFormData = {
          ...formData,
          sName: newValue ? newValue.sName : "",
          iId: newValue ? newValue.iId : "",
         
         
        };
        setFormData(updatedFormData); // This will now update the parent's state
        setiTypeF2(1)
      };
      ;

      //get AutoMenu
      useEffect(() => {
       
          const fetchData = async () => {
            try {
              const config = {
                headers: {
                  "Content-Type": "application/json",
                },
              };
              const formDataiType =iTypeF2
              const iUser = iId;
              const iTag = iLinkTag;
              const response = await getAutocomplete(iTag)
              console.log(response);
              setAutoMenu((JSON.parse(response.data.result)));
            } catch (error) {
              console.log(error);
            }
          };
          fetchData();
    
      }, [iTypeF2,autoSearchKey]);
  
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
      onInputChange={(event, newInputValue) => {
        setautoSearchKey(newInputValue);
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
              autoComplete: 'nope',
              maxLength: iMaxSize,
              onKeyDown: (event) => {
                if (event.key === "F2") {
                  // Clear selected option and search key before handling F2 press
                  const updatedFormData = {
                    ...formData,
                    sProduct:"",
                    sPCode: "",
                    iProduct:null,
                   
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

export default AutoComplete1;
