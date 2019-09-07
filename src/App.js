import React, { Component } from 'react';
import Link from './components/link';

class App extends Component {
  state = {
    links: [
      {
        id: 1,
        url: 'http://www.google.com',
        text: 'Lorem ipsum dolor sit amet',
        tags: ['politics', 'marxism'],
        isExpanded: false,
        currentlyEditing: false
      },
      {
        id: 2,
        url: 'http://www.facebook.com',
        text: 'Hello world',
        tags: ['books'],
        isExpanded: false,
        currentlyEditing: false
      },
      {
        id: 3,
        url: 'http://twitter.com',
        text: '(No text)',
        tags: ['the guardian', 'left'],
        isExpanded: false,
        currentlyEditing: false
      }
    ]
  };

  toggleLink = id => {
    this.setState({
      links: this.state.links.map(link => {
        if (link.id === id) link.isExpanded = !link.isExpanded;
        return link;
      })
    });
  };

  editText = id => {
    this.setState({
      links: this.state.links.map(link => {
        if (link.id === id) link.currentlyEditing = true;
        return link;
      })
    });
  };

  saveText = id => {
    this.setState({
      links: this.state.links.map(link => {
        if (link.id === id) {
          link.currentlyEditing = false;
        }
        return link;
      })
    });
  };

  handleChange = id => e => {
    this.setState({
      links: this.state.links.map(link => {
        if (link.id === id) {
          link.text = e.target.value;
        }
        return link;
      })
    });
  };

  render() {
    return (
      <div className="container" style={{ fontFamily: 'Roboto' }}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter link here"
          />
          <div className="input-group-append">
            <button className="btn btn-info">Add</button>
          </div>
        </div>
        <ul className="list-group">
          {this.state.links.map(link => (
            <Link
              key={link.id}
              link={link}
              onClick={() => this.toggleLink(link.id)}
              onEdit={() => this.editText(link.id)}
              onSave={() => this.saveText(link.id)}
              handleChange={this.handleChange(link.id)}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
