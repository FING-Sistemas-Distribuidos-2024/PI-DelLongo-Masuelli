/**
 * Importing necessary modules and hooks
 * 'react-use-websocket' is a custom React Hook that provides a WebSocket client
 * 'useState' and 'useEffect' are built-in React hooks
 */
import './App.css';
import useWebSocket from 'react-use-websocket';
import {useEffect, useState} from 'react';

/**
 * Main function component of the application
 */
function App() {
	// State variables for the user's message, username, received message, and message history
	const [message, setMessage] = useState('');
	const [user, setUser] = useState('');
	const [receivedMessage, setReceivedMessage] = useState('');
	const [socketUrl, setSocketUrl] = useState('ws://10.230.50.3:5000/');

	// WebSocket hook for sending messages and handling the connection state
	const {sendMessage, lastMessage, readyState} = useWebSocket(socketUrl);

	// State variable for storing the history of messages
	const [messageHistory, setMessageHistory] = useState([]);

	/**
	 * Function to handle sending of messages
	 * If the user is anonymous, prepend 'Anonymous' to the message
	 */
	const handleSendMessage = () => {
		if (user === '') {
			sendMessage(`Anonymous: ${message}`);
			return;
		}
		sendMessage(`${user}: ${message}`);
	}

	// Event handlers for updating state variables based on user input
	const handleMessageInput = (e) => {
		setMessage(e.target.value);
	}

	const handleUserInput = (e) => {
		setUser(e.target.value);
	}

	const handleReceivedMessage = (e) => {
		setReceivedMessage(e.target.value);
	}

	/**
	 * useEffect hook to handle incoming messages
	 * If the last message is not null, it is added to the message history
	 */
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

	// Rendering the application
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