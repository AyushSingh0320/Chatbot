import { createContext , useContext } from "react";


export const ThemeContext = createContext({
    thememode : "light",
    lightTheme(){},
    darkTheme(){}
})


 export const Themeprovider = ThemeContext.Provider 

 export function useTheme(){
    return useContext(ThemeContext)
 }