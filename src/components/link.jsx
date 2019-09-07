import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

class Link extends Component {
  linkVisibility = v => {
    return v ? {} : { display: 'none' };
  };

  handleClick = e => {
    if (e.target.className === 'list-group-item') this.props.onClick();
  };

  render() {
    return (
      <li className="list-group-item" onClick={this.handleClick}>
        {this.props.link.url}
        <button className="btn btn-outline-primary btn-sm m-2">Share</button>
        <button className="btn btn-outline-danger btn-sm">Remove</button>
        {this.props.link.currentlyEditing ? (
          <button
            className="btn btn-outline-info btn-sm m-2"
            style={this.linkVisibility(this.props.link.isExpanded)}
            onClick={this.props.onSave}
          >
            Save
          </button>
        ) : (
          <button
            className="btn btn-outline-secondary btn-sm m-2"
            style={this.linkVisibility(this.props.link.isExpanded)}
            onClick={this.props.onEdit}
          >
            Edit Text
          </button>
        )}
        <div
          className="m-3"
          style={this.linkVisibility(this.props.link.isExpanded)}
        >
          {this.props.link.currentlyEditing ? (
            <textarea
              defaultValue={this.props.link.text}
              onChange={this.props.handleChange}
            />
          ) : (
            this.props.link.text
          )}
        </div>
        <div style={this.linkVisibility(this.props.link.isExpanded)}>
          {this.props.link.tags.map(tag => (
            <span key={tag} className="badge badge-dark badge-pill m-1">
              {tag}
              <FontAwesomeIcon
                icon={faTimes}
                style={{ marginLeft: '5px', fontSize: '10px' }}
              />
            </span>
          ))}
        </div>
      </li>
    );
  }
}

export default Link;
