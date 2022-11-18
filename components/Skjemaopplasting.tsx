import React, { useState } from 'react';
import { Heading, Button, BodyShort } from '@navikt/ds-react';
import styled from 'styled-components';
import { Download } from '@navikt/ds-icons';
import { useTranslation } from 'react-i18next';
import { VedleggType } from '../types/types';
import { VedleggPanel } from './Vedlegg';
import { SideValideringProvider } from './SideValideringProvider';
import { SoknadType } from '../types/types';
import Vedlegg from './Vedlegg';
import { ButtonContainer } from './VedleggsListe';
const BeskrivelsesGruppe = styled.div`
    padding-bottom: 1.5rem;
    @media only screen and (max-width: 600px) {
        ol {
            padding-left: 1.5rem;
        }
    }
`;
const PaddedVedlegg = styled.div`
    > * {
        margin-top: 16px;
    }
`;

export interface VedleggProps {
    vedlegg: VedleggType | null;
    innsendingsId: string;
    erAnnetVedlegg?: boolean;
}

export interface SkjemaopplastingdProps {
    vedlegg: VedleggType | null;
    //innsendingsId: string;
    //erAnnetVedlegg?: boolean;
    soknad: SoknadType;
    oppdaterVisningsSteg: (nr: number) => void;
    setSlettSoknadModal: (boolean: boolean) => void;
    //setSide1Valideringfokus: (value: React.SetStateAction<boolean>) => void;
    //setVisSide1Feil: (value: React.SetStateAction<boolean>) => void;
}
const Linje = styled.div`
    border-bottom: 1px solid var(--navds-semantic-color-border);
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
`;

function Skjemaopplasting(props: SkjemaopplastingdProps) {
    const {
        vedlegg,
        soknad,
        oppdaterVisningsSteg,
        setSlettSoknadModal,
    } = props;

    const { t } = useTranslation();

    const [side1HarFeil, setSide1HarFeil] = useState(false);
    const [visSide1Feil, setVisSide1Feil] = useState(false);
    const [side1Valideringfokus, setSide1Valideringfokus] =
        useState(false);

    return (
        <div>
            <>
                <SideValideringProvider
                    setHarValideringsfeil={setSide1HarFeil}
                    visValideringsfeil={visSide1Feil}
                    setVisValideringsfeil={setVisSide1Feil}
                    fokus={side1Valideringfokus}
                    setFokus={setSide1Valideringfokus}
                >
                    <Heading level={'2'} size="large" spacing>
                        {t('soknad.visningsSteg.steg1.tittel')}
                    </Heading>
                    <Linje />

                    <PaddedVedlegg>
                        <Vedlegg
                            innsendingsId={soknad.innsendingsId}
                            vedlegg={vedlegg}
                        />
                    </PaddedVedlegg>
                    <ButtonContainer>
                        <Button
                            onClick={() => {
                                if (side1HarFeil) {
                                    setSide1Valideringfokus(true);
                                    setVisSide1Feil(true);
                                    return;
                                }
                                oppdaterVisningsSteg(1);
                            }}
                            data-cy="nesteStegKnapp"
                        >
                            {t('soknad.knapper.neste')}
                        </Button>
                        <Button
                            onClick={() => {
                                oppdaterVisningsSteg(-1);
                            }}
                            variant="secondary"
                            data-cy="forrigeStegKnapp"
                        >
                            {t('soknad.knapper.forrige')}
                        </Button>
                        {/*kall slettsøknad på api, deretter, gå til ditt nav
kanskje popup om at dette vil slette innhold? */}
                        <Button
                            onClick={() => {
                                //  if (!slettSoknadModal) {
                                setSlettSoknadModal(true);
                                // }
                            }}
                            variant="tertiary"
                            data-cy="slettSoknadKnapp"
                        >
                            {t('soknad.knapper.avbryt')}
                        </Button>
                    </ButtonContainer>
                </SideValideringProvider>
                showmodal=true
            </>
        </div>
    );
}
export default Skjemaopplasting;
