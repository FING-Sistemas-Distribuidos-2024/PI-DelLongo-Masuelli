import './App.css';
import useWebSocket from 'react-use-websocket';
import {useEffect, useState} from 'react';


function App() {
	const [message, setMessage] = useState('');
	const [user, setUser] = useState('');
	const [receivedMessage, setReceivedMessage] = useState('');
	const [socketUrl, setSocketUrl] = useState('ws://localhost:5000/');
	// const [socketUrl, setSocketUrl] = useState('ws://10.230.50.3:5000/');

	const {sendMessage, lastMessage, readyState} = useWebSocket(socketUrl);
	const [messageHistory, setMessageHistory] = useState([]);

	const handleSendMessage = () => {
		if (user === '') {
			sendMessage(`Anonymous: ${message}`);
			return;
		}
		sendMessage(`${user}: ${message}`);
	}

	const handleMessageInput = (e) => {
		setMessage(e.target.value);
	}

	const handleUserInput = (e) => {
		setUser(e.target.value);
	}

	const handleReceivedMessage = (e) => {
		setReceivedMessage(e.target.value);
	}

	useEffect(() => {
		let is_array = false
		let msg;
		if (lastMessage !== null) {
			console.log("Last message: ", lastMessage.data);
			try {
				msg = JSON.parse(lastMessage.data);
				setMessageHistory((prev) => prev.concat(msg));
			} catch (e) {
				setMessageHistory((prev) => prev.concat(lastMessage.data));
			}
		}
		console.log("messageHistory", messageHistory);

	}, [lastMessage]);

	return (
		<div className="App">
			<h1>Redis Messaging App</h1>
			<div className='usertext'>
				<input
					type="text"
					value={user}
					onChange={handleUserInput}
					placeholder="Type your username."
				/>
				<input
					type="text"
					value={message}
					onChange={handleMessageInput}
					placeholder="Type your message."
				/>
				<button onClick={handleSendMessage}>Send Message</button>
			</div>
			<div>
				<div className='messages'>
					{
						messageHistory.map((message) =>
							<p>{message}</p>
						)
					}
				</div>
			</div>
		</div>
	);
}

export default App;
