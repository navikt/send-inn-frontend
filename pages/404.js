import styled from 'styled-components';
import {
    BodyShort,
    Detail,
    Heading,
    GuidePanel,
} from '@navikt/ds-react';

const Style = styled.div`
    min-height: 100vh;
    max-width: 50rem;
    margin: 0 auto;
    padding-top: 44px;
    margin-bottom: 44px;
`;


const HorizontalLinksFlexbox = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
`;

export default function Custom404() {
    return (
        <Style>
            <GuidePanel poster="true">
                <div>
                    <Heading level="1" size="xlarge" spacing>
                        Vi fant ikke den siden
                    </Heading>
                </div>
                <div>
                    <div>
                        <div>
                            <BodyShort spacing>
                                Beklager, siden kan være slettet eller
                                flyttet, eller det var en feil i
                                lenken som førte deg hit.
                            </BodyShort>
                            <BodyShort spacing>
                                Vi setter pris på om du melder fra om
                                feilen via lenken nedenfor.
                            </BodyShort>
                        </div>
                        <HorizontalLinksFlexbox>
                            <BodyShort spacing>
                                <a href="https://nav.no">
                                    Gå til forsiden på nav.no
                                </a>
                            </BodyShort>
                            <BodyShort spacing>
                                <a href="https://www.nav.no/person/kontakt-oss/tilbakemeldinger/feil-og-mangler">
                                    Meld fra om denne feilen
                                </a>
                            </BodyShort>
                        </HorizontalLinksFlexbox>
                    </div>

                    <div>
                        <Heading level="1" size="xlarge" spacing>
                            We did not find that page
                        </Heading>
                    </div>
                    <div>
                        <div>
                            <div>
                                <div>
                                    <BodyShort spacing>
                                        The page you requested cannot
                                        be found. It may have been
                                        deleted, moved, or there may
                                        be an error in the link that
                                        led you here. We appologize
                                        for the inconvenience.
                                    </BodyShort>
                                    <BodyShort spacing>
                                        We would appreciate it if you
                                        report the error via the link
                                        below.
                                    </BodyShort>
                                </div>
                                <HorizontalLinksFlexbox>
                                    <BodyShort spacing>
                                        <a href="https://nav.no">
                                            Return to nav.no front
                                            page
                                        </a>
                                    </BodyShort>
                                    <BodyShort spacing>
                                        <a href="https://www.nav.no/person/kontakt-oss/tilbakemeldinger/feil-og-mangler">
                                            Report this error
                                        </a>
                                    </BodyShort>
                                </HorizontalLinksFlexbox>
                            </div>
                        </div>
                    </div>
                </div>

                <Detail spacing>Statuskode 404</Detail>
            </GuidePanel>
        </Style>
    );
}
