import styled from 'styled-components';
import {
    BodyShort,
    Detail,
    Heading,
    GuidePanel,
} from '@navikt/ds-react';
import { useTranslation } from 'react-i18next';

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

export default function SoknadSendtSlettetErrorpage() {
    const { t, i18n } = useTranslation();

    return (
        <Style>
            <GuidePanel poster="true">
                <div>
                    <Heading level="1" size="xlarge" spacing>
                        Du har forsøkt å gå tilbake til en søknad som
                        allerede er sendt til NAV
                    </Heading>
                </div>
                <div>
                    <div>
                        <div>
                            <BodyShort spacing>
                                Hvis du skal ettersende dokumentasjon
                                til denne søknaden må det sendes inn
                                på papir.
                            </BodyShort>
                        </div>
                        <HorizontalLinksFlexbox>
                            <BodyShort spacing>
                                <a href="https://www.nav.no/minside/">
                                    Du finner søknaden du sendte inn
                                    på min side på nav.no
                                </a>
                            </BodyShort>
                            <BodyShort spacing>
                                <a href="https://www.nav.no/soknader/nb/ettersendelse/person">
                                    Gå til ettersendelse
                                </a>
                            </BodyShort>
                        </HorizontalLinksFlexbox>
                    </div>
                </div>

                <div>
                    <Heading level="1" size="xlarge" spacing>
                        Du har prøvd å gå tilbake til ein søknad som
                        allereie er send til NAV
                    </Heading>
                </div>
                <div>
                    <div>
                        <div>
                            <BodyShort spacing>
                                Viss du skal ettersende dokumentasjon
                                til denne søknaden må det sendast inn
                                på papir.
                            </BodyShort>
                        </div>
                        <HorizontalLinksFlexbox>
                            <BodyShort spacing>
                                <a href="https://www.dev.nav.no/minside/">
                                    Du finn søknaden du sendte inn på
                                    mi side på
                                </a>
                            </BodyShort>
                            <BodyShort spacing>
                                <a href="https://www.nav.no/soknader/nn/ettersendelse/person">
                                    Gå til ettersending
                                </a>
                            </BodyShort>
                        </HorizontalLinksFlexbox>
                    </div>
                </div>

                <div>
                    <Heading level="1" size="xlarge" spacing>
                        You have tried to reopen an application that
                        has already been sent to NAV
                    </Heading>
                </div>
                <div>
                    <div>
                        <div>
                            <BodyShort spacing>
                                If you want to submit additional
                                documentation to this application, it
                                must be sent in on paper.
                            </BodyShort>
                        </div>
                        <HorizontalLinksFlexbox>
                            <BodyShort spacing>
                                <a href="https://www.dev.nav.no/minside/">
                                    Forward documentation
                                </a>
                            </BodyShort>
                            <BodyShort spacing>
                                <a href="https://www.nav.no/soknader/nn/ettersendelse/person">
                                    You will find the application you
                                    previously submitted on my page on
                                    nav.no
                                </a>
                            </BodyShort>
                        </HorizontalLinksFlexbox>
                    </div>
                </div>

                <Detail spacing>Statuskode 405</Detail>
            </GuidePanel>
        </Style>
    );
}
