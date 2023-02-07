//TODO: denne filen kan fjernes i etter 4. april
/* Brukes til å generere melding om et spesifikt avvik */
export const erDatoIAvviksPeriode = (date) => {
    const avvikStart = new Date('2022-12-12T16:50:00.000Z');
    const avvikSlutt = new Date('2023-02-07T13:00:00.000Z');
    const opprettet = new Date(date);
    return (
        avvikStart.getTime() <= opprettet.getTime() &&
        opprettet.getTime() <= avvikSlutt.getTime()
    );
};
