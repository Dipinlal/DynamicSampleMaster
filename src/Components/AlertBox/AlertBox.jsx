import React from 'react';
import './alertBox.css'; // Make sure to create a corresponding CSS file

const Alert = ({ message, show ,color }) => {
  if (!show) return null;

  return (
    <div style={{backgroundColor:`${color}`}} className="custom-alertBox">
      {message}
    </div>
  );
};

export default Alert;
