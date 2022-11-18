import React, { useState } from 'react';
import {
    Heading,
    Button,
    BodyShort,
    Ingress,
    Alert,
} from '@navikt/ds-react';
import styled from 'styled-components';
import { Download } from '@navikt/ds-icons';
import { useTranslation } from 'react-i18next';
import { VedleggType } from '../types/types';
import { VedleggPanel } from './Vedlegg';
import { SideValideringProvider } from './SideValideringProvider';
import { SoknadType } from '../types/types';
import Vedlegg from './Vedlegg';
import { ButtonContainer } from './VedleggsListe';
import { OpprettAnnetVedlegg } from './OpprettAnnetVedlegg';
import {
    formatertDato,
    seksUkerFraDato,
} from '../components/Kvittering';

const FristForOpplastingInfo = styled(Alert)`
    border: 0;
    border-bottom: 1px solid var(--navds-semantic-color-border);
    padding-bottom: 4px;
    border-radius: 0px;
    margin-bottom: 24px;
    text-transform: uppercase;
`;
const PaddedVedlegg = styled.div`
    > * {
        margin-top: 16px;
    }
`;

export interface LastOppVedleggdProps {
    vedleggsliste: VedleggType[];
    //innsendingsId: string;
    //erAnnetVedlegg?: boolean;
    soknad: SoknadType;
    oppdaterVisningsSteg: (nr: number) => void;
    setSlettSoknadModal: (boolean: boolean) => void;
    setFortsettSenereSoknadModal: (boolean: boolean) => void;
    setSendInnKomplettSoknadModal: (boolean: boolean) => void;
    setSendInnUferdigSoknadModal: (boolean: boolean) => void;
}
const Linje = styled.div`
    border-bottom: 1px solid var(--navds-semantic-color-border);
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
`;

function LastOppVedlegg(props: LastOppVedleggdProps) {
    const {
        vedleggsliste,
        soknad,
        oppdaterVisningsSteg,
        setSlettSoknadModal,
        setFortsettSenereSoknadModal,
        setSendInnKomplettSoknadModal,
        setSendInnUferdigSoknadModal,
    } = props;

    const { t } = useTranslation();

    const [lastOppVedleggHarFeil, setLastOppVedleggHarFeil] =
        useState(false);
    const [visLastOppVedleggFeil, setVisLastOppVedleggFeil] =
        useState(false);
    const [
        lastOppVedleggValideringfokus,
        setLastOppVedleggValideringfokus,
    ] = useState(false);

    return (
        <>
            <Heading level={'2'} size="large" spacing>
                {t('soknad.visningsSteg.lastOppVedlegg.tittel')}
            </Heading>
            <Ingress spacing>
                {t('soknad.visningsSteg.lastOppVedlegg.ingress')}
            </Ingress>
            <FristForOpplastingInfo
                variant="info"
                inline={true}
                size="small"
            >
                {t('soknad.visningsSteg.lastOppVedlegg.infoFrist', {
                    dato: formatertDato(
                        seksUkerFraDato(
                            new Date(soknad.opprettetDato),
                        ),
                    ),
                })}
            </FristForOpplastingInfo>

            <SideValideringProvider
                setHarValideringsfeil={setLastOppVedleggHarFeil}
                visValideringsfeil={visLastOppVedleggFeil}
                setVisValideringsfeil={setVisLastOppVedleggFeil}
                fokus={lastOppVedleggValideringfokus}
                setFokus={setLastOppVedleggValideringfokus}
            >
                {soknad.visningsType === 'dokumentinnsending' &&
                    soknad.visningsType === 'dokumentinnsending' &&
                    vedleggsliste.some((element) => {
                        return (
                            element.erHoveddokument === true &&
                            element.opplastingsStatus !== 'LastetOpp'
                        );
                    }) && (
                        <Alert variant="warning" size="medium">
                            {t(
                                'soknad.visningsSteg.lastOppVedlegg.advarselHovedskjema',
                            )}
                        </Alert>
                    )}

                <PaddedVedlegg>
                    {soknad &&
                        vedleggsliste.length > 0 &&
                        vedleggsliste
                            .filter((x) => !x.erHoveddokument)
                            .map((vedlegg) => {
                                return (
                                    <Vedlegg
                                        key={vedlegg.id}
                                        innsendingsId={
                                            soknad.innsendingsId
                                        }
                                        vedlegg={vedlegg}
                                    />
                                );
                            })}

                    {soknad.kanLasteOppAnnet && (
                        <OpprettAnnetVedlegg
                            innsendingsId={soknad.innsendingsId}
                        />
                    )}
                </PaddedVedlegg>
            </SideValideringProvider>

            {/* start */}

            <ButtonContainer>
                {/* todo, fjerne skillet mellom soknad klar og ikke klar buttons, men vi trenger en ternary operator for å legge modalene, vi kan kan vurdere å beholde begge knappene, kanskje mer leselige, skal vi kanskje ha forskjellige tekster rune? */}
                {soknadKlar && (
                    <Button
                        onClick={() => {
                            if (lastOppVedleggHarFeil) {
                                setLastOppVedleggValideringfokus(
                                    true,
                                );
                                setVisLastOppVedleggFeil(true);
                                return;
                            }
                            if (!sendInnKomplettSoknadModal) {
                                setSendInnKomplettSoknadModal(true);
                            }
                        }}
                        data-cy="sendTilNAVKnapp"
                    >
                        {t('soknad.knapper.sendInn')}
                    </Button>
                )}

                {
                    soknadHarNoeInnlevert && !soknadKlar && (
                        <Button
                            onClick={() => {
                                if (lastOppVedleggHarFeil) {
                                    setLastOppVedleggValideringfokus(
                                        true,
                                    );
                                    setVisLastOppVedleggFeil(true);
                                    return;
                                }
                                if (!sendInnUferdigSoknadModal) {
                                    setSendInnUferdigSoknadModal(
                                        true,
                                    );
                                }
                            }}
                            data-cy="sendTilNAVKnapp"
                        >
                            {t('soknad.knapper.sendInnUfullstendig')}
                        </Button>
                    )
                    // dette virker nå, men du må reloade
                }

                {/* lagre og fortsett senere */}
                <Button
                    variant="secondary"
                    onClick={() => {
                        if (!fortsettSenereSoknadModal) {
                            setForstettSenereSoknadModal(true);
                        }
                    }}
                >
                    {t('soknad.knapper.fortsettSenere')}
                </Button>

                {/* gå tilbake et steg */}

                {soknad.visningsType === 'dokumentinnsending' && (
                    <Button
                        onClick={() => {
                            oppdaterVisningsSteg(-1);
                        }}
                        variant="secondary"
                        data-cy="nesteStegKnapp"
                    >
                        {t('soknad.knapper.forrige')}
                    </Button>
                )}
                {/*kall slettsøknad på api, deretter, gå til ditt nav
kanskje popup om at dette vil slette innhold? */}

                <Button
                    onClick={() => {
                        if (!slettSoknadModal) {
                            setSlettSoknadModal(true);
                        }
                    }}
                    variant="tertiary"
                    data-cy="slettSoknadKnapp"
                >
                    {t('soknad.knapper.slett')}
                </Button>
            </ButtonContainer>
            {/* end */}
        </>
    );
}
export default LastOppVedlegg;
