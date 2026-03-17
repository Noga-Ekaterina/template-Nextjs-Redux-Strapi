import { useGetRem } from "@/hooks/useGetRem";
import {useCallback} from "react";
import {useMediaQuery} from "react-responsive";

export const useGetHashPosition=()=>{
  const rem= useGetRem()
  const mobileScreen =useMediaQuery({maxWidth: 1024})

  return useCallback((hash: string)=>{
    const el= document.getElementById(hash.slice(1))
    if (!el) return window.scrollY

    const {top} = el.getBoundingClientRect()

    return top - 48 * rem * (mobileScreen? 1.3:1)
  }, [rem])
}

