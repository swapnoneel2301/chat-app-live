const getSender = (loggedUser, users) => {
  // console.log(loggedUser);
  if (!loggedUser || !users) return;
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

export { getSender };
