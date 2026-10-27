export const fyllutMock = async (id: string) => {
  const { default: data } =
    (await import(`./${id}.json`, {
      with: { type: 'json' },
    }).catch(() => null)) ||
    (await import(`./nav100740.json`, {
      with: { type: 'json' },
    }));
  return data;
};
