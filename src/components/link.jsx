import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Tag from './tag';

class Link extends Component {
  linkVisibility = v => {
    return v ? {} : { display: 'none' };
  };

  handleClick = e => {
    if (e.target.className === 'main-link') this.props.onClick();
  };

  handleAddTag = () => {
    this.props.addTag(this.tagRef.current.value);
    this.tagRef.current.value = '';
  };

  openShareWindow = () => {
    window.open('https://www.facebook.com/sharer.php?u=' + this.props.link.url);
  };

  tagRef = React.createRef();

  render() {
    const {
      isLoggedIn,
      link,
      onEdit,
      onSave,
      onRemove,
      handleChange,
      removeTag
    } = this.props;
    return (
      <li className="list-group-item" onClick={this.handleClick}>
        <div className="main-link" style={{ cursor: 'pointer' }}>
          <a
            style={{ color: 'rgb(33, 37, 41)', textDecoration: 'none' }}
            href={link.url}
            target="_blank"
          >
            {link.url}
          </a>
          <button
            className="btn btn-outline-primary btn-sm m-2"
            onClick={this.openShareWindow}
          >
            Share
          </button>
          {isLoggedIn && (
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={onRemove}
            >
              Remove
            </button>
          )}
          {isLoggedIn &&
            (link.currentlyEditing ? (
              <button
                className="btn btn-outline-info btn-sm m-2"
                style={this.linkVisibility(link.isExpanded)}
                onClick={onSave}
              >
                Save
              </button>
            ) : (
              <button
                className="btn btn-outline-secondary btn-sm m-2"
                style={this.linkVisibility(link.isExpanded)}
                onClick={onEdit}
              >
                Edit Text
              </button>
            ))}
        </div>
        <div className="m-3" style={this.linkVisibility(link.isExpanded)}>
          {link.currentlyEditing ? (
            <textarea
              className="form-control m-2"
              style={{ fontSize: '14.5px' }}
              value={link.text}
              onChange={handleChange}
            />
          ) : (
            <div
              style={{
                margin: '10px 10px 20px 20px',
                fontSize: '14.5px',
                color: 'rgb(90, 90, 90)'
              }}
            >
              {link.text}
            </div>
          )}
        </div>
        <div
          className="form-inline"
          style={this.linkVisibility(link.isExpanded)}
        >
          {this.props.link.tags.map((tag, index) => (
            <Tag key={index} tag={tag} onRemove={() => removeTag(index)} />
          ))}
          {isLoggedIn && (
            <div className="input-group" style={{ margin: '0 0 0 10px' }}>
              <input
                type="text"
                ref={this.tagRef}
                className="form-control form-control-sm"
                placeholder="Add tags..."
                style={{ fontSize: '12px' }}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-light btn-sm"
                  onClick={this.handleAddTag}
                  style={{
                    borderColor: 'lightgrey',
                    color: '#b0b0b0',
                    fontSize: '10px'
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
          )}
        </div>
      </li>
    );
  }
}

export default Link;
