import React, { Component } from 'react';
import './App.css';
import { toJS, decorate, observable } from "mobx"
import { observer } from "mobx-react"
import { action } from "mobx"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      store: []
    }
    this.createJSON = this.createJSON.bind(this)
    this.buildFromJSON = this.buildFromJSON.bind(this)
    this.input = React.createRef()
  }

  createJSON() {
    this.setState({
      store: toJS(store)
    })
  }

  buildFromJSON() {
    const items = JSON.parse(this.input.current.value)
    store.setItems(items)
  }

  render() {
    return (
      <div>
        <Container items={store.items} />
        <div style={{ margin: '15px' }}>
          <input type="text" ref={this.input} />
          <button type='button' onClick={this.buildFromJSON}>Build</button>
        </div>
        <div style={{ margin: '15px' }}>
          <pre>{JSON.stringify(this.state.store)}</pre>
          <button type='button' onClick={this.createJSON}>Create JSON</button>
        </div>
      </div>
    )
  }
}

App = observer(App)

const COLORS = ['orange', 'blue', 'red', 'black', 'yellow', 'green']


class Store {
  constructor(items) {
    this.items = items
  }

  changeColor(box) {
    console.log(box)
    // To avoid same colors
    var same = true
    while (same) {
      var color = COLORS[Math.floor(Math.random() * COLORS.length)]
      if (color !== box.color) {
        same = false
        box.color = color
      }
    }
  }

  setItems(store) {
    this.items = store.items
  }

  pushItem(item, type) {
    if (item) {
      if (type === 'box') {
        item.items.push({ type: 'box', color: 'orange' })
      } else if (type === 'container') {
        item.items.push({ type: 'container', items: [] })
      }
    } else {
      if (type === 'box') {
        this.items.push({ type: 'box', color: 'orange' })
      } else if (type === 'container') {
        this.items.push({ type: 'container', items: [] })
      }
    }
  }
}

const items = [
  { type: 'container', items: [{ type: "box", color: 'blue' }] },
  { type: "box", color: 'red' },
  { type: "box", color: 'green' },
]

decorate(Store, {
  items: observable,
  pushEmployee: action
})

const store = new Store(items)


class Container extends Component {

  renderChildren() {
    return this.props.items.map((item, index) => {
      if (item.type === 'box') {
        return (
          <Box item={item} key={index} />
        )
      } else if (item.type === 'container') {
        return (
          <Container item={item} items={item.items} key={index} />
        )
      } else {
        return null
      }
    })
  }

  render() {
    return (
      <div className='container'>
        {this.renderChildren()}
        <Button item={this.props.item} />
      </div>
    )
  }
}

Container = observer(Container)


class Box extends Component {

  render() {
    return (
      <div onClick={() => store.changeColor(this.props.item)} className='box' style={{ color: this.props.item.color}}>
      </div>
    )
  }
}

Box = observer(Box)


class Button extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tooltipVisible: false
    }
  }

  show() {
    this.setState({
      tooltipVisible: true
    })
  }

  hide() {
    this.setState({
      tooltipVisible: false
    })
  }

  render() {
    const display = this.state.tooltipVisible ? 'block' : 'none'
    return (
      <div className='button-group' onMouseEnter={this.show.bind(this)}
          onMouseLeave={this.hide.bind(this)}>
        <div onClick={() => { store.pushItem(this.props.item, 'box')}} className='tooltip-left' style={{display: display}}>Box</div>
        <div onClick={() => { store.pushItem(this.props.item, 'container') }} className='tooltip-right' style={{ display: display }}>Container</div>
        <button className='button'>Add</button>
      </div>
    )
  }
}

export default App
