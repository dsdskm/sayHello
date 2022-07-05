export const getTimeText = (mil: number) => {
  const date = new Date(mil);
  return date.toLocaleString();
};
