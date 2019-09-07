import React, { Component } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

class AddLink extends Component {
  render() {
    return (
      <InputGroup>
        <FormControl placeholder="Enter link here" />
        <InputGroup.Append>
          <Button variant="info" onClick={() => alert('hi')}>
            Add
          </Button>
        </InputGroup.Append>
      </InputGroup>
    );
  }
}

export default AddLink;
