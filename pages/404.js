import Link from 'next/link';
import {
    BodyShort,
    Search,
    Button,
    Detail,
    Heading,
} from '@navikt/ds-react';
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

export default function Custom404() {
    return (
        <Style>
            <div>
                <Heading level="1" size="xlarge" spacing>
                    Fant ikke siden
                </Heading>

                <Detail spacing>Statuskode 404</Detail>
            </div>
            <div>
                <div>
                    <div>
                        <BodyShort spacing>
                            Beklager, siden kan være slettet eller
                            flyttet, eller det var en feil i lenken
                            som førte deg hit.
                        </BodyShort>

                        <BodyShort spacing>
                            Bruk gjerne søket, menyen eller{' '}
                            <a href="https://nav.no">
                                gå til forsiden
                            </a>
                            .
                        </BodyShort>
                        <BodyShort spacing>
                            <a href="https://www.nav.no/person/kontakt-oss/tilbakemeldinger/feil-og-mangler">
                                Meld gjerne fra om denne lenken
                            </a>
                        </BodyShort>
                    </div>
                    <div>
                        <Heading level="2" size="large" spacing>
                            Hva leter du etter?
                        </Heading>
                        <DivWithSpacing>
                            <form
                                action="https://www.nav.no/sok"
                                method="GET"
                            >
                                <DivWithSpacing>
                                    <input
                                        type="text"
                                        aria-labelledby="search-header"
                                        maxLength="200"
                                        placeholder="Søk på nav.no"
                                        id="search-input"
                                        name="ord"
                                        aria-invalid="false"
                                    />
                                    <div
                                        id="textField-error-29a94bad-bcca-486a-8afd-0cf987c72b83"
                                        aria-relevant="additions removals"
                                        aria-live="polite"
                                    />
                                </DivWithSpacing>
                                <DivWithSpacing>
                                    <Button>
                                        <span aria-live="polite">
                                            Søk
                                        </span>
                                    </Button>
                                </DivWithSpacing>
                            </form>
                        </DivWithSpacing>
                    </div>
                    <div>
                        <Heading level="2" size="large" spacing>
                            In English
                        </Heading>

                        <BodyShort spacing>
                            The page you requested cannot be found.
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
