import React, { useEffect, useRef, useState } from 'react'
import "./files.css"
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import { secondaryColorTheme } from '../../../../config';
import {
    TextField,
    Typography,
  } from "@mui/material";
import AutoCompleteFiles from './AutoCompleteFiles';

  const textFieldStylye={
    "& .MuiOutlinedInput-input": {
      padding: "8px 14px",
      transform: "translate(0px, 4px) scale(1)",
    },
    "& .MuiInputLabel-outlined": {
      transform: "translate(14px, 12px) scale(0.75)",
    },
    "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
      transform: "translate(14px, -6px) scale(0.75)",
      backgroundColor: "#fff",
      padding: "0px 2px",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        top: 0,
        borderTopLeftRadius: "10px",
        borderBottomLeftRadius: "10px",
        //borderLeftColor: isMandatory ? "red" : "#ddd",
        //borderLeftWidth: isMandatory ? "2px" : "1px",
      },
      "&.Mui-focused fieldset": {
        top: 0,
        borderTopLeftRadius: "10px",
        borderBottomLeftRadius: "10px",
        //borderLeftColor: isMandatory ? "red" : "currentColor",
        //borderLeftWidth: isMandatory ? "2px" : "1px",
      },
    },
    '& .MuiInputLabel-outlined.Mui-focused': {
      color: 'currentColor',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'currentColor',
    }
  }

