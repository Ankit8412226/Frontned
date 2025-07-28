import {
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useRef, useState } from 'react';

const VoiceChat = ({ onContentGenerated = null }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const recognitionRef = useRef(null);
  const speechSynthRef = useRef(null);

  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscription('');
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscription(transcript);

      // Add user message to conversation history
      setConversationHistory(prev => [...prev, {
        type: 'user',
        message: transcript,
        timestamp: new Date().toLocaleTimeString()
      }]);

      setIsProcessingVoice(true);
      await sendToAgent(transcript);
      setIsProcessingVoice(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const speakText = (text) => {
    // Stop any current speech
    if (speechSynthRef.current) {
      window.speechSynthesis.cancel();
    }

    if (!text || text.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to use a more natural voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice =>
      voice.name.includes('Google') ||
      voice.name.includes('Microsoft') ||
      voice.lang.startsWith('en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      speechSynthRef.current = null;
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      speechSynthRef.current = null;
    };

    speechSynthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    speechSynthRef.current = null;
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const cleanResponse = (text) => {
    // Remove JSON structure and Python markers
    let cleaned = text;

    // If it's a JSON string, try to parse it
    if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
      try {
        const parsed = JSON.parse(cleaned);
        if (parsed.reply) {
          cleaned = parsed.reply;
        }
      } catch (e) {
        console.log('Could not parse as JSON, using raw text');
      }
    }

    // Remove Python code markers
    cleaned = cleaned.replace(/<\|python_start\|>/g, '');
    cleaned = cleaned.replace(/<\|python_end\|>/g, '');

    // Remove other common markers
    cleaned = cleaned.replace(/```python/g, '');
    cleaned = cleaned.replace(/```/g, '');

    // Clean up extra whitespace
    cleaned = cleaned.trim();

    return cleaned;
  };

  const sendToAgent = async (text) => {
    try {
      const response = await fetch('https://ai-agent-frontend-production.up.railway.app/api/ai/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      // Handle different response formats
      let cleanedReply = '';

      if (data.reply) {
        cleanedReply = cleanResponse(data.reply);
      } else if (typeof data === 'string') {
        cleanedReply = cleanResponse(data);
      } else if (data.message) {
        cleanedReply = cleanResponse(data.message);
      } else {
        // If we can't find a standard field, try to extract text from the whole response
        cleanedReply = cleanResponse(JSON.stringify(data));
      }

      if (cleanedReply) {
        setAiResponse(cleanedReply);

        // Add AI response to conversation history
        setConversationHistory(prev => [...prev, {
          type: 'ai',
          message: cleanedReply,
          timestamp: new Date().toLocaleTimeString()
        }]);

        // Only call onContentGenerated if it's provided
        if (onContentGenerated) {
          onContentGenerated(cleanedReply, 'voice-chat');
        }

        // Automatically speak the response
        setTimeout(() => {
          speakText(cleanedReply);
        }, 500);
      } else {
        console.error('No valid response found in:', data);
        alert('Received an empty response from the assistant.');
      }
    } catch (err) {
      console.error('Error sending to agent:', err);
      alert('Something went wrong with the assistant.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-teal-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="bg-green-500 rounded-full p-1.5 sm:p-2">
              <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Voice Assistant</h3>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="text-center">
            <button
              onClick={isRecording ? stopRecognition : startRecognition}
              disabled={isProcessingVoice}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto mb-4 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                isRecording
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse'
                  : 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600'
              }`}
            >
              {isProcessingVoice ? (
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-white border-t-transparent"></div>
              ) : isRecording ? (
                <MicOff className="w-6 h-6 sm:w-8 sm:h-8" />
              ) : (
                <Mic className="w-6 h-6 sm:w-8 sm:h-8" />
              )}
            </button>

            <p className="text-sm sm:text-base font-medium text-gray-700 mb-2">
              {isProcessingVoice
                ? 'Processing your voice...'
                : isRecording
                  ? 'Listening... Click to stop'
                  : 'Click to start voice chat'}
            </p>

            <p className="text-xs text-gray-500 mt-3">
              Speak naturally about what content you need
            </p>
          </div>
        </div>
      </div>

      {/* Conversation History */}
      {conversationHistory.length > 0 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Conversation</h3>
          </div>

          <div className="p-4 sm:p-6 space-y-4 max-h-96 overflow-y-auto">
            {conversationHistory.map((item, index) => (
              <div key={index} className={`flex ${item.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs sm:max-w-md p-3 rounded-2xl ${
                  item.type === 'user'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${
                      item.type === 'user' ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      {item.type === 'user' ? 'You' : 'AI'}
                    </span>
                    {item.type === 'ai' && (
                      <button
                        onClick={() => speakText(item.message)}
                        className="text-gray-500 hover:text-gray-700 transition-colors ml-2"
                        title="Read aloud"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm">{item.message}</p>
                  <span className={`text-xs ${
                    item.type === 'user' ? 'text-green-100' : 'text-gray-400'
                  }`}>
                    {item.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isSpeaking && (
              <div className="flex justify-center">
                <div className="bg-blue-100 text-blue-700 px-3 py-2 rounded-full text-xs flex items-center">
                  <div className="animate-pulse mr-2">🔊</div>
                  AI is speaking...
                  <button
                    onClick={stopSpeaking}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <VolumeX className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceChat;
