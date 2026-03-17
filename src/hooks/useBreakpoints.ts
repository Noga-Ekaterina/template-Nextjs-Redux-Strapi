import {useMediaQuery} from "react-responsive";

export const useBreakpoints = () => {
  const isMobile = useMediaQuery({maxWidth: 660});
  const isTablet = useMediaQuery({minWidth: 661, maxWidth: 1023});
  const isLaptop = useMediaQuery({minWidth: 1024, maxWidth: 1919});
  const isDesktop = useMediaQuery({minWidth: 1920, maxWidth: 2559});
  const isBigDesktop = useMediaQuery({minWidth: 2560});

  return { isMobile, isTablet, isLaptop, isDesktop, isBigDesktop };
};