import { AnimatePresence, motion, Transition, Variants } from "framer-motion"
import React, { FC, useEffect, useState } from "react"

const transition = { type: 'tween', duration: 0.4, ease: 'easeInOut' }

const variants: Record<string, Variants | Record<string, Variants>> = {
  wrapper: {
    hidden: { y: '-100%',transition: { ...transition, staggerChildren: 0.1, when: 'afterChildren' } as Transition },
    visible: { y: '0%', transition: { ...transition } }
  },
  E: {
    hidden: { fillOpacity: 0.5, translateX: -100, transition },
    visible: { fillOpacity: 1, translateX: 0, transition }
  },
  N: {
    hidden: { fillOpacity: 0.5, translateX: -50, translateY: -100, transition },
    visible: { fillOpacity: 1, translateX: 0, translateY: 0, transition }
  },
  Z: {
    hidden: { fillOpacity: 0.5, translateX: -100, translateY: 50, transition },
    visible: { fillOpacity: 1, translateX: 0, translateY: 0, transition }
  },
  O1: {
    hidden: { fillOpacity: 0.5, scale: 1.4, transition },
    visible: { fillOpacity: 1, scale: 1, transition }
  },
  O2: {
    hidden: { fillOpacity: 0.5, scale: 0, transition },
    visible: { fillOpacity: 1, scale: 1, transition }
  }
}

export const Welcome: FC = () => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    setTimeout(() => setShow(false), 1000)
  }, [])

  return <AnimatePresence initial={false}>
    { show && <motion.div key="wrapper" variants={variants.wrapper} initial="hidden" animate="visible" exit="hidden" className="bg-red w-screen h-screen absolute left-0 right-0 flex items-center justify-center">
      <svg className="overflow-hidden" width="433" height="116" viewBox="0 0 433 116" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="clip-e"><rect x="9" y="9" width="97" height="97" fill="#C4C4C4"/></clipPath>
          <clipPath id="clip-n"><rect x="114" y="9" width="97" height="97" fill="#C4C4C4"/></clipPath>
          <clipPath id="clip-z"><rect x="220" y="9" width="97" height="97" fill="#C4C4C4"/></clipPath>
          <clipPath id="clip-o"><rect x="325" y="9" width="97" height="97" fill="#C4C4C4"/></clipPath>
        </defs>
        <g style={{ clipPath: 'url(#clip-e)', animation: '0.3s 0.2s both fadeIn ease-out' }}>
          <motion.path variants={variants.E} d={paths.E1} fill="white"/>
          <motion.path variants={variants.E} d={paths.E2} fill="white"/>
          <motion.path variants={variants.E} d={paths.E3} fill="white"/>
        </g>
        <g style={{ clipPath: 'url(#clip-n)', animation: '0.3s 0.3s both fadeIn ease-out' }}>
          <motion.path variants={variants.N} d={paths.N1} fill="white"/>
          <motion.path variants={variants.N} d={paths.N2} fill="white"/>
          <motion.path variants={variants.N} d={paths.N3} fill="white"/>
        </g>
        <g style={{ clipPath: 'url(#clip-z)', animation: '0.3s 0.4s both fadeIn ease-out' }}>
          <motion.path variants={variants.Z} d={paths.Z1} fill="white"/>
          <motion.path variants={variants.Z} d={paths.Z2} fill="white"/>
          <motion.path variants={variants.Z} d={paths.Z3} fill="white"/>
        </g>
        <g style={{ clipPath: 'url(#clip-o)', animation: '0.3s 0.5s both fadeIn ease-out' }}>
          <motion.g variants={variants.O1}>
            <motion.path d={paths.O1} fill="white"/>
            <motion.path d={paths.O2} fill="white"/>
            <motion.path d={paths.O3} fill="white"/>
            <motion.path d={paths.O4} fill="white"/>
          </motion.g>
          <motion.path variants={variants.O2} d={paths.O5} fill="white"/>
        </g>
      </svg>
    </motion.div> }
  </AnimatePresence>
}

