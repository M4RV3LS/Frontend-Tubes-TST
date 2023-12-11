"use client"
import React from 'react'
import Navbar from '@/components/Navbar/Navbar'
import SessionHistoryTable from '@/components/SessionHistoryTable/SessionHistoryTable'

const page = () => {
  return (
    <div>
        <Navbar/>
        <h2>Navbar</h2><SessionHistoryTable/></div>
        

  )
}

export default page