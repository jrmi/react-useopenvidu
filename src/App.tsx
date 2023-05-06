import { useState, useCallback } from 'react';
import { OpenViduProvider, StreamList } from './lib/index.js';
import './App.css';

const OPENVIDU_SERVER_URL = 'http://localhost:4443';
const OPENVIDU_SERVER_SECRET = 'MY_SECRET';

const createSession = (sessionId: string) => {
  return new Promise((resolve, reject) => {
    fetch(`${OPENVIDU_SERVER_URL}/openvidu/api/sessions`, {
      method: 'POST',
      body: JSON.stringify({ customSessionId: sessionId }),
      headers: {
        Authorization: 'Basic ' + btoa(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`),
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 409) {
          resolve(sessionId);
        } else {
          response.json().then((data) => {
            resolve(data.id);
          });
        }
      })
      .catch((error) => {
        console.warn(
          'No connection to OpenVidu Server. This may be a certificate error at ' +
            OPENVIDU_SERVER_URL
        );
        reject(error);
      });
  });
};

const createToken = (sessionId: string) => {
  return fetch(
    `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${sessionId}/connection`,
    {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        Authorization: 'Basic ' + btoa(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`),
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data.token;
    });
};

const getToken = (session: string) => {
  return createSession(session).then((sessionId) =>
    createToken(sessionId as string)
  );
};

const uuid = () => Math.random().toString(36).slice(-6);

function App() {
  const room = 'test';
  const [userId] = useState(() => uuid());
  const currentUser = useState(() => ({ name: 'toto', uid: userId }));

  const getUserData = useCallback(() => {
    return JSON.stringify({ name: 'toto', color: 'blue', uid: userId });
  }, [userId]);

  const filterUsers = useCallback(
    (user: any) => {
      return user.uid !== userId;
    },
    [userId]
  );

  const [showLocalVideo, setShowLocalVideo] = useState(true);
  const [showLocalAudio, setShowLocalAudio] = useState(true);

  return (
    <OpenViduProvider
      room={room}
      parseUserData={JSON.parse}
      getUserData={getUserData}
      getToken={getToken}
    >
      <StreamList
        currentUser={currentUser}
        filterUsers={filterUsers}
        setLocalAudio={setShowLocalAudio}
        setLocalVideo={setShowLocalVideo}
        enableLocalVideo={showLocalVideo}
        enableLocalAudio={showLocalAudio}
      />
    </OpenViduProvider>
  );
}

export default App;
