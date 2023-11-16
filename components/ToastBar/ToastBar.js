import React from 'react';
import { Toaster, ToastBar as HotToastBar } from 'react-hot-toast';

const ToastBar = function ToastBar() {
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

export default ToastBar;
