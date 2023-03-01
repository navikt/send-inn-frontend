export const soknadMock = async (id) => {
    const { default: data } =
        (await import(`./${id}.json`, {
            assert: { type: 'json' },
        }).catch(() => null)) ||
        (await import(`./fyll-ut-default.json`, {
            assert: { type: 'json' },
        }));
    return data;
};
