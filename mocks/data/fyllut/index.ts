export const fyllutMock = async (id: string) => {
  const { default: data } =
    (await import(`./${id}.json`, {
      assert: { type: 'json' },
    }).catch(() => null)) ||
    (await import(`./nav100740.json`, {
      assert: { type: 'json' },
    }));
  return data;
};
