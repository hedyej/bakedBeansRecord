import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Button, Typography, TextField} from '@mui/material';
import Emoji from 'react-emojis';
const App = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [time, setTime] = useState(0);
  const [temperature, setTemperature] = useState('');
  const [records, setRecords] = useState([]);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const handleStart = () => {
    setIsStarted(true);
    setIsFinished(false);
    setRecords([]);
    setTime(0);
    const id = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
    setIntervalId(id);
  };

  const handleStop = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setIsStarted(false);
    setIsFinished(true);
  };

  const handleTemperatureSubmit = (e) => {
    e.preventDefault();
    if (temperature) {
      const newRecord = { time, temperature: parseFloat(temperature) };
      setRecords(prevRecords => [...prevRecords, newRecord]);
      setTemperature('');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      height: '100vh', 
      padding: '20px',
    }}>
      <Emoji emoji="hot-beverage" size="100"/>    
        <Typography variant="h3" style={{marginTop:24,marginBottom:24,}}>
        烘豆溫度追蹤
      </Typography>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '400px' }}>
        {!isStarted && !isFinished && (
          <Button onClick={handleStart} variant="contained" color="primary" fullWidth size="large">
            開始烘豆
          </Button>
        )}

        {isStarted && (
          <>
            <Typography variant="h4" align="center">
              {formatTime(time)}
            </Typography>
            <form onSubmit={handleTemperatureSubmit} style={{ display: 'flex', gap: '8px' }}>
  <TextField
    type="number"
    value={temperature}
    onChange={(e) => setTemperature(e.target.value)}
    placeholder="輸入溫度 (°C)"
    fullWidth
    size="small"
  />
  <Button type="submit" variant="outlined">
    紀錄
  </Button>
</form>

            <Typography variant="body2" color="textSecondary">
              已記錄 {records.length} 個溫度點
            </Typography>
            <Button onClick={handleStop} variant="contained" color="primary" size="large">
              結束烘豆
            </Button>
          </>
        )}

        {isFinished && (
          <>
            <Button onClick={handleStart} variant="contained" color="primary" size="large">
              開始新的烘豆
            </Button>
            {records.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <Typography variant="subtitle1">記錄點：</Typography>
                {records.map((record, index) => (
                  <Typography key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>時間：{formatTime(record.time)}</span>
                    <span>溫度：{record.temperature}°C</span>
                  </Typography>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {isFinished && records.length > 0 && (
        <div style={{ width: '100%', marginTop: '20px', maxWidth: '400px' }}>
          <Typography variant="h6">烘豆溫度曲線</Typography>
          <div style={{ height: '240px' ,display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            <LineChart
              width={900}
              height={240}
              data={records}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                tickFormatter={formatTime}
                label={{ value: '時間', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: '溫度 (°C)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                labelFormatter={formatTime}
                formatter={(value) => [`${value}°C`, '溫度']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#6F4C3E" 
                name="溫度"
                dot={{ r: 6 }}
                
              />
            </LineChart>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
