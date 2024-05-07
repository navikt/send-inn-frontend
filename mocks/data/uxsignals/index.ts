export const uxSignalsMock = async (id: string) => {
  const { default: data } =
    (await import(`./${id}.json`, {
      assert: { type: 'json' },
    }).catch(() => null)) ||
    (await import(`./panel-uzn9037kdp.json`, {
      assert: { type: 'json' },
    }));
  return data;
};
