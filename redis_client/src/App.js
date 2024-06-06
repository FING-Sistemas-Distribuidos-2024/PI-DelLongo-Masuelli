import React, {useState} from 'react';
import axios from 'axios';
import './App.css';

function App() {
	const [message, setMessage] = useState('');
	const [receivedMessage, setReceivedMessage] = useState('');

	const socket = new WebSocket("ws://localhost:9001");
	socket.onopen = ({data}) => {
		console.log('Conectado al servidor de websocket.');
	};

	socket.onmessage = ({data}) => {
		handleReceiveMessage().then(r => console.log('Mensaje recibido:', r));
	};

	async function handleSendMessage() {
		try {
			// ip del backend
			// const response = await axios.post('http://10.230.50.4:5000/send', {message});
			const response = await axios.post('http://localhost:5000/send', {message});
			alert(response.data.status);
		} catch (error) {
			console.error('Error sending message:', error);
		}
	}

	async function handleReceiveMessage() {
		try {
			// const response = await axios.get('http://10.230.50.4:5000/receive');
			const response = await axios.get('http://localhost:5000/receive');
			// Append the new message to the existing messages, separated by a newline
			setReceivedMessage(prevMessages => `${prevMessages}\nReceived Message: ${response.data.message}`);
		} catch (error) {
			console.error('Error receiving message:', error);
		}
	}

	return (
		<div className="App">
			<h1>Redis Messaging App</h1>
			<div>
				<input
					type="text"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="Enter your message."
				/>
				<button onClick={handleSendMessage}>Send Message</button>
			</div>
			<div>
				<button onClick={handleReceiveMessage}>Receive Message</button>
				<textarea
					value={`Received Message: ${receivedMessage}`}
					readOnly
					style={{width: '100%', height: '200px'}}
				/>
			</div>
		</div>
	);
}

export default App;
