
import * as React from "react"

// More flexible breakpoint system
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280
}

type BreakpointKey = keyof typeof BREAKPOINTS

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.mobile)
    }
    
    // Initial check
    checkMobile()
    
    // Add resize listener
    window.addEventListener('resize', checkMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return !!isMobile
}

export function useBreakpoint(breakpoint: BreakpointKey = 'mobile') {
  const [isBelow, setIsBelow] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkBreakpoint = () => {
      setIsBelow(window.innerWidth < BREAKPOINTS[breakpoint])
    }
    
    // Initial check
    checkBreakpoint()
    
    // Add resize listener
    window.addEventListener('resize', checkBreakpoint)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkBreakpoint)
  }, [breakpoint])

  return !!isBelow
}
