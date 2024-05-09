// IntegrateGitButton.js
import axios from 'axios';
import React from 'react';
import './IntegrateGitButton.css';

const IntegrateGitButton = () => {
  const handleClick = () => {
    console.log('Integrating Git...');
    window.open('http://localhost:3000/Login');   
  };

  return (
    <button className="integrate-git-button" onClick={handleClick}>
      Integrate Git
    </button>
  );
};

export default IntegrateGitButton;