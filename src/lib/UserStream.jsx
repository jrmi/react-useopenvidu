import React from 'react';
import Stream from './Stream';

const UserStream = ({ stream, name, color, audio, video, self = false }) => {
  const classes = ['ov-user-stream'];
  if (!audio) {
    classes.push('ov-user-stream--no-audio');
  }
  if (!video) {
    classes.push('ov-user-stream--no-video');
  }
  return (
    <div className={classes.join(' ')}>
      <Stream stream={stream} />
      {!self && (
        <span className='name' style={{ backgroundColor: color }}>
          {name}
        </span>
      )}
    </div>
  );
};

export default UserStream;
