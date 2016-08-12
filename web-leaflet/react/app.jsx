/* global fetch */

import L from 'leaflet'
import esri from 'esri-leaflet'
import geocoding from 'esri-leaflet-geocoder'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

const markers = new L.FeatureGroup()
let map = null

// https://github.com/Leaflet/Leaflet/issues/766
L.Icon.Default.imagePath = 'https://cdn.jsdelivr.net/leaflet/1.0.0-rc.3/images/'

class App extends Component {
  constructor (props) {
    super(props)

    // intial property values for the object that dynamically controls what is displayed in our card
    this.state = {
      match: '',
      score: '',
      locator: '',
      region: '',
      notFound: ''
    }

    this.addressSearch = this.addressSearch.bind(this)
  }

  render () {
    return (<div>
      <div id='app'>
        <SearchBox addressSearch={this.addressSearch} />
        <Card data={this.state} />
      </div>
      <div id='map' />
    </div>)
  }

  // geocode user input
  addressSearch (location) {
    geocoding.geocode()
      .text(location)
      .run(function (err, body, response) {
        if (err) console.log(err)
        markers.clearLayers()
        if (body.results[0]) {
          let bestMatch = body.results[0]
          markers.addLayer(L.marker(bestMatch.latlng))
          map.fitBounds(bestMatch.bounds)
        
          // update state with API data
          this.setState({
            match: bestMatch.text,
            score: bestMatch.score,
            locator: bestMatch.properties.Loc_name,
            region: bestMatch.properties.Region,
            notFound: 'Found'
          })
        } else {
          this.setState({
            notFound: 'Not Found'
          })
          map.setView([0, 0], 2)
        }
      }, this)
  }

  componentDidMount () {
    // once everythings wired up, lets create our map and add a basemap
    map = L.map('map').setView([0, 0], 2)
    esri.basemapLayer('Gray').addTo(map)
    map.addLayer(markers)
  }
}

class SearchBox extends Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  render () {
    // stuff the input search box and submit button into the DOM
    return (<form
      className='searchbox'
      onSubmit={this.handleClick}>
      <input
        ref='search'
        className='searchbox__input'
        type='text'
        placeholder='type an address or location...' />

      <input
        type='submit'
        className='searchbox__button'
        value='Where to?' />
    </form>)
  }

  handleClick (e) {
    e.preventDefault()
    let location = this.refs.search.value
    // sending the address to Esri's World Geocoding service
    this.props.addressSearch(location)
    this.refs.search.value = ''
  }
}

SearchBox.propTypes = {
  fetchUser: React.PropTypes.func
}

class Card extends Component {
  render () {
    // bind what is displayed to the data thats passed
    let data = this.props.data
    if (data.notFound === 'Not Found') {
      // when no candidates are returned
      return <h3 className='card__notfound'>No match found. Try again!</h3>
    }
    if (!data.match) {
      // initial value
      return <h3 className='card__notfound'>Type in an address or point of interest to get started</h3>
    }
    // when a matching candidate is returned
    return (<div className='card'>
      <h2 className='card__match'>
        <p>{data.match}</p></h2>
      <dl>
        <dt>Score</dt>
        <dd>{data.score}</dd>

        <dt>Region</dt>
        <dd>{data.region}</dd>

        <dt>Locator Used</dt>
        <dd>{data.locator}</dd>
      </dl>
    </div>)
  }
}

Card.propTypes = {
  data: React.PropTypes.object
}

ReactDOM.render(<App />, document.getElementById('react-app'))
