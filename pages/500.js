import { BodyShort, Search, Detail, Heading } from '@navikt/ds-react';
const Style = styled.div`
    min-height: 100vh;
    max-width: 50rem;
    margin: 0 auto;
    padding-top: 44px;
    margin-bottom: 44px;
`;

const DivWithSpacing = styled.div`
    margin-bottom: 16px;
`;
import styled from 'styled-components';

export default function Custom500() {
    return (
        <Style>
            <div>
                <Heading level="1" size="xlarge" spacing>
                    Det har skjedd en feil
                </Heading>
            </div>
            <div>
                <div>
                    <div>
                        <BodyShort spacing>
                            Beklager, vi har tekniske problemer. Prøv
                            igjen senere. Om problemet vedvarer ta
                            kontakt med NAV for å få hjelp på telefon
                            (+47) 55 55 33 33 eller på ditt lokale
                            NAV-kontor.
                        </BodyShort>

                        <BodyShort spacing>
                            Vi setter pris på om du melder fra om
                            feilen via lenken nedenfor.
                        </BodyShort>

                        <BodyShort spacing>
                            <a href="https://www.nav.no/person/kontakt-oss/tilbakemeldinger/feil-og-mangler">
                                Meld fra om denne feilen
                            </a>
                        </BodyShort>

                        <BodyShort spacing>
                            <a href="https://nav.no">
                                Gå til forsiden på nav.no
                            </a>
                        </BodyShort>
                    </div>

                    <div>
                        <Heading level="1" size="xlarge" spacing>
                            An error has occured
                        </Heading>
                    </div>
                    <div>
                        <div>
                            <BodyShort spacing>
                                We are experiencing technical
                                difficulties. We apologize for the
                                inconvenience. Please try again later.
                                If the problem persists, you can get
                                help from NAV Service Centre at (+47)
                                55 55 33 33 or at your local NAV
                                office.
                            </BodyShort>

                            <BodyShort spacing>
                                We would appreciate it if you report
                                the error via the link below.
                            </BodyShort>

                            <BodyShort spacing>
                                <a href="https://www.nav.no/person/kontakt-oss/tilbakemeldinger/feil-og-mangler">
                                    Report this error
                                </a>
                            </BodyShort>

                            <BodyShort spacing>
                                <a href="https://nav.no">
                                    Return to nav.no front page
                                </a>
                            </BodyShort>
                        </div>
                    </div>
                </div>
            </div>
            <Detail spacing>Statuskode 500</Detail>
        </Style>
    );
}
