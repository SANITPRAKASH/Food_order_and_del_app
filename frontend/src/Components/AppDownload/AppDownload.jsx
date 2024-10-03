import React from 'react'
import './AppDownload.css'
import { assets } from '../../assets/frontend_assets/assets'

const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
        <p className='pforbetter'>
          For Better Experience Download  <br /><br />
          <span className='flaming-text'> Spank The Pan</span><p>app</p>
        </p>
        <div className="app-download-platforms">
            <img src={assets.play_store} alt="Play Store" />
            <img src={assets.app_store} alt="App Store" />
        </div>
        <br />
    </div>
    
   
  )
}

export default AppDownload
