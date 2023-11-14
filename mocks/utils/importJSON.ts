export const importJSON = async (path: string) => {
  return (
    await import('../data/' + path, {
      assert: { type: 'json' },
    })
  ).default;
};
