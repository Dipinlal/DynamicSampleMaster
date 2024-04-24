import React, { useCallback, useEffect, useMemo, useState } from 'react'
import "./checkbox.css"
import SearchBox from './SearchBox';
import { getAutocomplete1 } from '../../../../apis/api';
import { Typography } from '@mui/material';

function CheckBox({iLinkTag,sFieldName,label,isMandatory,checkBoxData,setcheckBoxData,formDataHeader,key1,disabled,menuList}) {

    const [formData, setformData] = useState({})
    const [companyList, setcompanyList] = useState([]);
    const [companyListExist, setCompanyListExist] = useState("");
    const [changesTriggered, setchangesTriggered] = useState(false);
   
    useEffect(() => {
      // Convert [{id:1}, {id:2}, {id:3}] to "1,2,3"
      
      if(formDataHeader[key1]!==""){
        const idsString = formDataHeader[key1]?.map(item => item.id).join(',') ?? "";
        setCompanyListExist(idsString);
    
      }
      
      // If companyListExist is meant to be an array of ids instead of a string, use:
      // const idsArray = formDataHeader[key1]?.map(item => item.id) ?? [];
      // setCompanyListExist(idsArray);
  
    }, []);

    const handleSelectedIds = useCallback(
        (selectedIds, params, selectedTitles) => {
          setformData((prevFormData) => ({
            ...prevFormData,
            [params]: selectedIds.map(id => ({ id: id })), // map to array of objects
          }));
        },
        []
      );
     
      
     
      const resetChangesTrigger = () => {
        setchangesTriggered(false);
      };
      const UserSearch = useMemo(
        () => (
          <SearchBox
            initialItems={companyList}
            search={true}
            handleSelectedIds={handleSelectedIds}
            params={sFieldName}
            changeTriggered={changesTriggered}
            setchangesTriggered={resetChangesTrigger}
            initialCheckedIds={companyListExist}
            disabled={disabled}
          />
        ),
        [companyList, handleSelectedIds, changesTriggered, companyListExist]
      );

      useEffect(() => {

        if(menuList.length>0){
            
              
          const formattedData = menuList.map((item) => ({
            title: item.Name,
            iId: item.Id,
          }));
          setcompanyList(formattedData);
        
     
     
     
     
    
    }
      },[menuList])

      // const fetchData = async () => {
      //   try {
      //     const iTag = iLinkTag;
      //     const response = await getAutocomplete1(iTag)
      //     if(response?.result){
      //       const resultData = JSON.parse(response?.result)
      //       if(resultData.length>0){
            
              
      //           const formattedData = resultData.map((item) => ({
      //             title: item.Name,
      //             iId: item.Id,
      //           }));
      //           setcompanyList(formattedData);
              
           
           
           
           
           
      //     }else {
      //       // If resultData is empty but not an error, keep the old companyList
      //       setcompanyList(prevCompanyList => prevCompanyList.length > 0 ? prevCompanyList : []);
      //     }
      //     }
      //     else {
      //       // If the response doesn't have a result field, it might be a network error
      //       console.error("Failed to fetch data: Network error or no data");
      //       // Optional: Set an error state and show a message to the user
      //     }
            
          
      //   } catch (error) {
      //     console.log(error);
         
      //   }
      // };
      // useEffect(() => {
       
      //   fetchData();
      // }, []);
      useEffect(() => {
        if(companyList.length>0)
        {
        setcheckBoxData(formData)
        }
        // else{
        //   fetchData()
        // }

      }, [formData])
     
  return (
    <div>
        {companyList.length > 0 && (
                <div className="checkboxmainD1">
                  <div className="checkboxmainD1C">
                    <Typography id="checkboxmainD1CI1">{label}</Typography>
                    <div className="CCNPCompanySearchBoxM">
                      <div
                         style={
                          isMandatory
                            ? { borderLeft: "3px solid red" }
                            : null
                        }
                        className="CCNPCompanySearchBoxMS"
                      >
                        {UserSearch}
                      </div>
                    </div>
                  </div>
                </div>
              )}
    </div>
  )
}

export default CheckBox