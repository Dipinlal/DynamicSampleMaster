import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import { visuallyHidden } from "@mui/utils";
import { Button, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useLocation, useNavigate } from "react-router-dom";
import { getEmployeeSummary } from "../../Apis/Api";
import { secondaryColorTheme } from "../../config";
import EnhancedTableRole from "./SummaryTable";
import { useState } from "react";





export default function Summary() {
  const token = Number(localStorage.getItem("accessToken"));
  const location = useLocation();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState(0);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [data, setData] = React.useState([]);
  const [display, setDisplay] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [edit, setEdit] = React.useState(0)
  const [direction, setDirection] = React.useState(false)
  const [displayLength, setdisplayLength] = React.useState(10);
  const [pageNumber, setpageNumber] = React.useState(1);
  const [changesTriggered, setchangesTriggered] = React.useState(false);
  const [selectedDatas, setselectedDatas] = React.useState([]);
  const [totalRows, settotalRows] = useState(0)

  const navigate = useNavigate()
  const buttonStyle = {
    textTransform: "none", // Set text transform to none for normal case
    color: `primary`, // Set text color
    backgroundColor: secondaryColorTheme, // Set background color
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
    fontSize: "12px",
    padding: "6px 10px",
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleRowDoubleClick = (rowiId) => {
  
    // if (rowiId === null) {
    //   setAlertMessage("Please Select Row");
    //   setShowAlert(true);
    //   setalertcolor("#ffcc00");
    //   setTimeout(() => {
    //     setShowAlert(false);
    //   }, 2000);
    // } else {
    //   setdoubleClickediId(rowiId);
    //   setnewOpen(true);
    // }
  };
  const handleSelectedRowsChange = (selectedRowsData) => {
   
    setselectedDatas(selectedRowsData);
  };
  const resetChangesTrigger = () => {
    setchangesTriggered(false);
  };
  const handleCloseModal = () => {
    setEdit(0)
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const fetchData = async () => {
    handleOpen();
    setSelected([]);

    const response = await getEmployeeSummary({refreshFlag:false,pageNumber:pageNumber,pageSize:displayLength,masterId:0});
   
    if (response?.status === "Success") {
      const myObject = JSON.parse(response?.result);
      console.log(myObject);
  
      // Assuming Item1 contains the data for your table
      setData(myObject.Item1);
  
      // Extract the number of total rows from Item2
      const totalRowsString = myObject.Item2; // This should be "Total Rows: 68"
      const totalRows = parseInt(totalRowsString.split(":")[1].trim(), 10); // This converts the "68" into a number
  
      // Set total rows to your state or wherever it needs to be used
      settotalRows(totalRows);
      console.log(totalRows); // This should log the number 68
  }

    handleClose();
  };
console.log(data);
  React.useEffect(() => {
    fetchData(); // Initial data fetch
    setPage(0);
  }, [token]);

  const handleDisplayLengthChange = (newDisplayLength) => {
    setdisplayLength(newDisplayLength);
  };

  const handlepageNumberChange = (newpageNumber) => {
    setpageNumber(newpageNumber);
  }


  const handleEdit =()=>{
    setEdit(selected.join())  
    handleOpenModal()
  }

  const handleNew =()=>{
    // navigate("/MasterDetailed",{ state: { masterId: 0,employeeId:selectedDatas[0].iId } })
    navigate("/MasterDetailed",{ state: { masterId: 0,employeeId:65 } })
  }

 const handleSubmit = ()=>{
   fetchData()
 }

  const handlePage = ()=>{
    setDirection(true)
  }


  return (
    <>
      <Box
       
      >
        <Box
          sx={{
            width: "auto",
            paddingLeft: 2,
            paddingRight: 2,
            paddingBottom: 5,
            zIndex: 1,
        marginTop:"100px",
           
            
          }}
          
        >
        
          
            <Stack
              direction="row"
              spacing={1}
              padding={1}
              justifyContent="flex-end"
              sx={{width:"95%",marginBottom:"10px"}}
            >
              <Button onClick={handleNew}
                variant="contained"
                startIcon={<AddIcon />}
                style={buttonStyle}
              >
                New
              </Button>


              <Button 
              onClick={handleEdit}
                 disabled={selected.length !== 1}
                variant="contained"
                style={buttonStyle}
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
              
            </Stack>

            <EnhancedTableRole
             
             rows={data}
             //onExportData={handleExportData}
             onDisplayLengthChange={handleDisplayLengthChange}
             onpageNumberChange={handlepageNumberChange}
            //  onSortChange={handleSortChange}
            //  onSearchKeyChange={handleSearchKeyChange}
             changesTriggered={changesTriggered}
             setchangesTriggered={resetChangesTrigger}
             onSelectedRowsChange={handleSelectedRowsChange}
             onRowDoubleClick={handleRowDoubleClick}
             
             
           />
        
        </Box>
        
        
      </Box>
    </>
  );
}
