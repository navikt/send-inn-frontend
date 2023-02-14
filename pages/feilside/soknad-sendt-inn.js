import styled from 'styled-components';
import {
    BodyShort,
    Detail,
    Heading,
    GuidePanel,
} from '@navikt/ds-react';

const { NEXT_PUBLIC_MIN_SIDE_URL } = process.env;

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
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0 1rem;
    margin-bottom: 3rem;
`;

export default function soknadSendtSlettetErrorpage() {
    return (
        <Style>
            <GuidePanel poster="true">
                <div>
                    <Heading level="1" size="medium" spacing>
                        Du har forsøkt å gå tilbake til en søknad som
                        allerede er sendt til NAV
                    </Heading>
                    <BodyShort spacing>
                        Hvis du skal ettersende dokumentasjon til
                        denne søknaden må det sendes inn på papir.
                    </BodyShort>
                    <HorizontalLinksFlexbox>
                        <BodyShort spacing>
                            <a href={NEXT_PUBLIC_MIN_SIDE_URL}>
                                Du finner søknaden du sendte inn på
                                Min side på nav.no
                            </a>
                        </BodyShort>
                        <BodyShort spacing>
                            <a href="https://www.nav.no/soknader/nb/ettersendelse/person">
                                Gå til ettersendelse
                            </a>
                        </BodyShort>
                    </HorizontalLinksFlexbox>
                </div>
                <div>
                    <Heading level="1" size="medium" spacing>
                        Du har prøvd å gå tilbake til ein søknad som
                        allereie er send til NAV
                    </Heading>
                    <BodyShort spacing>
                        Viss du skal ettersende dokumentasjon til
                        denne søknaden må det sendast inn på papir.
                    </BodyShort>
                    <HorizontalLinksFlexbox>
                        <BodyShort spacing>
                            <a href={NEXT_PUBLIC_MIN_SIDE_URL}>
                                Du finn søknaden du sendte inn på Mi
                                side på(bokmål)
                            </a>
                        </BodyShort>
                        <BodyShort spacing>
                            <a href="https://www.nav.no/soknader/nn/ettersendelse/person">
                                Gå til ettersending
                            </a>
                        </BodyShort>
                    </HorizontalLinksFlexbox>
                </div>
                <div>
                    <Heading level="1" size="medium" spacing>
                        You have tried to reopen an application that
                        has already been sent to NAV
                    </Heading>
                    <BodyShort spacing>
                        If you want to submit additional documentation
                        to this application, it must be submitted on
                        paper.
                    </BodyShort>
                    <HorizontalLinksFlexbox>
                        <BodyShort spacing>
                            <a href={NEXT_PUBLIC_MIN_SIDE_URL}>
                                You will find the application you
                                previously submitted on my page on
                                nav.no (Norwegian)
                            </a>
                        </BodyShort>
                        <BodyShort spacing>
                            <a href="https://www.nav.no/soknader/en/ettersendelse/person">
                                Forward documentation
                            </a>
                        </BodyShort>
                    </HorizontalLinksFlexbox>
                </div>

                <Detail spacing>Statuskode 405</Detail>
            </GuidePanel>
        </Style>
    );
}
