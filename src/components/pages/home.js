import React from 'react'
import posed from 'react-pose'
import Footer from '../components/footer'
import VideoGallery from '../components/VideoGallery'

const ListContainer = posed.div({
  enter: { staggerChildren: 20 },
  exit: { staggerChildren: 20, staggerDirection: 0 }
})

export default function Home () {
  return (
    <ListContainer>
      <VideoGallery />
      <Footer />
    </ListContainer>
  )
}
