import React from 'react'
import { TiChevronRight, TiTimes, TiChevronLeft } from 'react-icons/ti'
import * as utils from './utils'

const MIN_SCALE = 1
const MAX_SCALE = 4
const SETTLE_RANGE = 0.001
const ADDITIONAL_LIMIT = 0.2
const DOUBLE_TAP_THRESHOLD = 300
const ANIMATION_SPEED = 0.04
const RESET_ANIMATION_SPEED = 0.08
const INITIAL_X = 0
const INITIAL_Y = 0
const INITIAL_SCALE = 1
const MOBILE_ICON_SIZE = 35
const DESKTOP_ICON_SIZE = 50

class ReactImageVideoLightbox extends React.Component {
  constructor () {
    super(...arguments)

    this.state = {
      x: INITIAL_X,
      y: INITIAL_Y,
      scale: INITIAL_SCALE,
      width: window.innerWidth,
      height: window.innerHeight,
      index: this.props.startIndex,
      swiping: false,
      loading: true,
      iconSize: window.innerWidth <= 500 ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE
    }

    this.width = window.innerWidth
    this.height = window.innerHeight
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.handleTouchEnd = this.handleTouchEnd.bind(this)
    this.onNavigationCallback = this.props.onNavigationCallback && typeof this.props.onNavigationCallback === 'function'
      ? this.props.onNavigationCallback
      : () => { }
  }

  zoomTo (scale) {
    const frame = () => {
      if (this.state.scale === scale) return null

      const distance = scale - this.state.scale
      const targetScale = this.state.scale + (ANIMATION_SPEED * distance)

      this.zoom(utils.settle(targetScale, scale, SETTLE_RANGE))
      this.animation = window.requestAnimationFrame(frame)
    }

    this.animation = window.requestAnimationFrame(frame)
  }

  reset () {
    const frame = () => {
      if (this.state.scale === INITIAL_SCALE && this.state.x === INITIAL_X && this.state.y === INITIAL_Y) return null

      const scaleDelta = INITIAL_SCALE - this.state.scale
      const targetScale = utils.settle(this.state.scale + (RESET_ANIMATION_SPEED * scaleDelta), INITIAL_SCALE, SETTLE_RANGE)

      const nextWidth = this.width * targetScale
      const nextHeight = this.height * targetScale

      this.setState({
        scale: targetScale,
        width: nextWidth,
        height: nextHeight,
        x: INITIAL_X,
        y: INITIAL_Y
      }, () => {
        this.animation = window.requestAnimationFrame(frame)
      })
    }

    this.animation = window.requestAnimationFrame(frame)
  }

  handleTouchStart (event) {
    this.animation && window.cancelAnimationFrame(this.animation)
    if (event.touches.length === 2) this.handlePinchStart(event)
    if (event.touches.length === 1) this.handleTapStart(event)
  }

  handleTouchMove (event) {
    if (event.touches.length === 2) this.handlePinchMove(event)
    if (event.touches.length === 1) this.handlePanMove(event)
  }

  handleTouchEnd (event) {
    if (event.touches.length > 0) return null

    if (this.state.scale > MAX_SCALE) return this.zoomTo(MAX_SCALE)
    if (this.state.scale < MIN_SCALE) return this.zoomTo(MIN_SCALE)

    if (this.lastTouchEnd && this.lastTouchEnd + DOUBLE_TAP_THRESHOLD > event.timeStamp) {
      this.reset()
    }

    if (this.state.swiping && this.state.scale === 1) {
      this.handleSwipe(event)
    }

    this.lastTouchEnd = event.timeStamp
  }

  handleSwipe (event) {
    const swipeDelta = event.changedTouches[0].clientX - this.swipeStartX
    if (swipeDelta < -(this.width / 3)) {
      this.swipeRight(event.target)
    } else if (swipeDelta > (this.width / 3)) {
      this.swipeLeft(event.target)
    } else {
      this.reset()
    }
  }

  swipeLeft () {
    const currentIndex = this.state.index
    if (currentIndex > 0) {
      setTimeout(() => {
        this.setState({
          index: currentIndex - 1,
          swiping: false,
          x: INITIAL_X,
          loading: true
        }, () => this.onNavigationCallback(currentIndex - 1))
      }, 500)
    } else {
      this.reset()
    }
  }

  swipeRight () {
    const currentIndex = this.state.index
    if (currentIndex < (this.props.data.length - 1)) {
      setTimeout(() => {
        this.setState({
          index: currentIndex + 1,
          swiping: false,
          x: INITIAL_X,
          loading: true
        }, () => this.onNavigationCallback(currentIndex + 1))
      }, 500)
    } else {
      this.reset()
    }
  }

  handleTapStart (event) {
    this.swipeStartX = event.touches[0].clientX
    this.swipeStartY = event.touches[0].clientY
    if (this.state.scale === 1) {
      this.setState({
        swiping: true
      })
    }
  }

