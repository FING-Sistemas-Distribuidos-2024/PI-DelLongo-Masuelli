import axios from 'axios';
import './App.css';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useState, useCallback, useEffect } from 'react';


function App() {
	const [message, setMessage] = useState('');
	const [user, setUser] = useState('');
	const [receivedMessage, setReceivedMessage] = useState('');
	//const [socketUrl, setSocketUrl] = useState('ws://10.230.50.3:5000/');
	const [socketUrl, setSocketUrl] = useState('ws://localhost:8000/');
	//const socketUrl = 'ws://localhost:5000/';

	const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
	const [messageHistory, setMessageHistory] = useState([]);

	const handleSendMessage = () => sendMessage(`${user}: ${message}`);

	const handleReceiveMessage = () => { };

	const handleMessageInput = (e) => {
		setMessage(e.target.value);
	}

	const handleUserInput = (e) => {
		setUser(e.target.value);
	}

	useEffect(() => {
		if (lastMessage !== null) {
			setMessageHistory((prev) => prev.concat(lastMessage));
			console.log(lastMessage);
		}
	}, [lastMessage]);

	return (
		<div className="App">
			<h1>Redis Messaging App</h1>
			<div>
				<input
					type="text"
					value={user}
					onChange={handleUserInput}
					placeholder="Type your name..."
				/>
				<input
					type="text"
					value={message}
					onChange={handleMessageInput}
					placeholder="Enter your message."
				/>
				<button onClick={handleSendMessage}>Send Message</button>
			</div>
			<div>
				<div className='messages'>
					{
						messageHistory.map((message) =>
							<p>{message.data}</p>
						)
					}
				</div>
			</div>
		</div>
	);
}

export default App;
