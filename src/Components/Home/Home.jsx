import React from 'react'
import Navbar from '../Navbar/Navbar'
import Summary from './SummarySub'

function Home() {
  return (
    <div style={{display:"flex",flexDirection:"column"}}>
        <Navbar/>
        {/* <Summary/> */}
    </div>
  )
}

export default Home