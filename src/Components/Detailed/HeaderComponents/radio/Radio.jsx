import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { getAutocomplete1 } from '../../../../apis/api';
import { IconButton, Typography } from '@mui/material';
import "./radiocss.css"
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

function Radio({iLinkTag,sFieldName,label,isMandatory,radioValue,setradioValue,formDataHeader,key1,disabled,menuList}) {

    
    const [companyList, setcompanyList] = useState([]);
    const [changesTriggered, setchangesTriggered] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState(formDataHeader[key1]??0);
   
    
      useEffect(() => {
        setradioValue(selectedCompanyId)
      }, [selectedCompanyId])
      
      const resetChangesTrigger = () => {
        setchangesTriggered(false);
      };
      
      useEffect(() => {

        if(menuList.length>0){
            
              
          const formattedData = menuList.map((item) => ({
            title: item.Name,
            iId: item.Id,
          }));
          setcompanyList(formattedData);
        
     
     
     
     
    
    }
      },[menuList])

    //   useEffect(() => {
    //     const fetchData = async () => {
    //       try {
    //         const iTag = iLinkTag;
    //         const response = await getAutocomplete1(iTag)
    //         if(response?.result){
    //           const resultData = JSON.parse(response?.result)
    //         if(resultData.length>0){
            
              
    //             const formattedData = resultData.map((item) => ({
    //               title: item.Name,
    //               iId: item.Id,
    //             }));
    //             setcompanyList(formattedData);
              
           
           
           
           
          
    //       }else {
    //         // If resultData is empty but not an error, keep the old companyList
    //         setcompanyList(prevCompanyList => prevCompanyList.length > 0 ? prevCompanyList : []);
    //       }
    //       }
    //       else {
    //         // If the response doesn't have a result field, it might be a network error
    //         console.error("Failed to fetch data: Network error or no data");
    //         // Optional: Set an error state and show a message to the user
    //       }
            
            
    //       } catch (error) {
    //         console.log(error);
            
    //       }
    //     };
    //     fetchData();
    //   }, []);
      const handleRadioChange = (event) => {
        const selectedId = parseInt(event.target.value, 10);
       
        setSelectedCompanyId(selectedId);
        
    };
    
  return (
    <div>
        {companyList.length > 0 && (
                <div className="radiomainD1">
                  <div className="radiomainD1C">
                    <span style={{display:"flex",flexDirection:"row",alignItems:"center",marginBottom:"5px"}}><Typography id="radiomainD1CI1">{label}</Typography>{isMandatory && <IconButton  sx={{
    color: "red",
    
   
    padding: 0, // You can adjust padding to further control the size
  }}  ><RadioButtonCheckedIcon sx={{color:"red",fontSize:"18px"}}/></IconButton>}</span>
                    <div className="radiomainD1BoxM">
                      <div
                        //  style={
                        //   isMandatory
                        //     ? { borderLeft: "3px solid red" }
                        //     : null
                        // }
                        className="radiomainD1BoxMS"
                      >
                        {companyList.map(company => (
                                    <label style={{display:"flex",flexDirection:"row",alignItems:"center",gap:"1px"}} key={company.Id}>
                                        <input
                                            type="radio"
                                            name={sFieldName}
                                            value={company?.iId}
                                            checked={selectedCompanyId === company.iId}
                                            onChange={handleRadioChange}
                                            disabled={disabled}
                                        />
                                        {company.title}
                                    </label>
                                ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
    </div>
  )
}

export default Radio