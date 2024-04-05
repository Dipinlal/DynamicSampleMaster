import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { getAutocomplete1 } from '../../../../Apis/Api';
import { Typography } from '@mui/material';
import "./radiocss.css"

function Radio({iLinkTag,sFieldName,label,isMandatory,radioValue,setradioValue,formDataHeader,key1,disabled}) {

    const [formData, setformData] = useState(formDataHeader)
    const [companyList, setcompanyList] = useState([]);
    const [changesTriggered, setchangesTriggered] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState(formDataHeader[key1]);
   
    
      useEffect(() => {
        setradioValue(formData)
      }, [formData])
      
      const resetChangesTrigger = () => {
        setchangesTriggered(false);
      };
      

      useEffect(() => {
        const fetchData = async () => {
          try {
            const iTag = iLinkTag;
            const response = await getAutocomplete1(iTag)
            const resultData = JSON.parse(response.result)
            if(resultData.length>0){
            
              
                const formattedData = resultData.map((item) => ({
                  title: item.Name,
                  iId: item.Id,
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
      const handleRadioChange = (event) => {
        const selectedId = parseInt(event.target.value, 10);
       
        setSelectedCompanyId(selectedId);
        setformData(prevFormData => ({
            ...prevFormData,
            [sFieldName]: selectedId,
        }));
    };
    
  return (
    <div>
        {companyList.length > 0 && (
                <div className="radiomainD1">
                  <div className="radiomainD1C">
                    <span style={{display:"flex",flexDirection:"row",alignItems:"center"}}><Typography id="radiomainD1CI1">{label}</Typography>{isMandatory && <h1 style={{color:"red",fontSize:"18px"}}>*</h1>}</span>
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
                                    <label key={company.Id}>
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