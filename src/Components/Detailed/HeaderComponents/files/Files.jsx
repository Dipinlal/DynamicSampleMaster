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

function Files({sFieldName,label,isMandatory,formDataHeader,key1,disabled,setfiles}) {
    const tableHeaderStyle ={
        border: '1px solid #ddd', padding: '2px', backgroundColor: secondaryColorTheme, color: 'white' ,fontSize:"12px"
     }
     const tableBodyStyle ={
       border: '1px solid #ddd', padding: '2px', 
     }
  const [fileNames, setFileNames] = useState(formDataHeader[key1]);
  const [allFiles, setAllFiles] = useState([]);
  const [docType, setDocType] = useState('');
  const [iDocType, setiDocType] = useState(0)
  const [refNo, setRefNo] = useState('');
  const [editFileIndex, seteditFileIndex] = useState(null)
  const [autoCompleteData, setautoCompleteData] = useState({
    sName:"",
    iId:0
  })

  const getAttachmentsData = () => {
    return allFiles.map(fileObj => ({
        iAttachType: fileObj.iDocType,
        sRefNo: fileObj.sRefNumber,
        sPath: fileObj.filename
    }));
};
useEffect(() => {
  setfiles(allFiles)
}, [allFiles])

  
console.log(formDataHeader[key1]);
    const newFileRef = useRef();

  // Handler for file input change
   // Handler for file input change
   const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      newFileRef.current = file; // Store the file in the ref
    }
    
  };
   // Handler for the Add button click
   const handleAddFile = async() => {
    const fileInput = document.getElementById('chatboxfiles'); // Replace with your actual file input ID
    
    const fileToAdd = newFileRef.current;
    
    const formData1 = new FormData();

    try {
      
   
    
    if (fileToAdd) {
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, ""); // Create a timestamp
      
      const nameParts = fileToAdd.name.split('.'); // Split the file name to separate the extension
      const extension = nameParts.pop().toLowerCase(); // Remove the last part (extension)
      const baseName = nameParts.join('.'); // Rejoin the remaining parts in case the name contained periods
      const modifiedName = `${docType}__userId_${timestamp}.${extension}`; // Construct the modified name

    //   formData1.append("iType",11);
    // formData1.append("imageFiles", fileToAdd,modifiedName);
    // const response = await UploadFiles(master,formData1);
    

    if (editFileIndex !== null) {
      // Editing an existing file
      setAllFiles(prevFiles => {
          const updatedFiles = [...prevFiles];
          updatedFiles[editFileIndex] = {
              sDocType: docType,
              iDocType:iDocType,
              sRefNumber: refNo,
              filename: modifiedName,
              file: fileToAdd,
          };
          return updatedFiles;
      });
    }
      else{
    setAllFiles(prevFiles => [
      ...prevFiles,
      {
        sDocType: docType,
        iDocType:iDocType, 
        sRefNumber: refNo,
        filename: modifiedName,
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
     
    }else{
     alert("select file")
    }
  } catch (error) {
      console.log(error);
  }
  };
  const handleDownload = (fileObj) => {
    if (fileObj.url) {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
      const fileNameParts = fileObj.name.split('.');
      const extension = fileNameParts[fileNameParts.length - 1].toLowerCase();
  
      if (imageExtensions.includes(extension)) {
        // Handle images: display in a new tab
        const htmlContent = `<html>
                               <head><title>Image Viewer</title></head>
                               <body><img src="${fileObj.url}" style="max-width: 100%; height: auto;"></body>
                             </html>`;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } 
      else{
      // It's an existing file, download it from the URL
      const link = document.createElement('a');
      link.href = fileObj.url;
      link.download = fileObj.name;
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
      link.download = fileObj.name;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }
  };
  
  const handleEdit = (index, fileObj) => {
   setDocType(fileObj?.sDocType??"")
   setiDocType(fileObj?.iDocType??0)
   setautoCompleteData({...autoCompleteData,sName:fileObj.sDocType,iId:fileObj.iDocType})
   setRefNo(fileObj?.sRefNumber??"")
   const file = fileObj?.file;
    if (file) {
      newFileRef.current = file; // Store the file in the ref
     

    }
    const fileInput = document.querySelector('input[type="file"]');
    const myFile = new File(['Hello World!'], fileObj.filename, {
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
    const newFileNames = fileNames.filter((_, i) => i !== index);
    setAllFiles(newFiles);
   
    setFileNames(newFileNames);
  };

  useEffect(() => {
  
    setDocType(autoCompleteData.sName)
    setiDocType(autoCompleteData.iId)

  }, [autoCompleteData])
  
  return (
    <div className='filesmain'>
        <div className='filesmainD1'>
            
            {/* <TextField
          label={label}
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
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
              width:"100%"
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
        /> */}
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
                      id="chatboxfiles"
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
                        {allFiles.map((fileObj, index) => {
                           
                          return (
                            <tr key={index}>
                            <td style={tableBodyStyle}>{index + 1}</td>
                            <td style={tableBodyStyle}>{fileObj.sDocType}</td>
                            <td style={tableBodyStyle}>{fileObj.sRefNumber}</td>
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