import React, {useState} from 'react'
import {Button} from '@mui/material'

const Shop = () => {

const [num, setNum] = useState(0)

const changeNum = () =>{
let number = num
number++
setNum(number)
}

function myName(){
    return "Kit"
}

let user = myName()
console.log(user)


const MyAnimal = () =>{
    return(
        <div>
            <Button sx={{color:"pink"}} variant="contained" >Animal Button</Button>
        </div>
    )
}

const MyDinner = () =>{
    return(
        <div>Apple Pie</div>
    )
}


1==="1" ? console.log("true"): console.log("false")


  return (
<>
<div>{`my number is ${num}`}</div>
<button onClick={changeNum}>Change Num</button>
{
    num%2==0?(
<MyAnimal/>
    ):
    (
<MyDinner/>
    )
}


</>
  )

}

export default Shop