import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Checkbox } from '@mui/material';
import DynamicInputFieldHeader from '../HeaderComponents/HeaderInputType';
import DeleteIcon from '@mui/icons-material/Delete';
import { buttonColor1 } from '../../../config';
import AddIcon from '@mui/icons-material/Add';


const EditableCell = ({ value, onChange }) => (
  <TextField
    variant="outlined"
    value={value}
    onChange={e => onChange(e.target.value)}
    size="small"
  />
);

const initialRows = [
  { id: 1, employee: '', project: '', company: '', warehouse: '', item: '', description: '' }
];

const MuiEditableTable = ({bodyData}) => {
  const [rows, setRows] = useState(initialRows);
  const [selected, setSelected] = useState([]);
  const [formData, setformData] = useState({ })
  const [hoveredRow, setHoveredRow] = useState(null);
  const [formDatas, setFormDatas] = useState({});

  
  const handleAddRow = (rowIndex) => {
    const newRow = { id: generateNewId(), employee: '', project: '', company: '', warehouse: '', item: '', description: '' };
    const newRows = [...rows.slice(0, rowIndex + 1), newRow, ...rows.slice(rowIndex + 1)];
    setRows(newRows);
  };
  
  const handleDeleteRow = (rowId) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== rowId));
    } else {
      // Optionally, you can alert the user that they cannot delete the last row.
      alert("At least one row must remain.");
    }
  };
  
  const generateNewId = () => {
    // Generate a new unique ID for the new row
    return rows.length > 0 ? Math.max(...rows.map(row => row.id)) + 1 : 1;
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    

    setSelected(newSelected);
  };

  const handleDelete = () => {
    if (rows.length > selected.length) {
      setRows(rows.filter(row => !selected.includes(row.id)));
      setSelected([]);
    } else {
      // Optionally, alert the user that they cannot delete all rows.
      alert("At least one row must remain.");
    }
  };
  const isSelected = (id) => selected.indexOf(id) !== -1;

  const HeaderInputValue = (key,value)=>{
    setformData({
        ...formData,
        [key]:value
    })

}
console.log(rows)
const handleCellChange = (value, rowIndex, columnId) => {
  // Create a new array with the updated row
  const newRows = rows.map((row, index) => {
    if (index === rowIndex) {
      return { ...row, [columnId]: value };
    }
    return row;
  });
  setRows(newRows);
};
  

  return (
    <div>
    <IconButton sx={{width:"90%",display:"flex",flexDirection:"row",justifyContent:"right",margin:"auto",
    "&:hover": { // This targets the hover state
      backgroundColor: "transparent", // Set the background color to transparent
      // If there's a ripple effect on hover that you want to remove, you can add:
      "& .MuiTouchRipple-root": {
        display: "none"
      }
    }}} onClick={handleDelete} disabled={selected.length === 0}>
      <DeleteIcon sx={{color:"rgb(140, 153, 224)"}} />
    </IconButton>
    <TableContainer component={Paper} sx={{maxHeight:"40vh"}}>
      <Table stickyHeader aria-label="editable table">
        <TableHead>
          <TableRow >
          <TableCell sx={{backgroundColor:"rgb(140, 153, 224)",border: '1px solid rgba(224, 224, 224, 1)'}} padding="checkbox">
                <Checkbox sx={{padding:"0px 0px",}}
                  //indeterminate={selected.length > 0 && selected.length < rows.length}
                  checked={selected.length === rows.length}
                  onChange={handleSelectAllClick}
                  inputProps={{ 'aria-label': 'select all desserts' }}
                />
              </TableCell>
              <TableCell  sx={{padding:"0px 0px",border: '1px solid rgba(224, 224, 224, 1)',backgroundColor:"rgb(140, 153, 224)"}} >SI No.</TableCell> {/* Serial Number Header */}
          {bodyData.map((field, index) => (
                
                <TableCell sx={{padding:"0px 0px",height:"40px",border: '1px solid rgba(224, 224, 224, 1)',backgroundColor:"rgb(140, 153, 224)"}}>{field.sFieldCaption}</TableCell>
            ))}
            
          </TableRow>
        </TableHead>
        <TableBody>
        {rows.map((row, rowIndex) => {
              const isItemSelected = isSelected(row.id);
              

              return (
        <TableRow 
        
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        selected={isItemSelected}
       
       >
          <TableCell padding="checkbox" sx={{border: '1px solid rgba(224, 224, 224, 1)'}}  >
                    <Checkbox sx={{padding:"0px 0px",}}
                      checked={isItemSelected}
                      onChange={(event) => handleClick(event, row.id)}
                      inputProps={{ 'aria-labelledby': `checkbox-${row.id}`  }}
                    />
                  </TableCell>
                  <TableCell  sx={{minWidth:"100px",padding:"0px 0px",border: '1px solid rgba(224, 224, 224, 1)' }}
                  onMouseEnter={() => setHoveredRow(row.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  > <span style={{display:"flex",flexDirection:"row",alignItems:"center"}}>{rowIndex + 1}
                  {hoveredRow === row.id && selected.length ===0 && (
            <div style={{ display: 'inline-flex', marginLeft: '10px'}}>
              <IconButton size="small" onClick={() => handleAddRow(rowIndex)}>
                <AddIcon fontSize="inherit" />
              </IconButton>
              <IconButton size="small" onClick={() => handleDeleteRow(row.id)}>
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </div>
          )}</span>
                  </TableCell> {/* Serial Number */}
          {bodyData.map((field, index) => (
          <TableCell  sx={{padding:"0px 0px",border: '1px solid rgba(224, 224, 224, 1)'}} style={{minWidth:"150px",maxWidth:"300px" }}>
          <DynamicInputFieldHeader
          key={field.sFieldName}
          label={field.sFieldCaption}
          key1={field.sFieldName}
          type={field.iDataType}
          HeaderInputValue={(key, value) => handleCellChange(value, rowIndex, key)}
          isMandatory={field.bMandatory}
          isDisabled={field.bReadOnly}
          formDataHeader={rows[rowIndex]}
          iMaxSize={field.iMaxSize}
          iLinkTag={field.iLinkTag}
          isHeader="false"

      />
          </TableCell> 
            
          ))}
          </TableRow>
           );
          })}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
};

export default MuiEditableTable;
