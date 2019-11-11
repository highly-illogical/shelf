import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

class Tag extends Component {
  render() {
    const { isLoggedIn } = this.props;
    return (
      <span className="badge badge-dark badge-pill m-1">
        {this.props.tag}
        {isLoggedIn && (
          <FontAwesomeIcon
            icon={faTimes}
            style={{ marginLeft: '5px', fontSize: '10px', cursor: 'pointer' }}
            onClick={this.props.onRemove}
          />
        )}
      </span>
    );
  }
}

export default Tag;
