import { StrictMode } from 'react'
import { useEffect , useState } from "react"
import { createRoot } from 'react-dom/client'
import './index.css'
import WeatherChat from './components/weatherchat.jsx'
import Footer from './components/footer.jsx'
import { Themeprovider } from './context/theme.js'

function App() {
 
const [ thememode , setThememode] = useState("light")

function lightTheme(){
  setThememode("light")
}
function darkTheme(){
  setThememode("dark")
}
 
useEffect( () => {
  const ThemeChange = document.querySelector("html")
  ThemeChange.classList.remove("light" , "dark")
  ThemeChange.classList.add(thememode)
} , [thememode])

return (
    <Themeprovider  value = {{thememode , lightTheme , darkTheme }}>
       {/* <div className=" bg-white  dark:bg-gray-900 pb-4"></div> */}
   <WeatherChat/>
   <Footer/>
   </Themeprovider>
)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className=" bg-white  ">
    <App/>
    </div>
  </StrictMode>
)
