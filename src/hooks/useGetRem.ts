// useGetRem.ts
import {useMediaQuery} from "react-responsive";
import {useState, useEffect} from "react";

export const useGetRem = () => {
  const mobileScreen = useMediaQuery({maxWidth: 660});
  const [rem, setRem] = useState(() =>
      typeof window !== 'undefined'
          ? window.document.documentElement.clientWidth / (mobileScreen ? 390 : 1024)
          : 0
  );

  useEffect(() => {
    const handleResize = () => {
      const newRem = document.documentElement.clientWidth / (mobileScreen ? 390 : 1024)
      setRem(prev => Math.abs(prev - newRem) > 0.01 ? newRem : prev)
    }

    const timer = setTimeout(handleResize, 100)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timer)
    }
  }, [])

  return rem
}