import React from 'react';
import { OpenViduContext } from './OpenViduProvider';

const useOpenVidu = () => {
  return React.useContext(OpenViduContext);
};

export default useOpenVidu;
