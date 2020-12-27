import React, { useEffect, useState } from 'react'
import ReactImageVideoLightbox from '../../library/react-image-video-lightbox'
import { data } from '../courses'
import './VideoGallery.css'

const videos = []

export default function VideoGallery () {
  const [index, setIndex] = useState(null)
  useEffect(() => {
    data.javascript.forEach(chapter => {
      chapter.courses.forEach(course => {
        videos.push({ url: `https://www.youtube.com/embed/${course.url}?&autoplay=1`, type: 'video', altTag: course.title })
      })
    })
    setTimeout(() => {
      // data.meteor.map()
    }, 600)
  }, [])
  return (
    <div className='container-fluid black_more' style={{ padding: 32, marginTop: 60 }}>
      <div className='row'>
        <div className='col-12'>
          All learning resources here are being provided courtesy of <b>Evented Mind</b> and have been produced around version 0.7 of Meteor.<br />
          They are a good source for learning Javascript and understanding Meteor, the templating system inside Meteor, routing with Iron Router, pub-sub, methods, server side best practices.
          For more modern frontend frameworks you may refer to other sources like <b>meteor.com</b>, <b>leveluptutorials.com</b>.
        </div>
        <div className='col-12 mt-5'>
          {(index || index === 0) &&
            <div style={{ height: '100%', position: 'fixed', zIndex: 1000, top: 0, right: 0, width: '100%' }}>
              <ReactImageVideoLightbox
                data={videos}
                startIndex={index}
                showResourceCount
                onCloseCallback={() => setIndex(null)}
              />
            </div>}
        </div>
      </div>
      <div className='row'>
        <div className='col-12 heading' style={{ position: 'relative' }}>
          <img src='/img/js.png' style={{ maxWidth: 42, verticalAlign: 'top' }}/> Javascript</div>
        {data.javascript.map((chapter, index) => {
          return (
            <div key={index} className='col-12 col-md-4 my-2'>
              <h5 className='font-weight-bold' style={{ color: '#ffc928' }}>{chapter.chapter}</h5>
              <ul style={{ padding: 0 }}>
                {chapter.courses.map((course, index) => <li style={styles.listItem} key={`x${index}`}>
                  <span style={{ color: '#fafafa' }} onClick={() => setIndex(course.index)}>{course.title}</span>
                </li>)}
              </ul>
            </div>
          )
        })}
      </div>

      <div className='row mt-5'>
        <div className='col-12 heading' style={{ position: 'relative' }}>
          <img src='/img/meteor.png' style={{ maxWidth: 42, verticalAlign: 'top' }}/> Meteor</div>
        {data.meteor.map((section, index) => {
          return (
            <div className='col-12 mt-4' key={`z${index}`}>
              <h5 style={{ color: 'rgb(223, 79, 79)', background: 'white', maxWidth: 160, padding: '2px 10px', fontWeight: 600, borderRadius: 2 }}>{section.section}</h5>
              <div className='row'>
                {section.chapters.map(chapter => {
                  return (
                    <div key={index} className='col-12 col-md-4 my-2'>
                      <h5 className='font-weight-bold' style={{ color: '#df4f4f' }}>{chapter.chapter}</h5>
                      <ul style={{ padding: 0 }}>
                        {chapter.courses.map((course, index) => <li style={styles.listItem} key={`x${index}`}>
                          <span style={{ color: '#fafafa' }} onClick={() => setIndex(course.index)}>{course.title}</span>
                        </li>)}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  listItem: {
    listStyle: 'none',
    cursor: 'pointer'
  }
}
