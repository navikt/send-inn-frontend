export const navigerTil = (url: string) => {
  console.debug(`Navigerer til ${url}`);
  window.location.assign(url);
};
