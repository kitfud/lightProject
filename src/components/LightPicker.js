import React, { useEffect, useState } from 'react'
import { SketchPicker } from 'react-color';
import HardwareConnect from './HardwareConnect';
import { ethers } from 'ethers'
import { getProductContract } from '../utils';

const LightPicker = ({
  setCurrentColorSelectRGB, 
  currentColorSelectRGB,
  currentColorSelectHex, 
  setCurrentColorSelectHex,
  productSelectedAddress,
  setPaymentData

}) => {

  const [hardwareData, setHardwareData]= useState(null)
  const [selectedProductContract, setSelectedProductContract ] = useState(undefined)

  const handleChangeComplete = (color) => {
    setCurrentColorSelectHex(color.hex)
    setCurrentColorSelectRGB(color.rgb)
  }



useEffect(()=>{
if(currentColorSelectRGB !== '0,0,0'){
 formatRGBVal(currentColorSelectRGB)
 console.log(currentColorSelectHex)
}
// setRGBData(currentColorSelect.rgb.r)
},[currentColorSelectRGB])


useEffect(()=>{
if(currentColorSelectHex){
}
},[currentColorSelectHex])

const formatRGBVal = (color) => {

    let r = color.r
    let g = color.g
    let b = color.b

   let hardwareData = `${r},${g},${b}`
   setHardwareData(hardwareData)
 
  }

//This is where the event listener is implemented.
const [dataStream, setDataStream] = useState(undefined)
const [data, setData] = useState(undefined)
const [currentSelectedProductContract, setCurrentSelectedProductContract] = useState(undefined)

useEffect(()=>{
  if(dataStream){
 console.log("SETTING DATA SAMPLE")
 setData(dataStream)
  }
},[dataStream])

useEffect(()=> {
  console.log(data)
  if(data) {
    console.log(data)
    // setPaymentData(data)
  }
},[data])

useEffect(()=>{
  let mounted=true
  // console.log(selectedProductContract & mounted)
  console.log("In useEffect for event listener.")
  if(selectedProductContract ) {
    setCurrentSelectedProductContract(selectedProductContract)
    console.log("EVENT LISTENER ACTIVE")

    selectedProductContract.on("Deposit", (payee,value, time, currentContractBalance, event)=>  {
      if(dataStream !== data) {
      let dataInternal = { 
        payee: payee,
        value: value.toString(),
        time: time.toString(),
        currentContractBalance: currentContractBalance.toString(),
        event: event
      }
        console.log("ABOUT TO SAMPLE DATASTREAM")
        setDataStream(dataInternal)
      }
      if(data){
      console.log("ABOUT TO REMOVE EVENT LISTENER.")
      selectedProductContract.removeListener("Deposit", (payee,value, time, currentContractBalance, event))
      }
      //We just want to catch the first part of the event, and cancel it after. We don't need it a million times.
    })

  }
},[selectedProductContract])

const processSelectedContractAddress = async () => {
  let contract = await getProductContract(productSelectedAddress) 
    setSelectedProductContract(contract)
}
useEffect(()=>{
  if(productSelectedAddress) {
    processSelectedContractAddress()
  }
},[productSelectedAddress])

  return (
    <div className="p-4">
      <SketchPicker
        color={currentColorSelectHex}
        onChangeComplete={(e) => handleChangeComplete(e)}
      />
      <div>
        {currentColorSelectHex}
      </div>
    <HardwareConnect colorData={hardwareData}/>
    </div>
  )
}

export default LightPicker