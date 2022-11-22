import React, { useContext, useState } from 'react';
import { Heading, Button, Ingress, Alert } from '@navikt/ds-react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { VedleggType } from '../types/types';
import { SideValideringProvider } from './SideValideringProvider';
import Vedlegg from './Vedlegg';
import {
    ButtonContainer,
    VedleggslisteContext,
} from './VedleggsListe';
import { OpprettAnnetVedlegg } from './OpprettAnnetVedlegg';
import {
    formatertDato,
    seksUkerFraDato,
} from '../components/Kvittering';
import { ModalContext } from './SoknadModalProvider';

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
    oppdaterVisningsSteg: (nr: number) => void;
}

function LastOppVedlegg(props: LastOppVedleggdProps) {
    const { vedleggsliste, oppdaterVisningsSteg } = props;

    const { t } = useTranslation();

    const { soknad, soknadKlar, soknadHarNoeInnlevert } = useContext(
        VedleggslisteContext,
    );
    const {
        openForstettSenereSoknadModal,
        openSendInnKomplettSoknadModal,
        openSendInnUferdigSoknadModal,
        openSlettSoknadModal,
    } = useContext(ModalContext);

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

            <ButtonContainer>
                {(soknadKlar || soknadHarNoeInnlevert) && (
                    <Button
                        onClick={() => {
                            if (lastOppVedleggHarFeil) {
                                setLastOppVedleggValideringfokus(
                                    true,
                                );
                                setVisLastOppVedleggFeil(true);
                                return;
                            }
                            if (soknadKlar) {
                                openSendInnKomplettSoknadModal();
                            } else {
                                openSendInnUferdigSoknadModal();
                            }
                        }}
                        data-cy="sendTilNAVKnapp"
                    >
                        {t('soknad.knapper.sendInn')}
                    </Button>
                )}

                {/* lagre og fortsett senere */}
                <Button
                    variant="secondary"
                    onClick={() => {
                        openForstettSenereSoknadModal();
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

                <Button
                    onClick={() => {
                        openSlettSoknadModal();
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
