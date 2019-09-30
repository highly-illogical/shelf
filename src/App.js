import React, { Component } from 'react';
import Link from './components/link';
import firebaseConfig from './config/firebaseConfig';

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const linkRef = db.ref('links');

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

    // Remove link in Firebase

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

          // Update record in Firebase

          return link;
        }
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

          // Update record in Firebase

          return link;
        }
      })
    });
  };

  removeTag = id => tagId => {
    this.setState({
      links: this.state.links.map(link => {
        if (link._id === id) {
          link.tags.splice(tagId, 1);

          // Update record in Firebase

          return link;
        }
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
      const data = (({ url, text, tags }) => ({ url, text, tags }))(newLink);
      linkRef.push(data);

      // Get new list of links

      newLinks.push(newLink);

      this.setState({
        links: newLinks.reverse()
      });

      this.exampleRef.current.value = '';
    }
  };

  componentDidMount() {
    // Get links from Firebase and update state

    linkRef.on(
      'value',
      data => {
        let response = data.val();
        let links = Object.keys(response).map(key => {
          const link = {};
          link._id = key;
          link.url = response[key].url;
          link.tags =
            response[key].tags === undefined ? [] : response[key].tags;
          return link;
        });
        console.log(links);
        this.setState({ links });
      },
      errData
    );

    function errData(err) {
      console.log(err);
    }
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
