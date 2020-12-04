import React from 'react'
import posed, { PoseGroup } from 'react-pose'
import { Router, Location, Redirect } from '@reach/router'
import Header from './menu/header'
import Home from './pages/home'

const RouteContainer = posed.div({
  enter: { opacity: 1, delay: 300, beforeChildren: 300 },
  exit: { opacity: 0, delay: 300, beforeChildren: 300 }
})

export const ScrollTop = ({ children, location }) => {
  React.useEffect(() => window.scrollTo(0, 0), [location.pathname])
  return children
}

const PosedRouter = ({ children }) => (
  <Location>
    {({ location }) => (
      <PoseGroup primary={false}>
        <RouteContainer key={location.key}>
          <Router location={location}>
            {children}
          </Router>
        </RouteContainer>
      </PoseGroup>
    )}
  </Location>
)

export default function App () {
  return (
    <div className='wraper'>
      <Header />
      <PosedRouter>
        <ScrollTop path='/'>
          <Home exact path='/'>
            <Redirect to='/home' />
          </Home>
        </ScrollTop>
      </PosedRouter>
    </div>
  )
}
