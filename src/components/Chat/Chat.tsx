import {
  useLazyQuery,
  useMutation,
  useQuery,
  useSubscription,
} from '@apollo/client';
import { useEffect, useState } from 'react';
import {
  GET_SELECTED_USER,
  GET_MESSAGES,
  SEND_MESSAGE,
  NEW_MESSAGE,
  User,
  Message,
  selectedUserVar,
} from '../../graphql';
import moment from 'moment';

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

import './Chat.scss';
import LoadingDots from '../LoadingDots/LoadingDots';

interface Messages {
  getMessages: Message[];
}

interface MessageInterface {
  newMessage: Message;
}

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<null | Message[]>(null);
  const selectedUser: User | null =
    useQuery(GET_SELECTED_USER).data.selectedUser;
  const [getMessages, { data, error, loading, refetch }] =
    useLazyQuery<Messages>(GET_MESSAGES);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const { data: messageData, error: messageError } =
    useSubscription<MessageInterface>(NEW_MESSAGE);

  useEffect(() => {
    selectedUser && getMessages({ variables: { from: selectedUser.username } });
  }, [selectedUser, getMessages, messages]);

  useEffect(() => {
    data && setMessages(data.getMessages);
    return () => setMessages(null);
  }, [data]);

  useEffect(() => {
    selectedUser &&
      messages &&
      refetch({ variables: { from: selectedUser.username } });
  }, [selectedUser, messages]);

  useEffect(() => {
    if (
      selectedUser &&
      messageData &&
      (messageData.newMessage.from === selectedUser.username ||
        messageData.newMessage.to === selectedUser.username)
    ) {
      setMessages((prev) => prev && [messageData.newMessage, ...prev]);
    }
  }, [messageData, selectedUser]);

  useEffect(() => {
    (error || messageError) && alert(error || messageError);
  }, [error, messageError]);

  const handleSubmit = (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    message !== '' &&
      sendMessage({
        variables: { to: selectedUser?.username, content: message },
      });
    setMessage('');
  };

  return (
    <div className="chat">
      {selectedUser && (
        <div className="info-header">
          <button onClick={() => selectedUserVar(null)}>
            <i className="fa-solid fa-arrow-left-long"></i>
          </button>
          <img
            src={selectedUser.imageUrl}
            alt={`${selectedUser.username}'s avatar`}
          />
          <span>{selectedUser.username}</span>
          {loading && (
            <div className="spinner-wrapper">
              <LoadingDots />
            </div>
          )}
        </div>
      )}

      <div className="messages-wrapper">
        <div className="messages">
          {messages &&
            messages.map((message) => (
              <div
                className={`message ${
                  message.from === selectedUser?.username ? 'left' : 'right'
                }`}
                key={message.uuid}
              >
                {message.content}{' '}
                <span>{moment(message.createdAt).format('hh:mm a')}</span>
              </div>
            ))}
        </div>
      </div>
      {selectedUser && (
        <form className="input-wrapper" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button disabled={!message} onClick={handleSubmit}>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      )}
    </div>
  );
};

export default Chat;