const paths = {
   E1: "M103.225 35.1666C104.878 35.1666 106.219 33.8287 106.225 32.1763V12.9912C106.22 11.3384 104.879 9.99994 103.225 9.99994H13.7247C12.0678 9.99994 10.7247 11.3431 10.7247 12.9999V32.1666C10.7247 33.8235 12.0678 35.1666 13.7247 35.1666H103.225Z",
   E2: "M106.225 48.157V67.343C106.219 68.9954 104.878 70.3333 103.225 70.3333H13.7247C12.0678 70.3333 10.7247 68.9901 10.7247 67.3333V48.1666C10.7247 46.5098 12.0678 45.1666 13.7247 45.1666H103.225C104.878 45.1666 106.219 46.5046 106.225 48.157Z",
   E3: "M103.225 105.5C104.879 105.5 106.22 104.162 106.225 102.509V83.3236C106.219 81.6712 104.878 80.3333 103.225 80.3333H13.7247C12.0678 80.3333 10.7247 81.6765 10.7247 83.3333V102.5C10.7247 104.157 12.0678 105.5 13.7247 105.5H103.225Z",
   N1: "M116.225 102.509L116.225 102.5L116.225 26.1803L155.885 105.5L119.225 105.5C117.571 105.5 116.229 104.162 116.225 102.509Z",
   N2: "M206.023 100.908C207.021 102.903 205.57 105.25 203.34 105.25H168.479C167.342 105.25 166.303 104.608 165.795 103.592L121.045 14.0917C120.048 12.097 121.498 9.75006 123.729 9.75006H158.59C159.726 9.75006 160.765 10.3921 161.273 11.4084L206.023 100.908Z",
   N3: "M258.023 100.908C259.021 102.903 257.57 105.25 255.34 105.25H220.478C219.342 105.25 218.303 104.608 217.795 103.592L173.045 14.0917L170.827 9.75006H175.728H210.59C211.726 9.75006 212.765 10.3921 213.273 11.4084L258.023 100.908Z",
   Z1: "M221 51.6153L225.342 49.2986L314.842 4.54861C315.858 4.04044 316.5 3.00164 316.5 1.86533V0H240.8L222.658 9.07058C221.642 9.57876 221 10.6175 221 11.7539L221 51.6153Z",
   Z2: "M226.342 100.489C224.347 101.486 222 100.036 222 97.8057L222 62.9442C222 61.8079 222.642 60.7691 223.658 60.261L313.158 15.511C315.153 14.5136 317.5 15.9641 317.5 18.1942V53.0557C317.5 54.192 316.858 55.2308 315.842 55.739L226.342 100.489Z",
   Z3: "M317.225 65.8401L237.905 105.5L314.225 105.5C315.877 105.5 317.218 104.163 317.225 102.512L317.225 65.8401Z",
   O1: "M330.225 9.99994C328.568 9.99994 327.225 11.3431 327.225 12.9999V25.2592C331.309 19.2677 336.492 14.0847 342.484 9.99994H330.225Z",
   O2: "M327.225 90.2407V102.5L327.225 102.512C327.231 104.163 328.572 105.5 330.225 105.5H342.484C336.492 101.415 331.309 96.2322 327.225 90.2407Z",
   O3: "M422.725 102.5V90.2407C418.64 96.2322 413.457 101.415 407.465 105.5H419.725C421.382 105.5 422.725 104.157 422.725 102.5Z",
   O4: "M422.725 25.2592V12.9999C422.725 11.3431 421.382 9.99995 419.725 9.99995L407.465 9.99995C413.457 14.0847 418.64 19.2677 422.725 25.2592Z",
   O5: "M327.225 57.7499C327.225 84.1104 348.585 105.482 374.941 105.5L375.008 105.5C401.364 105.482 422.725 84.1104 422.725 57.7499C422.725 31.3783 401.346 9.99994 374.975 9.99994C348.603 9.99994 327.225 31.3783 327.225 57.7499Z",
   mask: "M432.725 115.5V1.40667e-05L0.72467 0L0.724688 115.5L432.725 115.5ZM222.843 99.8925C223.705 100.778 225.092 101.114 226.342 100.489L315.842 55.739C316.858 55.2308 317.5 54.192 317.5 53.0557V18.1942C317.5 17.2203 317.052 16.3951 316.382 15.8575C315.52 14.9718 314.132 14.6364 312.883 15.261L237.905 52.75H238.68L223.658 60.261C222.642 60.7691 222 61.8079 222 62.9442V64.4928C221.823 64.8752 221.725 65.301 221.725 65.75V97.5557C221.725 98.5296 222.172 99.3549 222.843 99.8925ZM221.725 49.6598L301.044 9.99997L224.725 9.99996C223.068 9.99996 221.725 11.3431 221.725 13V49.6598ZM327.225 13C327.225 11.3431 328.568 9.99997 330.225 9.99997L342.484 9.99997C336.492 14.0847 331.309 19.2677 327.225 25.2592V13ZM327.225 102.5V90.2407C331.309 96.2322 336.492 101.415 342.484 105.5H330.225C328.572 105.5 327.231 104.163 327.225 102.512L327.225 102.5ZM374.941 105.5C348.585 105.482 327.225 84.1104 327.225 57.75C327.225 31.3784 348.603 9.99998 374.975 9.99998C401.346 9.99998 422.725 31.3784 422.725 57.75C422.725 84.1104 401.364 105.482 375.008 105.5L374.941 105.5ZM422.725 90.2407V102.5C422.725 104.157 421.382 105.5 419.725 105.5H407.465C413.457 101.415 418.64 96.2323 422.725 90.2407ZM422.725 13V25.2592C418.64 19.2677 413.457 14.0847 407.465 9.99998L419.725 9.99998C421.382 9.99998 422.725 11.3431 422.725 13ZM237.905 105.5L317.225 65.8402L317.225 102.512C317.218 104.163 315.877 105.5 314.225 105.5L237.905 105.5ZM211.725 89.3196L172.065 9.99998L208.725 9.99998C210.382 9.99998 211.725 11.3431 211.725 13V89.3196ZM116.225 102.5L116.225 102.509C116.229 104.162 117.571 105.5 119.225 105.5L155.885 105.5L116.225 26.1803L116.225 102.5ZM171.968 105.5C171.544 105.499 171.14 105.41 170.774 105.25H168.479C167.342 105.25 166.303 104.608 165.795 103.592L121.045 14.0917C120.048 12.097 121.498 9.75006 123.729 9.75006H158.59C159.726 9.75006 160.765 10.3921 161.273 11.4084L168.975 26.8112V26.1803L206.464 101.158C207.461 103.153 206.011 105.5 203.78 105.5H171.975L171.968 105.5ZM106.225 102.509C106.22 104.162 104.879 105.5 103.225 105.5H13.7247C12.0678 105.5 10.7247 104.157 10.7247 102.5V83.3334C10.7247 81.6765 12.0678 80.3334 13.7247 80.3334H103.225C104.878 80.3334 106.219 81.6713 106.225 83.3237V102.509ZM106.225 67.343V48.157C106.219 46.5046 104.878 45.1667 103.225 45.1667H13.7247C12.0678 45.1667 10.7247 46.5098 10.7247 48.1667V67.3333C10.7247 68.9902 12.0678 70.3333 13.7247 70.3333H103.225C104.878 70.3333 106.219 68.9954 106.225 67.343ZM106.225 32.1763C106.219 33.8287 104.878 35.1666 103.225 35.1666H13.7247C12.0678 35.1666 10.7247 33.8235 10.7247 32.1666V13C10.7247 11.3431 12.0678 9.99998 13.7247 9.99998H103.225C104.879 9.99998 106.22 11.3384 106.225 12.9913V32.1763Z"
}
