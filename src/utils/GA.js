import ReactGA from 'react-ga4'

const GA_MEASUREMENT_ID = 'G-N7550XQFPH'  

export const initGA = () => {
  ReactGA.initialize(GA_MEASUREMENT_ID)
}

export const sendPageView = (path) => {
  ReactGA.send({ hitType: 'pageview', page: path })
}
