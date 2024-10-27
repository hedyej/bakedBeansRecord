import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Button, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper ,ButtonGroup} from '@mui/material';
import Emoji from 'react-emojis';

const App = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [time, setTime] = useState(0);
  const [beanTemp, setBeanTemp] = useState('');
  const [recordName, setRecordName] = useState(`紀錄 - ${new Date().toLocaleString()}`);
  const [beanType, setBeanType] = useState('');
  const [beanWeight, setBeanWeight] = useState('');
  const [entryTemp, setEntryTemp] = useState('');
  const [records, setRecords] = useState([]);
  const [airValve, setAirValve] = useState('');
  const [powerLevel, setPowerLevel] = useState('');
  const [phaseRecord, setPhaseRecord] = useState({ 回溫: '', 爆點: '', 出鍋: '' });
  const [startTime, setStartTime] = useState(null);
  const phases = ["回溫", "爆點", "出鍋"];
  const [currentPhase, setCurrentPhase] = useState(phases[0]);
    const [selectedPhase, setSelectedPhase] = useState('豆溫');
    const beanTempInputRef = useRef(null);
  const focusOnBeanTempInput = () => {
      beanTempInputRef.current.focus();
  };

  useEffect(() => {
    if (isStarted && beanTempInputRef.current) {
      beanTempInputRef.current.focus();
    }
  }, [isStarted]); 
  

    useEffect(() => {
      let animationFrameId;
    
      if (isStarted && !isFinished) {
        const updateTime = () => {
          setTime(Math.floor((Date.now() - startTime) / 1000));
          animationFrameId = requestAnimationFrame(updateTime);
        };
        animationFrameId = requestAnimationFrame(updateTime);
      }
    
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }, [isStarted, isFinished, startTime]);
    
    const handleStart = () => {
      setIsStarted(true);
      setIsFinished(false);
      setRecords([]);
      setStartTime(Date.now());
      setTime(0);
      focusOnBeanTempInput();
    };
    
    const handleStop = () => {
      setIsStarted(false);
      setIsFinished(true);
    };
    
    // ... existing code ...

  const handleBeanTempSubmit = (e) => {
    e.preventDefault();
    if (beanTemp) {
      const newRecord = { 
        time, 
        temperature: parseFloat(beanTemp), 
        phase: currentPhase, 
        airValve, 
        powerLevel 
      };
      setRecords(prevRecords => [...prevRecords, newRecord]);
      
      // Save phase records in `phaseRecord` and proceed to next phase if applicable
      setPhaseRecord(prevPhaseRecord => ({
        ...prevPhaseRecord,
        [currentPhase]: beanTemp,
      }));
      setBeanTemp(''); // Clear input for next temperature

      const nextPhaseIndex = phases.indexOf(currentPhase) + 1;
      setCurrentPhase(nextPhaseIndex < phases.length ? phases[nextPhaseIndex] : phases[0]);
      focusOnBeanTempInput();
    }
  };

  const handleNewRoast = () => {
    setIsStarted(false);
    setIsFinished(false);
    setRecordName(`紀錄 - ${new Date().toLocaleString()}`);
    setBeanType('');
    setBeanWeight('');
    setEntryTemp('');
    setRecords([]);
    setTime(0);
    setPhaseRecord({ 回溫: '', 爆點: '', 出鍋: '' });
    setCurrentPhase(phases[0]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
return (
  <div style={{display: 'flex', flexDirection: 'column',alignItems:"center"}} >
    <Emoji emoji="hot-beverage" size="100" />
    <Typography variant="h4" style={{ marginTop: 24, marginBottom: 24 }}>
      烘豆溫度追蹤
    </Typography>


    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '400px',      backgroundColor: '#FAFAFA', }}>
      {!isStarted && !isFinished && (
        <>
          {/* Project Information Input Fields */}
          <TextField
            label="專案名稱"
            value={recordName}
            onChange={(e) => setRecordName(e.target.value)}
            fullWidth
          />
          <TextField
            label="生豆品名"
            value={beanType}
            onChange={(e) => setBeanType(e.target.value)}
            fullWidth
          />
          <TextField
            label="入豆量 (g)"
            type="number"
            value={beanWeight}
            onChange={(e) => setBeanWeight(e.target.value)}
            fullWidth
          />
          <TextField
            label="入豆溫 (°C)"
            type="number"
            value={entryTemp}
            onChange={(e) => setEntryTemp(e.target.value)}
            fullWidth
          />
          <Button onClick={handleStart} variant="contained" color="primary" fullWidth size="large">
            開始烘豆
          </Button>
        </>
      )}

      {isStarted && (
        <>
          <Typography variant="h2" align="center" fontWeight={500}>
            {formatTime(time)}
          </Typography>
          <ButtonGroup variant="outlined" aria-label="Basic button group" style={{ marginBottom: '16px', width: '100%' }}>
            <Button 
              onClick={() => setSelectedPhase('豆溫')}
              variant={selectedPhase === '豆溫' ? 'contained' : 'outlined'}
              size="large" // 設置按鈕大小
              fullWidth // 使按鈕全寬
            >
              豆溫
            </Button>
            <Button 
              onClick={() => setSelectedPhase('回溫')}
              variant={selectedPhase === '回溫' ? 'contained' : 'outlined'}
              size="large" // 設置按鈕大小
              fullWidth // 使按鈕全寬
            >
              回溫
            </Button>
            <Button 
              onClick={() => setSelectedPhase('爆點')}
              variant={selectedPhase === '爆點' ? 'contained' : 'outlined'}
              size="large" // 設置按鈕大小
              fullWidth // 使按鈕全寬
            >
              爆點
            </Button>
            <Button 
              onClick={() => setSelectedPhase('出鍋')}
              variant={selectedPhase === '出鍋' ? 'contained' : 'outlined'}
              size="large" // 設置按鈕大小
              fullWidth // 使按鈕全寬
            >
              出鍋
            </Button>
          </ButtonGroup>
          <form onSubmit={handleBeanTempSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <TextField
              inputRef={beanTempInputRef}
              label={`${selectedPhase} (°C)`}
              type="number"
              value={beanTemp}
              onChange={(e) => setBeanTemp(e.target.value)}
              fullWidth
            />
            <TextField
              label="風門"
              type="number"
              value={airValve}
              onChange={(e) => setAirValve(e.target.value)}
              fullWidth
            />
            <TextField
              label="火力"
              type="number"
              value={powerLevel}
              onChange={(e) => setPowerLevel(e.target.value)}
              fullWidth
            />
            <Button type="submit" variant="outlined" fullWidth size="large" onClick={focusOnBeanTempInput}> {/* 設置按鈕大小 */}
              紀錄
            </Button>
          </form>
          <Typography variant="body2" color="textSecondary">
            已記錄 {records.length} 個溫度點
          </Typography>
          <Button onClick={handleStop} variant="contained" color="primary" fullWidth size="large">
            結束烘豆
          </Button>
        </>
      )}

    </div>

    {isFinished && (
      <div style={{ width: '100%', padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' ,  }}>
        <Button onClick={handleNewRoast} variant="contained" color="primary" size="large"  style={{ marginBottom: '24px' }}>
          開始新的烘豆
        </Button>
        <TableContainer component={Paper} style={{ marginTop: '20px', width: '100%', maxWidth: '400px', maxHeight: '400px', overflowY: 'auto' }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>記錄名稱</TableCell>
                <TableCell>{recordName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>生豆品名</TableCell>
                <TableCell>{beanType}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>入豆量 (g)</TableCell>
                <TableCell>{beanWeight}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>入豆溫 (°C)</TableCell>
                <TableCell>{entryTemp}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>回溫 (°C)</TableCell>
                <TableCell>{phaseRecord.回溫}°C</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>爆點 (°C)</TableCell>
                <TableCell>{phaseRecord.爆點}°C</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>出鍋 (°C)</TableCell>
                <TableCell>{phaseRecord.出鍋}°C</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper} style={{ marginTop: '20px', width: '100%', maxWidth: '400px', maxHeight: '400px', overflowY: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>時間</TableCell>
                <TableCell>豆溫 (°C)</TableCell>
                <TableCell>風門</TableCell>
                <TableCell>火力</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{formatTime(record.time)}</TableCell>
                  <TableCell>{record.temperature}°C</TableCell>
                  <TableCell>{record.airValve}</TableCell>
                  <TableCell>{record.powerLevel}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )}
{isFinished && records.length > 0 && (
  <div style={{ width: '100%', marginTop: '20px', maxWidth: '400px', padding: '24px 0' }}>
    <Typography variant="h6" align="center">烘豆溫度曲線</Typography>
    <Paper 
      style={{ 
        height: '240px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        marginTop: '20px', 
        overflowX: 'auto', // Enable horizontal scroll
        width: '100%',
        maxWidth: '400px',
      }}
    >
      <div style={{ width: '900px' }}> {/* Inner div to keep chart width */}
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
            label={{ value: '豆溫 (°C)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            labelFormatter={formatTime}
            formatter={(value) => [`${value}°C`, '豆溫']}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="temperature" 
            stroke="#6F4C3E" 
            name="豆溫"
            dot={{ r: 6 }}
          />
        </LineChart>
      </div>
    </Paper>
  </div>
)}

  </div>
);
  
};

export default App;

