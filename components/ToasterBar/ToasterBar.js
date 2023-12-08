import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToasterBar = function ToasterBar() {
  return (
    <div>
      <Toaster
        position='top-center'
        containerStyle={{ top: '64px', bottom: '96px' }}
        reverseOrder={true}
      ></Toaster>
    </div>
  );
};

export default ToasterBar;
