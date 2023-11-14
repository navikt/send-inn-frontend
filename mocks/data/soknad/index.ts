export const soknadMock = async (id: string) => {
  const { default: data } =
    (await import(`./${id}.json`, {
      assert: { type: 'json' },
    }).catch(() => null)) ||
    (await import(`./fyll-ut-default.json`, {
      assert: { type: 'json' },
    }));
  return data;
};
