export const importJSON = async (path) => {
  return (
    await import('../data/' + path, {
      assert: { type: 'json' },
    })
  ).default;
};
