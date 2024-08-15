// src/SpeechRecognition.js
import React, { useState, useEffect } from 'react';

// 确保浏览器支持 SpeechRecognition
// @ts-ignore
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const SpeechRecognitionComponent = () => {
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US'); // 默认语言为英语
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    if (!SpeechRecognition) {
      alert('Speech Recognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.lang = language; // 设置语言
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Voice recognition started.');
    };

    recognition.onerror = (event: any) => {
    // 处理不同的错误类型
    console.error('Speech recognition error detected:', event.error);
    switch (event.error) {
      case 'no-speech':
        alert('No speech was detected. Please try again.');
        break;
      case 'aborted':
        alert('Speech recognition was aborted.');
        break;
      case 'audio-capture':
        alert('No microphone was found. Ensure that a microphone is connected.');
        break;
      case 'not-allowed':
        alert('Permission to use the microphone is denied.');
        break;
      case 'service-not-allowed':
        alert('The speech service is not allowed or not available.');
        break;
      default:
        alert('An unknown error occurred during speech recognition.');
    }
  };

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const handleLanguageChange = (event: any) => {
    setLanguage(event.target.value);
  };

  return (
    <div>
      <p>Notes: 请选择一个语种后，点击starting listening开始录音，然后点击stop listening后开始识别，识别结果会显示在Transcript后面。</p>
      <div style={{ marginBottom: "10px" }} >
        <label htmlFor="language">Select Language:</label>
        <select id="language" value={language} onChange={handleLanguageChange}>
          <option value="en-US">English</option>
          <option value="zh-CN">中文（简体）</option>
        </select>
      </div>
      
      
      <button onClick={toggleListening}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <div style={{ marginBottom: "10px" }}>Transcript: {transcript}</div>
    </div>
  );
};

export default SpeechRecognitionComponent;
