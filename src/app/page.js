import Image from 'next/image';
import { IoArrowDownCircle } from 'react-icons/io5';
import background from '/public/assets/USCVirtualBackdrop_White.jpg';
import logo from '/public/assets/USCLogo_FlushLeft.png';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { io } from 'socket.io-client';

export default function Home() {
	const router = useRouter();
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		const socketAddress = 'http://127.0.0.1:5005';
		const socket = io(socketAddress); // Connect to Socket.IO server
		setSocket(socket);

		console.log('Server listening to ' + socketAddress);
		return () => {
			socket.disconnect(); // Clean up on component unmount
		};
	}, []);

	const handleCommand = (msg) => {
		// Handle command logic here
	};

	useEffect(() => {
		if (socket) {
			socket.on('command', handleCommand); // Listen for 'command' events
		}
		return () => {
			if (socket) {
				socket.off('command', handleCommand); // Clean up event listener
			}
		};
	}, [socket]);

	const sendMessage = (msg) => {
		if (socket) {
			socket.emit('message', msg); // Emit message to server
		}
	};

	return (
		<main className='flex flex-col min-h-screen min-w-full bg-white items-start justify-center'>
			<Image
				src={background}
				alt='usc background image'
				width={400}
				height={400}
				sizes='fill'
				style={{ width: 'auto', height: 'auto', position: 'fixed', zIndex: '0' }}
			/>
			<div className='flex flex-col w-full h-full p-10 z-[999] absolute'>
				<header className='w-full h-fit items-center justify-center flex self-start'>
					<Image src={logo} alt='usc logo' width={400} height={400} style={{ width: 'auto', height: '120px' }} />
				</header>
				<div className='flex flex-col w-full h-full items-center mt-32 gap-10'>
					<h1 className='text-6xl font-bold text-green-700'>E-PLETE LOADING STATION</h1>
					<h2 className='text-4xl font-semibold text-gray-700'>Scan you id below</h2>
					<IoArrowDownCircle className='text-[200px] absolute bottom-0 left-0 text-green-700 animate-bounce' />
				</div>
			</div>
		</main>
	);
}
