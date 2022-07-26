import React, { useEffect, useMemo, useRef } from 'react';
import styles from './App.module.scss';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log(canvasRef.current);
  }, []);

  return useMemo(() => {
    return <div className={styles.app}>
      <canvas ref={canvasRef} className={styles.appCanvas}></canvas>
    </div>
  }, [])
}

export default App;
