import React, { useMemo } from 'react';

import useOpenVidu from './useOpenVidu';

import LocalStream from './LocalStream';
import RemoteStream from './RemoteStream';

const defaultFilter = (streams) => {
  return streams;
};

const StreamList = ({
  currentUser,
  filterStream = defaultFilter,
  audioOnly = false,
  enableLocalVideo = false,
  enableLocalAudio = true,
  setLocalVideo = () => {},
  setLocalAudio = () => {},
}) => {
  const { remoteStreams = [], localStream } = useOpenVidu();

  const filteredStream = useMemo(() => {
    return filterStream(remoteStreams);
  }, [filterStream, remoteStreams]);

  return (
    <div className='stream-list'>
      {localStream && (
        <div className='local-stream'>
          <LocalStream
            stream={localStream}
            video={enableLocalVideo && !audioOnly}
            audio={enableLocalAudio}
            user={currentUser}
          />
          <div className='actions'>
            {!audioOnly && (
              <button
                onClick={() => setLocalVideo((prev) => !prev)}
                className={enableLocalVideo ? 'active' : ''}
              >
                {enableLocalVideo ? 'v' : '!v'}
              </button>
            )}
            <button
              onClick={() => setLocalAudio((prev) => !prev)}
              className={enableLocalAudio ? 'active' : ''}
            >
              {enableLocalAudio ? 'a' : '!a'}
            </button>
          </div>
        </div>
      )}
      {filteredStream.map((stream) => (
        <div key={stream.data.uid} className='remote-stream'>
          <RemoteStream stream={stream} user={stream.data} />
        </div>
      ))}
    </div>
  );
};

export default StreamList;
