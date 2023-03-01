export const importJSON = async (path) => {
    return (await import(path, { assert: { type: 'json' } })).default;
};
