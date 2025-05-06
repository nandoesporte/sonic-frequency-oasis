
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
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.mobile - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.mobile)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < BREAKPOINTS.mobile)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useBreakpoint(breakpoint: BreakpointKey = 'mobile') {
  const [isBelow, setIsBelow] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS[breakpoint] - 1}px)`)
    
    const onChange = () => {
      setIsBelow(window.innerWidth < BREAKPOINTS[breakpoint])
    }
    
    mql.addEventListener("change", onChange)
    setIsBelow(window.innerWidth < BREAKPOINTS[breakpoint])
    
    return () => mql.removeEventListener("change", onChange)
  }, [breakpoint])

  return !!isBelow
}
