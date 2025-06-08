const generateUserName = () => {
  const userNamePrefix = 'user-';
  const randomName = Math.random().toString(36).slice(2);
  return `${userNamePrefix}${randomName}`;
};

export { generateUserName };