import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import styles from './assets/Header.module.css';

class Header extends Component {
  render() {
    const { isLoggedIn, handleLogin, handleLogout } = this.props;
    return (
      <div className="header">
        {!isLoggedIn ? (
          <button className="btn btn-danger btn-sm mb-4" onClick={handleLogin}>
            <FontAwesomeIcon icon={faGoogle} style={{ marginRight: '10px' }} />
            Sign in with Google
          </button>
        ) : (
          <button className="btn btn-link btn-sm mb-4" onClick={handleLogout}>
            Sign Out
          </button>
        )}
      </div>
    );
  }
}

export default Header;
