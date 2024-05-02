export const raise = (msg: string) => {
  console.error(msg); //TODO style error logging
  return process.exit(1);
};
