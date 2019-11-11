import React, { Component } from 'react';
import Link from './components/Link';
import Header from './components/Header';
import firebaseConfig from './config/firebaseConfig';

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const linkRef = db.ref('links');

class App extends Component {
  state = {
    isLoggedIn: false,
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
    linkRef.child(id).remove();
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
    let newText = this.state.links.find(link => link._id === id).text;
    linkRef.child(id).update({ text: newText });
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
    let newTags = this.state.links.find(link => link._id === id).tags;
    newTags.push(tagName);
    linkRef.child(id).update({ tags: newTags });
  };

  removeTag = id => tagId => {
    let newTags = this.state.links.find(link => link._id === id).tags;
    newTags.splice(tagId, 1);
    linkRef.child(id).update({ tags: newTags });
  };

  linkItemRef = React.createRef();

  addLink = e => {
    e.preventDefault();

    const newLink = {
      url: this.linkItemRef.current.value,
      text: '(No text)',
      tags: []
    };

    if (this.state.links.find(link => link.url === newLink.url) !== undefined)
      alert('This link is already in the list');
    else {
      linkRef.push(newLink);
    }
    this.linkItemRef.current.value = '';
  };

  handleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        this.setState({ isLoggedIn: true });
        console.log(result);
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log(error);
      });
  };

  handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        console.log('User signed out.');
        this.setState({ isLoggedIn: false });
      })
      .catch(function(error) {
        // An error happened.
        console.log(error);
      });
  };

  componentDidMount() {
    // Get links from Firebase and update state

    linkRef.on(
      'value',
      data => {
        // If there's no data, Firebase automatically deletes the parent ref.
        // Check for the existence of the snapshot before proceeding.

        if (data.exists()) {
          let response = data.val();
          let links = Object.keys(response).map(key => {
            const link = {};
            link._id = key;
            link.url = response[key].url;
            link.text = response[key].text;
            link.tags =
              response[key].tags === undefined ? [] : response[key].tags;
            link.currentlyEditing = false;

            let currentLink = this.state.links.find(link => link._id === key);
            link.isExpanded =
              currentLink === undefined ? false : currentLink.isExpanded;
            return link;
          });
          links.reverse();
          this.setState({ links });
        } else {
          this.setState({ links: [] });
        }
      },
      errData
    );

    function errData(err) {
      console.log(err);
    }
  }

  render() {
    const { isLoggedIn } = this.state;

    return (
      <React.Fragment>
        <Header
          isLoggedIn={isLoggedIn}
          handleLogin={this.handleLogin}
          handleLogout={this.handleLogout}
        />
        <div
          className="container"
          style={{ fontFamily: 'Roboto', fontSize: '15px', marginTop: '50px' }}
        >
          {isLoggedIn && (
            <div className="input-group">
              <input
                type="text"
                ref={this.linkItemRef}
                className="form-control"
                placeholder="Enter link here"
              />
              <div className="input-group-append">
                <button className="btn btn-info" onClick={this.addLink}>
                  Add
                </button>
              </div>
            </div>
          )}
          <ul className="list-group">
            {this.state.links.map(link => (
              <Link
                key={link._id}
                isLoggedIn={isLoggedIn}
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
      </React.Fragment>
    );
  }
}

export default App;
