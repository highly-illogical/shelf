import React, { Component } from 'react';
import Link from './components/link';

class App extends Component {
  state = {
    links: []
  };

  toggleLink = id => {
    this.setState({
      links: this.state.links.map(link => {
        if (link._id === id) link.isExpanded = !link.isExpanded;
        return link;
      })
    });
  };

  removeLink = id => {
    const newLinks = [...this.state.links];
    const linkToRemove = newLinks.find(link => link._id === id);

    fetch('http://localhost:8080/api/bookmarks/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(linkToRemove)
    });

    this.setState({
      links: newLinks.filter(link => link._id !== id)
    });
  };

  editText = id => {
    this.setState({
      links: this.state.links.map(link => {
        if (link._id === id) link.currentlyEditing = true;
        return link;
      })
    });
  };

  saveText = id => {
    this.setState({
      links: this.state.links.map(link => {
        if (link._id === id) {
          link.currentlyEditing = false;
        }
        return link;
      })
    });
  };

  handleChange = id => e => {
    this.setState({
      links: this.state.links.map(link => {
        if (link._id === id) {
          link.text = e.target.value;
        }
        return link;
      })
    });
  };

  addTag = id => tagName => {
    this.setState({
      links: this.state.links.map(link => {
        if (link._id === id) {
          link.tags.push(tagName);
        }
        return link;
      })
    });
  };

  removeTag = id => tagId => {
    this.setState({
      links: this.state.links.map(link => {
        if (link._id === id) {
          link.tags.splice(tagId, 1);
        }
        return link;
      })
    });
  };

  exampleRef = React.createRef();

  addLink = e => {
    e.preventDefault();
    const newLinks = [...this.state.links].reverse();

    const newLink = {
      url: this.exampleRef.current.value,
      text: '(No text)',
      tags: [],
      isExpanded: false,
      currentlyEditing: false
    };

    if (newLinks.find(link => link.url === newLink.url) !== undefined)
      alert('This link is already in the list');
    else {
      fetch('http://localhost:8080/api/bookmarks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newLink)
      })
        .then(response => response.json())
        .then(json => (newLink._id = json._id))
        .catch(error => alert('Something went wrong'));

      newLinks.push(newLink);

      this.setState({
        links: newLinks.reverse()
      });

      this.exampleRef.current.value = '';
    }
  };

  componentDidMount() {
    fetch('http://localhost:8080/api/bookmarks/all')
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.setState({ links: json.reverse() });
      })
      .catch(error => alert('Something went wrong'));
  }

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
              key={link._id}
              link={link}
              onClick={() => this.toggleLink(link._id)}
              onEdit={() => this.editText(link._id)}
              onSave={() => this.saveText(link._id)}
              onRemove={() => this.removeLink(link._id)}
              handleChange={this.handleChange(link._id)}
              addTag={this.addTag(link._id)}
              removeTag={this.removeTag(link._id)}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
