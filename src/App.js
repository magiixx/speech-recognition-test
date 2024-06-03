import React, { useState, useEffect } from 'react';

const VoiceToText = () => {
  const [text, setText] = useState('');
  const [interim, setInterim] = useState('');
  const [status, setStatus] = useState('');
  const [recognition, setRecognition] = useState(null);

  const getInstance = () => {
    const SpeechRecognition = window?.SpeechRecognition || window?.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const instance = new SpeechRecognition();
      instance.continuous = true;
      instance.interimResults = true;
    

      instance.onstart = () => {
        console.log("starting listening, speak in microphone");
        setStatus('RECORDING');
      };
  
      instance.onspeechend = () => {
        console.log("stopped listening");
        setStatus('');
        instance.stop();
      };
  
      instance.onresult = (event) => {
        const current = event.resultIndex;
        const isFinal = event.results[current].isFinal;
        const transcript = event.results[current][0].transcript;
        const mobileRepeatBug = (current === 1 && transcript === event.results[0][0].transcript);
  
        if (!mobileRepeatBug) {
          if(isFinal) {
            setText((prevText) => prevText + transcript);
            setInterim('');
          } else {
            setInterim(transcript);
          }
        }
      };
  
      instance.onerror = (event) => {
        if (event.error === 'no-speech') {
          setStatus('NO_SPEECH');
        }
      };
  
      return instance
    }
  }

  useEffect(() => {
    const instance = getInstance();
    if (instance) {
      setRecognition(instance)
    }
  }, []);

  const handleClick = () => {
    console.log("clicked microphone");
    if(status !== 'RECORDING') {
      recognition.start();
    } else {
      recognition.stop();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <input
        type="text"
        value={`${text} ${interim ? `${interim}...` : ''}`}
        onChange={(e) => setText(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', fontSize: '16px', width: '80%' }}
      />
      <button onClick={handleClick} style={{ padding: '5px 10px', fontSize: '16px' }}>
        {status === 'RECORDING' ? 'Stop Recording' : 'Record Voice'}
      </button>
     {status === 'NO_SPEECH' && <p style={{ marginTop: '10px', fontSize: '14px', color: 'red' }}>No speech detected.</p>}
    </div>
  );
};

export default VoiceToText;
