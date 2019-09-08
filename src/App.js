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

  removeLink = id => {
    this.setState({
      links: this.state.links.filter(link => link.id !== id)
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

  addTag = id => tagName => {
    this.setState({
      links: this.state.links.map(link => {
        if (link.id === id) {
          link.tags.push(tagName);
        }
        return link;
      })
    });
  };

  removeTag = id => tagId => {
    this.setState({
      links: this.state.links.map(link => {
        if (link.id === id) {
          link.tags.splice(tagId, 1);
        }
        return link;
      })
    });
  };

  exampleRef = React.createRef();

  addLink = e => {
    e.preventDefault();
    const newLink = {
      id: this.state.links.length + 1,
      url: this.exampleRef.current.value,
      text: '(No text)',
      tags: [],
      isExpanded: false,
      currentlyEditing: false
    };

    const newLinks = [...this.state.links];
    newLinks.push(newLink);

    this.setState({
      links: newLinks
    });

    this.exampleRef.current.value = '';
  };

  render() {
    return (
      <div
        className="container"
        style={{ fontFamily: 'Roboto', fontSize: '15px', marginTop: '50px' }}
      >
        <div className="input-group">
          <input
            type="text"
            ref={this.exampleRef}
            className="form-control"
            placeholder="Enter link here"
          />
          <div className="input-group-append">
            <button className="btn btn-info" onClick={this.addLink}>
              Add
            </button>
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
              onRemove={() => this.removeLink(link.id)}
              handleChange={this.handleChange(link.id)}
              addTag={this.addTag(link.id)}
              removeTag={this.removeTag(link.id)}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
