import React, { useEffect, useState } from 'react';
import PatternLock from 'react-pattern-lock';
import './lockscreen.css';

export default function LockScreen({ onClose }) {
  const [path, setPath] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [savedPattern, setSavedPattern] = useState(null); 
  const [error, setError] = useState(null);

  const reset = () => {
    setDisabled(false);
    setPath([]);
    setError(null); 
  };

  const handleFinish = () => {
    if (!savedPattern) {
      if (path.length < 5) {
        setError('Pattern should contain at least 5 dots!');
        return;
      }
      const newPattern = path.join(',');
      setSavedPattern(newPattern);
      const lockData = {
        savedPattern: newPattern,
        status: true,
      };
      localStorage.setItem('lockData', JSON.stringify(lockData));

      setDisabled(true);
      setError('Pattern saved successfully!');
      reset();
    } else {
      if (path.join(',') === savedPattern) {
        setError('Pattern matched! Unlocking...');
        setTimeout(() => {
          onClose();
          const unlockData = {
            savedPattern,
            status: false,
          };
          localStorage.setItem('lockData', JSON.stringify(unlockData));
        }, 1000);
      } else {
        setError('Incorrect pattern. Please try again.');
      }
    }
  };

  useEffect(() => {
    const lockData = localStorage.getItem('lockData');
    if (lockData) {
      const parsedData = JSON.parse(lockData);
      setSavedPattern(parsedData.savedPattern);
    }
  }, []);

  return (
    <div className="container">
      <div className="content">
        <PatternLock
          path={path}
          width={300}
          size={3}
          disabled={disabled}
          onChange={(path) => setPath(path)}
          onFinish={handleFinish}
          style={{
            margin: '0 auto',
          }}
        />
        {error && <p className="error-message">{error}</p>}
        <p>Pattern output: {path.join(', ')}</p>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
