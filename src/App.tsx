import { useQuery } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { User } from './graphql';
import { GET_AUTH } from './graphql';

import Auth from './pages/Auth/Auth';
import Home from './pages/Home/Home';

function App() {
  const user: User = useQuery(GET_AUTH).data.auth;

  return (
    <Router>
      <Routes>
        {user && <Route index element={<Home />} />}
        {!user && <Route index element={<Auth />} />}
        {!user && <Route path="/register" element={<Auth />} />}
        <Route
          path="*"
          element={
            <main style={{ textAlign: 'center', marginTop: '100px' }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
