import styles from './styles.module.scss';
import logoImage from '../../assets/logo.svg';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { api } from '../../services/api';
import { BACKEND_URL } from '../../contants/urls';

type Message = {
    id: string;
    text: string;
    user: {
        name: string;
        avatar_url: string;
    }
}

let messagesQueue: Message[] = [];
const socket = io(BACKEND_URL);

socket.on('new_message', (newMessage: Message) => {
    console.log('New message:' , newMessage);
    
    messagesQueue.push(newMessage);
});

export function MessageList() {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        api.get<Message[]>('/messages/last3').then(response => {
            setMessages(response.data);
        })
    }, []);

    useEffect(() => {
        setInterval(() => {
            if (messagesQueue.length > 0) {
                setMessages(prevState => [
                    messagesQueue[0],
                    prevState[0],
                    prevState[1]
                ]);

                messagesQueue.shift();
            }
        }, 3000);
    }, []);

    return (
        <div className={styles.messageListWrapper}>
            <img src={logoImage} alt="DoWhile 2021" />

            <ul className={styles.messageList}>
                {messages.map(message => {
                    return (
                        <li className={styles.message} key={message.id}>
                            <p className={styles.messageContetn}>
                                {message.text}
                            </p>
                            <div className={styles.messageUser}>
                                <div className={styles.userImage}>
                                    <img src={message.user.avatar_url} alt={message.user.name} />
                                </div>
                                <span>{message.user.name}</span>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}