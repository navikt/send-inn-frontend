export const importJSON = async (path: string) => {
  return (
    await import(/* webpackInclude: /\.json$/ */ '../data/' + path, {
      with: { type: 'json' },
    })
  ).default;
};