  handlePanMove (event) {
    if (this.state.scale === 1) {
      this.setState({
        x: event.touches[0].clientX - this.swipeStartX
      })
    } else {
      event.preventDefault()
      this.setState({
        x: event.touches[0].clientX - this.swipeStartX,
        y: event.touches[0].clientY - this.swipeStartY
      })
    }
  }

  handlePinchStart (event) {
    const pointA = utils.getPointFromTouch(event.touches[0])
    const pointB = utils.getPointFromTouch(event.touches[1])
    this.lastDistance = utils.getDistanceBetweenPoints(pointA, pointB)
  }

  handlePinchMove (event) {
    event.preventDefault()
    const pointA = utils.getPointFromTouch(event.touches[0])
    const pointB = utils.getPointFromTouch(event.touches[1])
    const distance = utils.getDistanceBetweenPoints(pointA, pointB)
    const scale = utils.between(MIN_SCALE - ADDITIONAL_LIMIT, MAX_SCALE + ADDITIONAL_LIMIT, this.state.scale * (distance / this.lastDistance))
    this.zoom(scale)
    this.lastDistance = distance
  }

  zoom (scale) {
    const nextWidth = this.width * scale
    const nextHeight = this.height * scale

    this.setState({
      width: nextWidth,
      height: nextHeight,
      scale
    })
  }

  getResources () {
    const items = []
    const data = this.props.data
    for (let i = 0; i < data.length; i++) {
      const resource = data[i]
      if (resource.type === 'photo') {
        items.push(<img
          key={i}
          alt={resource.altTag}
          src={resource.url}
          style={{
            pointerEvents: this.state.scale === 1 ? 'auto' : 'none',
            maxWidth: '100%',
            maxHeight: '100%',
            transform: `translate(${this.state.x}px, ${this.state.y}px) scale(${this.state.scale})`,
            transition: 'transform 0.5s ease-out'
          }}
          onLoad={() => { this.setState({ loading: false }) }}
        />)
      }

      if (resource.type === 'video') {
        items.push(<iframe
          key={i}
          width='80%'
          height='80%'
          src={resource.url}
          frameBorder='0'
          allow='autoplay; encrypted-media'
          title={resource.title}
          alt={resource.altTag}
          allowFullScreen
          style={{
            pointerEvents: this.state.scale === 1 ? 'auto' : 'none',
            maxWidth: '100%',
            maxHeight: '100%',
            transform: `translate(${this.state.x}px, ${this.state.y}px)`,
            transition: 'transform 0.5s ease-out'
          }}
          onLoad={() => { this.setState({ loading: false }) }}
        />)
      }
    }

    return items
  }

  componentDidMount () {
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 500) {
        this.setState({ iconSize: MOBILE_ICON_SIZE })
      } else {
        this.setState({ iconSize: DESKTOP_ICON_SIZE })
      }
    })
  }

  componentWillUnmount () {
    window.removeEventListener('resize', () => {
      if (window.innerWidth <= 500) {
        this.setState({ iconSize: MOBILE_ICON_SIZE })
      } else {
        this.setState({ iconSize: DESKTOP_ICON_SIZE })
      }
    })
  }

  render () {
    const resources = this.getResources()
    return (
      <div
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
        style={{
          top: '0px',
          left: '0px',
          overflow: 'hidden',
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          height: '100%',
          width: '100%',
          backgroundColor: 'rgba(0,0,0,1)'
        }}
      >

        {
          this.props.showResourceCount &&
            <div
              style={{
                position: 'absolute',
                top: '0px',
                left: '0px',
                padding: '15px',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              <span>{this.state.index + 1}</span> / <span>{this.props.data.length}</span>
            </div>
        }

        <button
          className='btn' type='button'
          style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
            padding: '10px',
            color: '#FFFFFF',
            cursor: 'pointer',
            fontSize: `${this.state.iconSize * 0.8}px`
          }}
          onClick={this.props.onCloseCallback}
        ><TiTimes />
        </button>

        <button
          className='btn noSelect' type='button'
          style={{
            position: 'absolute',
            left: '0px',
            zIndex: 1,
            color: '#FFFFFF',
            cursor: 'pointer',
            fontSize: `${this.state.iconSize}px`
          }}
          onClick={() => { this.swipeLeft() }}
        ><TiChevronLeft />
        </button>

        <button
          className='btn noSelect' type='button'
          style={{
            position: 'absolute',
            right: '0px',
            zIndex: 1,
            color: '#FFFFFF',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: `${this.state.iconSize}px`
          }}
          onClick={() => { this.swipeRight() }}
        ><TiChevronRight />
        </button>

        {
          this.state.loading &&
            <div
              style={{
                position: 'absolute',
                color: '#FFFFFF'
              }}
            >Loading ...
            </div>
        }

        {
          resources[this.state.index]
        }
      </div>
    )
  }
}

export default ReactImageVideoLightbox
