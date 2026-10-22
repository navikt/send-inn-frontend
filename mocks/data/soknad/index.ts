export const soknadMock = async (id: string) => {
  const { default: data } =
    (await import(`./${id}.json`, {
      with: { type: 'json' },
    }).catch(() => null)) ||
    (await import(`./fyll-ut-default.json`, {
      with: { type: 'json' },
    }));
  return data;
};
