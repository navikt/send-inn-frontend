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

                <Detail spacing>Statuskode 500</Detail>
            </div>
            <div>
                <div>
                    <div>
                        <BodyShort spacing>
                            Beklager, vi har tekniske problemer. Prøv
                            igjen om en time. Om problemet vedvarer ta
                            gjerne kontakt med NAV på lenken nedenfor.
                        </BodyShort>

                        <BodyShort spacing>
                            <a href="https://www.nav.no/person/kontakt-oss/tilbakemeldinger/feil-og-mangler">
                                Meld gjerne fra om denne feilen
                            </a>
                        </BodyShort>
                    </div>

                    <div>
                        <Heading level="2" size="large" spacing>
                            In English
                        </Heading>

                        <BodyShort spacing>
                            We are experiencing technical
                            difficulties. We apologize for any
                            inconvenience caused. If the problem
                            persists please contact NAV at the adress
                            below.
                        </BodyShort>
                        <BodyShort spacing>
                            Go to the{' '}
                            <a href="https://nav.no">front page</a>,
                            or use one of the links in the menu.
                        </BodyShort>
                    </div>
                </div>
            </div>
        </Style>
    );
}
