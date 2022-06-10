import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import {
  GET_USERS,
  GET_SELECTED_USER,
  NEW_MESSAGE,
  UPDATE_PROFILE_PIC,
  User,
  selectedUserVar,
  Message,
  authVar,
} from '../../graphql';
import moment from 'moment';

import './Users.scss';
import { uploadPicture } from '../../util/uploadPic';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

interface Response {
  getUsers: User[];
}

interface MessageInterface {
  newMessage: Message;
}

const Users = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<null | User[]>(null);
  const {
    data: usersData,
    error: usersError,
    loading,
  } = useQuery<Response>(GET_USERS, {
    pollInterval: 10000,
  });
  const selectedUser: User | null =
    useQuery(GET_SELECTED_USER).data.selectedUser;
  const { data: messageData, error: messageError } =
    useSubscription<MessageInterface>(NEW_MESSAGE);
  const [uploadPic, { error: pictureError }] = useMutation(UPDATE_PROFILE_PIC);

  useEffect(() => {
    usersData &&
      setUsers(
        usersData.getUsers.filter((user) =>
          user.username.includes(searchTerm || '')
        )
      );
  }, [searchTerm, usersData]);

  useEffect(() => {
    if (image) {
      const update = async () => {
        const url = await uploadPicture(image);
        if (url !== 'error') {
          uploadPic({ variables: { imageUrl: url } });
          alert('avatar updated');
        }
        url === 'error' && alert('failed to uplaod picture');
      };
      update();
      setImage(null);
    }
  }, [image, uploadPic]);

  useEffect(() => {
    messageData &&
      selectedUser &&
      users &&
      setUsers(
        (prev) =>
          (prev &&
            prev.map((user) => {
              if (
                (user.username === messageData.newMessage.from ||
                  user.username === messageData.newMessage.to) &&
                user.latestMessage?.uuid !== messageData.newMessage.uuid
              ) {
                return {
                  ...user,
                  latestMessage: messageData.newMessage,
                  unread:
                    selectedUser.username !== user.username ? true : false,
                };
              } else {
                return user;
              }
            })) ||
          null
      );
  }, [messageData, selectedUser]);

  useEffect(() => {
    setUsers(
      (prev) =>
        (prev &&
          prev.sort((a, b) => {
            return a.latestMessage && b.latestMessage
              ? new Date(b.latestMessage.createdAt).getTime() -
                  new Date(a.latestMessage.createdAt).getTime()
              : a.latestMessage && !b.latestMessage
              ? -1
              : 1;
          })) ||
        null
    );
  }, [users]);

  useEffect(() => {
    (usersError || messageError || pictureError) &&
      alert(usersError || messageError || pictureError);
  }, [usersError, messageError, pictureError]);

  return (
    <div className="users">
      <div className="searchbar">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input
          type="text"
          placeholder="search..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="users-list">
        {loading && (
          <div className="spinner-wrapper">
            <LoadingSpinner />
          </div>
        )}
        {users &&
          users.map((user) => (
            <div
              className={`user ${
                selectedUser?.username === user.username ? 'active' : ''
              }`}
              key={user.username}
              onClick={() => {
                selectedUserVar(user);
                user.unread &&
                  setUsers(
                    users.map((arrayUser) =>
                      arrayUser.username === user.username
                        ? { ...arrayUser, unread: false }
                        : arrayUser
                    )
                  );
              }}
            >
              <div className="details-wrapper">
                <img src={user.imageUrl} alt={`${user.username}'s avatar`} />
                <div className="details">
                  <span className="username">{user.username}</span>
                  <span
                    className={`message ${
                      selectedUser?.username === user.username ? 'active' : ''
                    }`}
                  >
                    {user.latestMessage?.content || 'start chatting with user'}
                  </span>
                </div>
              </div>
              <div className="time-unread">
                <div className="time">
                  {user.latestMessage?.createdAt &&
                    moment(user.latestMessage.createdAt)
                      .startOf('minute')
                      .fromNow()}
                </div>
                {user.unread && <div className="unread"></div>}
              </div>
            </div>
          ))}
      </div>
      <div className="buttons">
        <input
          style={{ display: 'none' }}
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target?.files?.[0];
            if (file && file.type.substr(0, 5) === 'image') {
              setImage(file);
            } else {
              setImage(null);
            }
          }}
        />
        <button
          className="update"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          Update Avatar
        </button>
        <button
          className="logout"
          onClick={() => {
            authVar(null);
            window.localStorage.removeItem('user');
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Users;
