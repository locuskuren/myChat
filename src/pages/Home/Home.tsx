import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SELECTED_USER, User } from '../../graphql';

import Users from '../../components/Users/Users';
import Chat from '../../components/Chat/Chat';

import './Home.scss';
import { useEffect } from 'react';

const Home = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const selectedUser: User | null =
    useQuery(GET_SELECTED_USER).data.selectedUser;

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="home">
      <div className="home-wrapper">
        {(width > 910 || !selectedUser) && <Users />}
        {(width > 910 || selectedUser) && <Chat />}
      </div>
    </div>
  );
};

export default Home;
