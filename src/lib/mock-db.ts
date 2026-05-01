export interface User {
  id: string;
  name: string;
  email: string;
}

// In a real Next.js app, this would be a database. 
// For this MVP/Task, we'll use a global to persist during the dev session.
declare global {
  var users: User[];
}

if (!global.users) {
  global.users = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
  ];
}

export const getUsers = () => global.users;

export const addUser = (user: Omit<User, 'id'>) => {
  const newUser = { ...user, id: Math.random().toString(36).substr(2, 9) };
  global.users.push(newUser);
  return newUser;
};

export const deleteUser = (id: string) => {
  const index = global.users.findIndex(u => u.id === id);
  if (index !== -1) {
    global.users.splice(index, 1);
    return true;
  }
  return false;
};

export const getUserById = (id: string) => {
  return global.users.find(u => u.id === id);
};

export const findUserByEmail = (email: string) => {
  return global.users.find(u => u.email === email);
};
