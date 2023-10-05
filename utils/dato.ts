export const formatertDato = (date: Date) => {
  // gir alltid dato og mnd med to tall
  return `${('0' + date.getDate()).slice(-2)}.${('0' + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()}`;
};

export const datoOmXDager = (dager: number) => new Date(new Date().setDate(new Date().getDate() + dager));
