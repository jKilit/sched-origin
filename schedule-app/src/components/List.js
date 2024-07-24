import React, { useState, useEffect } from 'react';
import { fetchUsers } from './api';

function List() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log('useEffect is running');
    fetchUsers();
  }, []);

  return (
    <div className="List">
      <h2>User List</h2>
      <ul>
        {users.length > 0 ? (
          users.map(user => (
            <li key={user._id}>{user.username}</li>
          ))
        ) : (
          <li>No users found</li>
        )}
      </ul>
    </div>
  );
}

export default List;
