import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./detailed.css";
import Header from "./HeaderComponents/Header";
import Body from "./BodyComponents/Body";
import AlertBox from "../AlertBox/AlertBox";
import { Savings } from "@mui/icons-material";
import { UploadFiles, getFields, postEmployee } from "../../apis/api";

function Detailed() {
  const { iId } = useSelector((state) => state.authState);

  const [headerData, setheaderData] = useState([]);
  const [bodyData, setbodyData] = useState([]);
  const [saveValidation, setsaveValidation] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertcolor, setalertcolor] = useState("#000000");
  const [fieldErrors, setFieldErrors] = useState({});
  const [headerFormData, setheaderFormData] = useState({
    name: "Edit",
    cityId: 9,
    cityName: "BERLIN",
  });
  const changeHeaderFormData = (newFormData) => {
    setheaderFormData((prevFormData) => ({
      ...prevFormData,
      ...newFormData,
    }));
  };

  const [saving, setsaving] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = location.state?.pageTitle;
  const iTransId = location.state?.iTransid;
  const iDocType = location.state?.iDoctype;

  const handleFieldError = (fieldKey, errorMessage) => {
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [fieldKey]: errorMessage,
    }));
  };

  const resetFieldErrors = () => setFieldErrors({});

  //select main and attachements

  //get document settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFields();

        if (response?.result) {
          setheaderData(JSON.parse(response.result));
          console.log(JSON.parse(response.result));
        } else {
          setheaderData([]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  //get details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const iUser = iId;

        // const response = await getDetails({iTransId,iUser,iDocType})
        // // console.log(response)
        // const resultData = JSON.parse(response.data.ResultData)

        // console.log(resultData)
      } catch (error) {
        console.log(error);
      }
    };
    if (iTransId) fetchData();
  }, [iTransId, iId, iDocType]);

  const resetSavevalidation = () => {
    setsaveValidation(false);
  };
  // const handleSave = async()=>{
  //   try {
  //     console.log(headerFormData);
  //     const employeeData ={

  //         "id": 0,
  //         "name": headerFormData.sName,
  //         "dob": headerFormData.dDob,
  //         "address": headerFormData.sAddress,
  //         "cityId": 0,
  //         "countryId":0,
  //         "pinCode": 0,
  //         "dateofJoining": headerFormData.dDateofJoining,
  //         "departmentId": headerFormData.iDepartmentId,
  //         "previousSalary": headerFormData.nPreviousSalary,
  //         "currentSalary": headerFormData.nCurrentSalary

  //     }
  //     const response = await postEmployee(employeeData)
  //     console.log(response);
  //     setsaving(false)
  //   } catch (error) {
  //     console.log(error);
  //     setsaving(false)
  //   }

  // }

  // const handleSaveClick = async()=>{
  //   setsaveValidation(true)
  //   setsaving(true)
  // }
  // const validateAndUpdateFormData = () => {
  //   let updatedFormData = { ...headerFormData }; // Make a copy to avoid direct state mutation
  //   Object.keys(headerFormData).forEach((formDataKey) => {
  //     const matchingField = headerData.find((field) => field.sFieldName === formDataKey);
  //     if (matchingField && matchingField.sDatatype === "number" && !headerFormData[formDataKey]) {
  //       updatedFormData[formDataKey] = 0; // Set default value if datatype is number and value is falsy
  //     }
  //   });
  //   return updatedFormData;
  // };

  console.log("Saving data:", headerFormData);
  const handleSave = async () => {
    console.log("Saving data:", headerFormData);

    let selectedFiles = [];

    const attachmentsWithoutFiles = headerFormData.attachments.map(
      (attachment) => {
        if (attachment.file) {
          // Add the file and its name to the selectedFiles array
          selectedFiles.push({
            file: attachment.file,
            fileName: attachment.fileName,
          });
        }
        // Return the rest of the attachment data, including the fileName property
        const { file, ...rest } = attachment;
        return rest;
      }
    );
    console.log(attachmentsWithoutFiles);
    console.log(selectedFiles);
    const newFormData = {
      ...headerFormData,
      attachments: attachmentsWithoutFiles,
    };
    console.log(newFormData);
    const formData = new FormData();

    if (selectedFiles && selectedFiles.length) {
      selectedFiles.forEach((file, index) => {
        formData.append(`files`, file.file, file.fileName);
      });
    }
    try {
      // for (let [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }

      const response = await postEmployee(newFormData);
      console.log(response);
      const response2 = await UploadFiles({ masterId: 0, formData });
      console.log(response2);

      //   if(response.status === 200){
      //     setAlertMessage(response.data.message);
      //     setShowAlert(true);
      //     setalertcolor("#28a745")//green

      //     setTimeout(() => {
      //       setShowAlert(false);

      //     }, 1000);
      //    }
      //    else{
      //     setAlertMessage(response.data.message);
      //     setShowAlert(true);
      //     setalertcolor("#ffcc00")//yellow

      //     setTimeout(() => {
      //       setShowAlert(false);
      //       // navigate('/Home')

      //     }, 1000);
      //    }
      // Handle successful save (e.g., show success message, navigate away, etc.)
      setsaving(false); // Reset saving state
    } catch (error) {
      console.log(error);
      setsaving(false);

      if (error.response && error.response.status) {
        switch (error.response.status) {
          case 400: //bad request
            setAlertMessage(error.response.data.errors.employee[0]);
            setShowAlert(true);
            setalertcolor("#ffcc00"); //yellow

            setTimeout(() => {
              setShowAlert(false);
            }, 3000);
            break;
          case 401: //unauthorized
            setAlertMessage(error.response.data.message);
            setShowAlert(true);
            setalertcolor("#ffcc00"); //yellow

            setTimeout(() => {
              setShowAlert(false);
            }, 1000);

            break;
          case 403: //forbidden
            setAlertMessage(error.response.data.message);
            setShowAlert(true);
            setalertcolor("#ffcc00"); //yellow

            setTimeout(() => {
              setShowAlert(false);
            }, 1000);

            break;
          case 404: //Notfound
            setAlertMessage(error.response.data.message);
            setShowAlert(true);
            setalertcolor("#ffcc00"); //yellow

            setTimeout(() => {
              setShowAlert(false);
            }, 1000);
            break;
          case 409: //conflict
            setAlertMessage(error.response.data.message);
            setShowAlert(true);
            setalertcolor("#ffcc00"); //yellow

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
      // Handle save error (e.g., show error message)
      setsaving(false); // Reset saving state
    }
  };

  // useEffect(()=>{

  //     const errorsArray = Object.entries(fieldErrors).filter(([, message]) => message);

  //   console.log(fieldErrors);
  //     if (errorsArray.length > 0) {
  //       // Show first error or all errors concatenated, depending on your UI design
  //       const [firstErrorKey, firstErrorMessage] = errorsArray[0];
  //       setAlertMessage(`${firstErrorKey}: ${firstErrorMessage}`);
  //       setShowAlert(true);
  //       setalertcolor("#ffcc00"); // yellow for errors
  //       setTimeout(() => {
  //       setShowAlert(false);

  //       }, 1000);
  //       // Optionally, reset validation trigger and errors after showing the alert
  //       resetSavevalidation();

  //       setsaving(false)
  //     }
  //     if(errorsArray.length === 0 && saving){
  //       handleSave()
  //     }

  // },[fieldErrors,saving])
  const isValidEmail = (email) => {
    // Simple regex for basic email validation
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  };
  const validateAllFields = (headerData, headerFormData) => {
    let allValid = true;
    headerData.forEach((field) => {
      let errorMessage = "";
      const fieldKey = field.sFieldName;
      const today = new Date();
      const selectedDate = new Date(headerFormData[fieldKey]); //added  formDataHeader[key1]) instead of datevalue
      today.setHours(0, 0, 0, 0); // Normalize today's date for comparison
      selectedDate.setHours(0, 0, 0, 0);
      const value = headerFormData[fieldKey];
      if (field.sErrorMsgConditions) {
        try {
          const conditions = JSON.parse(field.sErrorMsgConditions);

          for (const condition of conditions) {
            switch (condition.errorcondition) {
              case "Empty":
                if (
                  value === undefined ||
                  value === false ||
                  value === null ||
                  value == "0" ||
                  value == 0 ||
                  (typeof value === "string" && !value.trim())
                ) {
                  errorMessage = condition.message;
                }
                break;
              case "maxlength":
                if (value.length > field.iMaxSize) {
                  errorMessage = condition.message;
                }
                break;
              case "Before":
                // Assuming inputValue is a date string in the format 'YYYY-MM-DD'
                if (new Date(selectedDate) < today) {
                  errorMessage = condition.message;
                }
                break;
              case "After":
                if (new Date(selectedDate) > new Date(today)) {
                  errorMessage = condition.message;
                }
                break;
              case "File Required":
                if (!(value.length > 0)) {
                  errorMessage = condition.message;
                }
                break;
              case "Email Format":
                if (!isValidEmail(inputValue)) {
                  errorMessage = condition.message;
                }
                break;

              default:
                break;
            }
            // If any error was found, break the loop
            if (errorMessage) break;
          }
        } catch (e) {
          console.error("Error parsing sErrorMsgConditions:", e);
          // Handle error or set a default error message
        }
      }
      if (errorMessage) {
        // If the mandatory field is empty, set an error
        handleFieldError(fieldKey, errorMessage);
        allValid = false;
      }
    });
    return allValid;
  };

  const handleSaveClick = async () => {
    setsaveValidation(true); // Trigger the validation
    const allFieldsValidated = validateAllFields(headerData, headerFormData);

    if (allFieldsValidated) {
      setAlertMessage(`No error`);
      setShowAlert(true);
      setalertcolor("#ffcc00"); // yellow for errors
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      handleSave();
    } else {
      const errorsArray = Object.entries(fieldErrors).filter(
        ([, message]) => message
      );

      if (errorsArray.length > 0) {
        // Show first error or all errors concatenated, depending on your UI design
        const [firstErrorKey, firstErrorMessage] = errorsArray[0];
        setAlertMessage(`${firstErrorKey}: ${firstErrorMessage}`);
        setShowAlert(true);
        setalertcolor("#ffcc00"); // yellow for errors
        setTimeout(() => {
          setShowAlert(false);
        }, 1000);
      }
    }
  };

  return (
    <>
      <AlertBox message={alertMessage} show={showAlert} color={alertcolor} />
      <div className="CustomerListMain">
        <Navbar />
        <div className="CLMS1"></div>
        <div className="CLTableContainer">
          <div className="CLTCS1">
            <div>
              <h2 className="CLTCS1T1">{pageTitle}</h2>{" "}
            </div>
            <div className="CLTCS1D2">
              {/* <Button
              id="CLTCS1D2B1"
              onClick={handleNew}
              startIcon={
                <AddCircleOutlineIcon id="CLTCS1D2BI" className="CLTCS1D2B" />
              }
            >
              New
            </Button> */}
              <Button
                id="CLTCS1D2B2"
                disabled={saving}
                onClick={handleSaveClick}
                startIcon={<SaveIcon id="CLTCS1D2BI" className="CLTCS1D2B" />}
              >
                Save
              </Button>

              {/* <Button
              id="CLTCS1D2B2"
              onClick={handlePrint}
              startIcon={<PrintIcon id="CLTCS1D2BI" className="CLTCS1D2B" />}
            >
              Print
            </Button> */}
              {/* <Button
              id="CLTCS1D2B3"
              onClick={handleDelete}
              startIcon={
                <DeleteOutlineIcon id="CLTCS1D2BI" className="CLTCS1D2B" />
              }
            >
              Delete
            </Button> */}
              {/* <Button
              id="CLTCS1D2B4"
              onClick={handleClose}
              startIcon={<ArrowBackIcon id="CLTCS1D2BI" className="CLTCS1D2B" />}
            >
              
            </Button> */}
              {/* <Button
              id="CLTCS1D2B4"
              onClick={handleClose}
              startIcon={<ArrowForwardIcon id="CLTCS1D2BI" className="CLTCS1D2B" />}
            >
              
            </Button> */}
              {/* <Button
              id="CLTCS1D2B4"
              onClick={handleClose}
              startIcon={<CloseIcon id="CLTCS1D2BI" className="CLTCS1D2B" />}
            >
              Close
            </Button> */}
            </div>
          </div>
        </div>
        <Header
          headerData={headerData}
          triggerValidation={saveValidation}
          resetTriggerVAlidation={resetSavevalidation}
          handleFieldError={handleFieldError}
          errorGlobal={fieldErrors}
          resetFieldErrors={resetFieldErrors}
          headerFormData={headerFormData}
          setheaderFormData={changeHeaderFormData}
        />
      </div>
    </>
  );
}

export default Detailed;
