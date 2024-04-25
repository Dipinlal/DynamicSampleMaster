import React from 'react'
import Navbar from '../Navbar/Navbar'
import SummarySub from './SummarySub'

function Summary() {
  return (
    <div style={{display:"flex",flexDirection:"column"}}>
        <Navbar/>
        <SummarySub/>
    </div>
  )
}

export default Summary