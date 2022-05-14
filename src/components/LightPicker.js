import React, { useEffect, useState } from 'react'
import { SketchPicker } from 'react-color';
import HardwareConnect from './HardwareConnect';
import { ethers } from 'ethers'
import { getProductContract } from '../utils';

const LightPicker = ({
  paymentData,
  setData,
  setCurrentColorSelectRGB, 
  currentColorSelectRGB,
  currentColorSelectHex, 
  setCurrentColorSelectHex,
  productSelectedAddress,
  

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

const [datastream, setDataStream] = useState(null)

useEffect(()=>{
  let mounted = true
  if(selectedProductContract !== undefined && mounted) {

    selectedProductContract.on("Deposit", (payee,value, time, currentContractBalance, event)=>  {
      
      let dataInternal = { 
        payee: payee,
        value: value.toString(),
        time: time.toString(),
        currentContractBalance: currentContractBalance.toString(),
        event: event
      }
      let stringDataInternal = JSON.stringify(dataInternal)
      
      if(stringDataInternal!== datastream){
        setDataStream(stringDataInternal)
        setData(stringDataInternal)
      }
      selectedProductContract.removeListener("Deposit", (payee,value, time, currentContractBalance, event))
      // selectedProductContract.removeListener("Deposit", (payee,value, time, currentContractBalance, event))
      //We just want to catch the first part of the event, and cancel it after. We don't need it a million times.
    })
  }
  return ()=>{mounted = false}
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