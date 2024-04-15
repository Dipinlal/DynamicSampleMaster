import React, { useCallback, useEffect, useState } from 'react';
import { Autocomplete, TextField, Typography,ListSubheader, Paper } from "@mui/material";
// import { buttonColor1 } from '../../../config';
// import { GetAutocompleate } from '../../../apiHelper';
import { useSelector } from 'react-redux';
import { getAutocomplete, getAutocomplete1 } from '../../../Apis/Api';





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
  sFieldName,
  formDataHeader,
  key1,
  sFieldId,
  triggerValidation,
  resetTriggerVAlidation

  
}) => {


    

      const {iId} = useSelector((state)=>state.authState)

    const [iTypeF2, setiTypeF2] = useState(1);
    const [AutoMenu, setAutoMenu] = useState([]);
    const [autoSearchKey, setautoSearchKey] = useState("");
    const [sCodeReq, setsCodeReq] = useState(false)
    const [error, setError] = useState({ isError: false, message: '' });

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
    setautoSearchKey(formDataHeader[sFieldName] || '');
    setFormData({...formData,sName:formDataHeader[sFieldName]??"",iId:formDataHeader[sFieldId]??0})
    
  }, []);

    const handleAutocompleteChange = (event, newValue) => {
        const updatedFormData = {
          ...formData,
          sName: newValue ? newValue.Name : "",//"" was replaced by null
          iId: newValue ? newValue.Id : 0,//"" was replaced by null
         
         
        };
        
        setFormData(updatedFormData); // This will now update the parent's state
        setiTypeF2(1)
        if (isMandatory && !newValue) {
          setError({ isError: true, message: 'This field is required.' });
        } else {
          setError({ isError: false, message: '' });
        }
      
      }
      const validateInput = (newValue) => {
        if (isMandatory && !newValue) {
          setError({ isError: true, message: 'This field is required.' });
        } else {
          setError({ isError: false, message: '' });
        }
      };
      
      const fetchSelectedItem = async (fieldName) => {
        try {
          const config = {
            headers: { "Content-Type": "application/json" },
          };
          const iType =iTypeF2
              const iUser = iId;
              const iTag = iLinkTag;
          const response = await getAutocomplete1(iTag, { iType: iTypeF2, search: fieldName });
          if (response?.result) {
            const items = JSON.parse(response.result);
            // Assuming the API returns an array, even if it's meant to fetch a single item
            if (items.length > 0) {
              return items[0]; // Return the first item if available
            }
          }
        } catch (error) {
          console.error('Failed to fetch selected item:', error);
        }
        return null; // Return null if no item is found or in case of an error
      };
      

      //get AutoMenu
      useEffect(() => {
       
          const fetchData = async () => {
            try {
              const config = {
                headers: {
                  "Content-Type": "application/json",
                },
              };
              const iType =iTypeF2
              const iUser = iId;
              const iTag = iLinkTag;
              
              const response = await getAutocomplete1(iTag,{iType,search:autoSearchKey})
              
              if (response?.result) {
                const results = JSON.parse(response.result);
                const currentSelection = results.find(option => option.Name === formDataHeader[sFieldName]);
          
                // Ensure the current selection is always in the menu
                if (!currentSelection && formDataHeader[sFieldName]) {
                  const selectedItem = await fetchSelectedItem(formDataHeader[sFieldName]);
                  if (selectedItem) {
                    results.unshift(selectedItem); // Add to the start of the list
                  }
                }
                
                setAutoMenu(results);
              }
            } catch (error) {
              console.log(error);
            }
          };
          fetchData();
    
      }, [iTypeF2,autoSearchKey]);
  
      useEffect(() => {
        
        if(AutoMenu && AutoMenu[1]?.Code){
          setsCodeReq(true)
        }
      }, [AutoMenu])
      // useEffect(() => {//for edit case
      //   console.log(formDataHeader);
      //   const matchingItem = AutoMenu.find(item => item.Id.toString() === formDataHeader[key1]?.toString());
      //   if (matchingItem) {
      //     setFormData({
      //       ...formData,
      //       sName: matchingItem.Name,
      //       sCode: matchingItem.Code,
      //       iId: matchingItem.Id,
      //       [sFieldName]: matchingItem.Id // assuming sFieldName is the field to store the iId
      //     });
      //   }
      // }, [formDataHeader[key1],AutoMenu])
      

     useEffect(() => {
      if(triggerValidation){
        validateInput(formDataHeader[key1])
      }
      
      resetTriggerVAlidation()
     }, [triggerValidation])
      
      

  return (
    <Autocomplete
    disabled={disabled}
     PaperComponent={({ children }) => (
      <Paper style={{ minWidth: '150px', maxWidth: '300px'  }}>{children}</Paper>
    )} 
    sx={{height:"35px", marginTop:"0px"}}
      id={autoId}
      options={AutoMenu}
      getOptionLabel={(option) => option?.Name ?? ""}
      value={
        AutoMenu.find((option) => option.Name === formDataHeader[sFieldName]) || null
      }
      onChange={handleAutocompleteChange}
      filterOptions={(options, { inputValue }) => {
        return options.filter(
          (option) =>
          option.Name?.toLowerCase().includes(inputValue.toLowerCase()) ||
          option.Code?.toLowerCase().includes(inputValue.toLowerCase())
         
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
              {option.Name}
            </Typography>
            {option.Code &&
            <Typography style={{ marginLeft: "auto", fontSize: "12px" }}>
              {option.Code}
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
          error={error.isError}
          helperText={error.isError ? error.message : null}
          
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
              onKeyDown: (event,newValue) => {
                if (event.key === "F2") {
                  // Clear selected option and search key before handling F2 press
                  const updatedFormData = {
                    ...formData,
                    sName: newValue ? newValue?.Name : "",
                    iId: newValue ? newValue?.Id : 0,
                   
                   
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
