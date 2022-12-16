//TODO: denne filen kan fjernes i februar 2023
/* Brukes til å generere melding om et spesifikt avvik */
export const erDatoIAvviksPeriode = (date) => {
    const avvikStart = new Date('2022-12-12T16:50:00.000Z');
    const avvikSlutt = new Date('2022-12-14T10:50:00.000Z');
    const opprettet = new Date(date);
    return (
        avvikStart.getTime() <= opprettet.getTime() &&
        opprettet.getTime() <= avvikSlutt.getTime()
    );
};
