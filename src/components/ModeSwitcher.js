import React, { useState } from 'react'
import { Button } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'


const ModeSwitcher = ({ setColorMode }) => {

    const [mode, setMode] = useState("dark")

    return (
        <Button
            sx={{ color: "white" }}
            onClick={() => {
                if (mode === 'light') {
                    setMode("dark")
                    setColorMode("dark")

                } else {
                    setMode("light")
                    setColorMode("light")
                }
            }
            }
        >
            {mode === "dark" ? <LightModeIcon sx={{ color: "white" }} /> : <DarkModeIcon sx={{ color: "black" }} />}
        </Button>
    );
};

export default ModeSwitcher