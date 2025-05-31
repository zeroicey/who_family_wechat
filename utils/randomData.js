export const getRandomAvatarUrl = (name) => {
  return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}`;
};
