import React from 'react'
import { setDefaultBreakpoints } from 'react-socks'
import { Link } from '@reach/router'
// import useOnclickOutside from "react-cool-onclickoutside";

setDefaultBreakpoints([
  { xs: 0 },
  { l: 1199 },
  { xl: 1200 }
])

const NavLink = props => (
  <Link
    {...props}
    getProps={({ isCurrent }) => {
      // the object returned here is passed to the
      // anchor element's props
      return {
        className: isCurrent ? 'active' : 'non-active'
      }
    }}
  />
)

export default function Header () {
  return (
    <header id='myHeader' className='navbar'>
      <div className='container-fluid'>
        <div className='row m-2-hor w-100-nav'>
          <div className='logo'>
            <div className='navbar-title navbar-item'>
              <NavLink to='/'>
                <img src='./img/learnmeteor-sm.png' className='img-fluid' alt='#' style={{ maxWidth: 80, padding: 6 }} />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
