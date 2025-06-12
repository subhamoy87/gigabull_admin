import React from 'react';
import './MessageBox.css'; // You'll need to create this CSS file

const MessageBox = ({ message }) => {
  if (!message.text) return null;

  return (
    <div className={`message-box ${message.type}`}>
      {message.text}
    </div>
  );
};

export default MessageBox;