import React from 'react'

export default function Footer () {
  return (
    <footer className='container-fluid black_more'>
      <div className='subfooter'>
        <div className='row m-10-hor'>
          <div className='col-md-6'>
            <div className='content'>© Copyrights 2020 <span className='font-weight-bold'>Evented Mind</span> All rights reserved.</div>
          </div>
          <div className='col-md-6'>
            <div className='content-right'>
              Made with
              <span style={{ color: 'red' }}> ❤ </span>
              for <a href='https://github.com/Meteor-Community-Packages' style={{ color: 'white', fontWeight: 600 }}>The Meteor Community</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
