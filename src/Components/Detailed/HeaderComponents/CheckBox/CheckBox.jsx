import React, { useCallback, useEffect, useMemo, useState } from 'react'
import "./checkbox.css"
import SearchBox from './SearchBox';
import { getAutocomplete } from '../../../../Apis/Api';
import { Typography } from '@mui/material';

function CheckBox({iLinkTag,sFieldName,label,isMandatory,checkBoxData,setcheckBoxData}) {

    const [formData, setformData] = useState({})
    const [companyList, setcompanyList] = useState([]);
    const [companyListExist, setCompanyListExist] = useState([]);
    const [changesTriggered, setchangesTriggered] = useState(false);
    const handleSelectedIds = useCallback(
        (selectedIds, params, selectedTitles) => {
            setformData((prevFormData) => ({
            ...prevFormData,
            [params]: selectedIds.join(),
          }));
        },
        []
      );

      useEffect(() => {
        setcheckBoxData(formData)
      }, [formData])
      
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
            //disabled={formData?.iApprove === 1}
          />
        ),
        [companyList, handleSelectedIds, changesTriggered, companyListExist]
      );

      useEffect(() => {
        const fetchData = async () => {
          try {
            const iTag = iLinkTag;
            const response = await getAutocomplete(iTag)
            const resultData = JSON.parse(response.data.result)
            if(resultData.length>0){
            
              
                const formattedData = resultData.map((item) => ({
                  title: item.sName,
                  iId: item.iId,
                }));
                setcompanyList(formattedData);
              
           
           
           
           
            return;
          }else{
            setcompanyList([])
            setloading(false)
            return
    
          }   
            
          } catch (error) {
            console.log(error);
            setcompanyList([])
          }
        };
        fetchData();
      }, []);
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