function Files({sFieldName,label,isMandatory,formDataHeader,key1,disabled,setfiles, fieldErrors,setFieldErrors,sErrorMsgConditions,handleError}) {
    const tableHeaderStyle ={
        border: '1px solid #ddd', padding: '2px', backgroundColor: secondaryColorTheme, color: 'white' ,fontSize:"12px"
     }
     const tableBodyStyle ={
       border: '1px solid #ddd', padding: '2px', 
     }
 
  const [allFiles, setAllFiles] = useState(formDataHeader[key1]);
  const [docType, setDocType] = useState('');
  const [attachType, setattachType] = useState(0)
  const [refNo, setRefNo] = useState('');
  const [editFileIndex, seteditFileIndex] = useState(null)
  const [autoCompleteData, setautoCompleteData] = useState({
    sName:"",
    iId:0
  })
  const [error, setError] = useState('');

 
useEffect(() => {
  setfiles(allFiles)
}, [allFiles])

useEffect(() => {
  setError(fieldErrors[sFieldName] )
 }, [fieldErrors[sFieldName]])
  

    const newFileRef = useRef();

  // Handler for file input change
   // Handler for file input change
   const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      newFileRef.current = file; // Store the file in the ref
    }
    
  };

  // Clear the error when the user selects a document type
  useEffect(() => {
    if (docType) {
      setError('');
    }
  }, [docType]);
   // Handler for the Add button click
   const handleAddFile = async() => {
    const fileInput = document.getElementById('masterFilesId'); // Replace with your actual file input ID
    
    const fileToAdd = newFileRef.current;
    const existingFile = allFiles[editFileIndex]?.baseUrl;
    
    let errorMessage = "";
    if (sErrorMsgConditions) {
      try {
        const conditions = JSON.parse(sErrorMsgConditions);
          
        for (const condition of conditions) {
          if (condition.errorcondition === "Type Required" && !docType) {
            errorMessage = condition.message;
            break; // Exit the loop if an error is found
          }
          if (condition.errorcondition === "File Required" && (!fileToAdd && !existingFile)) {
            errorMessage = condition.message;
            break; // Exit the loop if an error is found
          }
          if (condition.errorcondition === "Image Only" && fileToAdd) {
            // Validate that fileToAdd is an image
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
            if (!validImageTypes.includes(fileToAdd.type)) {
              errorMessage = condition.message;
              break; // Exit the loop if an error is found
            }
          }
          
          
        }
          // If any error was found, break the loop
          // if (errorMessage) break;
        
      } catch (e) {
        console.error("Error parsing sErrorMsgConditions:", e);
        // Handle error or set a default error message
      }
    }
    
    if(errorMessage != ""){
      // handleError(errorMessage);
      setError(errorMessage)
      return
    }
    else{
      setError("")
    }
    
    
    
    
    const formData1 = new FormData();

    try {
      
   
      
    if (fileToAdd ||existingFile ) {
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, ""); // Create a timestamp
      const todayDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const nameParts = fileToAdd?.name?.split('.'); // Split the file name to separate the extension
      const extension = nameParts?.pop().toLowerCase(); // Remove the last part (extension)
      const baseName = nameParts?.join('.'); // Rejoin the remaining parts in case the name contained periods
      // const modifiedName = `${docType}__userId_${timestamp}.${extension}`; // Construct the modified name

      const modifiedName = `${attachType}_${timestamp}.${extension}`; 
    //   formData1.append("iType",11);
    // formData1.append("imageFiles", fileToAdd,modifiedName);
    // const response = await UploadFiles(master,formData1);
    

    if (editFileIndex !== null) {
      // Editing an existing file
      setAllFiles(prevFiles => {
          const updatedFiles = [...prevFiles];
          const existingFile = updatedFiles[editFileIndex];
          if (fileToAdd) 
          {
            updatedFiles[editFileIndex] = {
                attachTypeName: docType,
                attachType:attachType,
                refNo: refNo,
                fileName: modifiedName,
                file: fileToAdd,
            };
           }
          else {
            updatedFiles[editFileIndex] = {
              ...existingFile, // keep the existing fields
              attachTypeName: docType,
              attachType: attachType,
              refNo: refNo,
              // Don't update the file object
            };
          }
          return updatedFiles;
      });
    }
      else{
    setAllFiles(prevFiles => [
      ...prevFiles,
      {
        attachTypeName: docType,
        attachType:attachType, 
        refNo: refNo,
        fileName: modifiedName,
        file: fileToAdd, // Include the File object
      }
    ]);
    }
    // setFileNames(prevNames => [...prevNames, modifiedName]);
      newFileRef.current = null; // Clear the ref
  
      if (fileInput) {
        fileInput.value = ''; // Clear the file input field
      }
      
    setDocType("")
    setRefNo("")
    seteditFileIndex(null);
    setautoCompleteData({sName:"",iId:0})
     
    }
  } catch (error) {
      console.log(error);
  }
  };
  const handleDownload = (fileObj) => {
    if (fileObj.baseUrl) {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
      const fileNameParts = fileObj.fileName.split('.');
      const extension = fileNameParts[fileNameParts.length - 1].toLowerCase();
  
      if (imageExtensions.includes(extension)) {
        // Handle images: display in a new tab
        const htmlContent = `<html>
                               <head><title>Image Viewer</title></head>
                               <body><img src="${fileObj.baseUrl}/${fileObj.fileName}" style="max-width: 100%; height: auto;"></body>
                             </html>`;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } 
      else{
      // It's an existing file, download it from the URL
      const link = document.createElement('a');
      link.href = fileObj.url;
      link.download = fileObj.fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    } else if (fileObj.file) {
      // It's a newly uploaded file, create a URL and download it
      const url = window.URL.createObjectURL(fileObj.file);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileObj.fileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }
  };
  
  const handleEdit = (index, fileObj) => {
   setDocType(fileObj?.attachTypeName??"")
   setattachType(fileObj?.attachType??0)
   setautoCompleteData({...autoCompleteData,sName:fileObj.attachTypeName,iId:fileObj.attachType})
   setRefNo(fileObj?.refNo??"")
   const file = fileObj?.file;
    if (file) {
      newFileRef.current = file; // Store the file in the ref
     

    }
    const fileInput = document.querySelector('input[type="file"]');
    const myFile = new File(['Hello World!'], fileObj.fileName, {
      type: 'text/plain',
      lastModified: new Date(),
  });

  // Now let's create a DataTransfer to get a FileList
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(myFile);
  fileInput.files = dataTransfer.files;
  seteditFileIndex(index)


  };


 

  // const handleDeleteFile = (index) => {
  //   const updatedFiles = allFiles.filter((_, i) => i !== index);
  //   setAllFiles(updatedFiles);
  // };
  // Handler for the Delete button click
  const handleDeleteFile = (index) => {
    // Filter out the file at the specific index
    const newFiles = allFiles.filter((_, i) => i !== index);
    
    setAllFiles(newFiles);
   
    
  };

  useEffect(() => {
  
    setDocType(autoCompleteData.sName)
    setattachType(autoCompleteData.iId)

  }, [autoCompleteData])
  
  return (
    <div className='filesmain'>
        <div className='filesmainD1'>
            
            
        <AutoCompleteFiles

          formData={autoCompleteData}
          setFormData={setautoCompleteData}
          autoId="filesAutoComplete"
          autoLabel={label}
          isMandatory={isMandatory}
          disabled={disabled}
          iMaxSize="200"
          iLinkTag="/Employee/GetDocumentType"
          // triggerValidation
          // resetTriggerVAlidation
         
         />
        <TextField
          label="Ref No."
          value={refNo}
          onChange={(e) => setRefNo(e.target.value)}
          //error={!!fieldErrors[key1]} // Use the error state for this field
          //helperText={fieldErrors[key1]} // Display the error message
          variant="outlined"
         //fullWidth
          //disabled={isDisabled}
          InputProps={{
            style: {
              borderWidth: "1px",
              borderColor: "transparent",
              borderStyle: "solid",
              borderRadius: "10px",
              fontSize: "12px",
              height: "35px",
              paddingLeft: "0px",
              textAlign: "center",
            },
            inputProps: {
              //maxLength: iMaxSize ? iMaxSize : 200,
            },
          }}
          InputLabelProps={{
            style: {
              fontSize: "16px",
              //color: isMandatory ? "red" : "inherit",
            },
            //shrink: sDatatype === "date" ? true : undefined, // Automatically shrink label for date type
          }}
          sx={textFieldStylye}
        //   type={sDatatype}
        //   value={formDataHeader[key1]}
        //   onChange={handleChange}
        //   onBlur={handleBlur}
        />

           
        </div>
        <div className='filesmainD2'>
        <div
                    
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="/*"
                      id="masterFilesId"
                    />
                    
                    <button
                      style={{
                        width: "60px",
                        border: "1px solid ",
                        marginTop: "2px",
                      }}
                      onClick={handleAddFile}
                    >
                      Add
                    </button>
                    {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display the error message here */}
                  </div>
        <div >
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr>
                          <th style={tableHeaderStyle}>
                            <Typography id="fileTableHeade">Sl.No</Typography>
                          </th>
                          <th style={tableHeaderStyle}>
                            <Typography id="fileTableHeade">Doc Type</Typography>
                          </th>
                          <th style={tableHeaderStyle}>
                            <Typography id="fileTableHeade">Ref No.</Typography>
                          </th>
                          <th style={tableHeaderStyle}>
                            <Typography id="fileTableHeade">File</Typography>
                          </th>
                          <th style={tableHeaderStyle}>
                            <Typography id="fileTableHeade">Edit</Typography>
                          </th>
                          <th style={tableHeaderStyle}>
                            <Typography id="fileTableHeade">Delete</Typography>
                          </th>
                          
                        </tr>
                      </thead>
                      <tbody>
                        {allFiles && allFiles.map((fileObj, index) => {
                           
                          return (
                            <tr key={index}>
                            <td style={tableBodyStyle}>{index + 1}</td>
                            <td style={tableBodyStyle}>{fileObj.attachTypeName}</td>
                            <td style={tableBodyStyle}>{fileObj.refNo}</td>
                            <td style={tableBodyStyle}>
                              <DownloadIcon
                                sx={{
                                  color: secondaryColorTheme,
                                  cursor: "pointer",
                                }}
                                onClick={() => handleDownload(fileObj)}
                              />
                            </td>
                            <td style={tableBodyStyle}>
                              <EditIcon
                                sx={{
                                  color: secondaryColorTheme,
                                  cursor: "pointer",
                                }}
                                onClick={() => handleEdit(index,fileObj)}
                              />
                            </td>
                            <td style={tableBodyStyle}>
                              <DeleteIcon
                                sx={{
                                  color: secondaryColorTheme,
                                  cursor: "pointer",
                                }}
                                onClick={() => handleDeleteFile(index)}
                              />
                            </td>
                          </tr>
                          )
                        }
                         
                        )}
                      </tbody>
                    </table>
                  </div>
        </div>
        
    </div>
  )
}

export default Files