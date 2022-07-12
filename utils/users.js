const users = [];

// Join user to users list
function userJoin(id, username) {
  const user = { id, username };

  users.push(user);

  return user;
}


// User leaves game
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  userLeave,
  getRoomUsers
};
