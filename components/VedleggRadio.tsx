import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { RadioGroup, Radio } from '@navikt/ds-react';
import { OpplastingsStatus, VedleggType } from '../types/types';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useVedleggslisteContext } from './VedleggsListe';
import { useDebouncedCallback } from 'use-debounce';
import getConfig from 'next/config';
import axios, { AxiosResponse } from 'axios';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useLagringsProsessContext } from './LagringsProsessProvider';
import { ScreenReaderOnly } from './textStyle';

const { publicRuntimeConfig } = getConfig();
interface VedleggRadioProp {
    id: number;
    vedlegg: VedleggType;
    harOpplastetFil: boolean;
    valgtOpplastingStatus: OpplastingsStatus;
    setValgtOpplastingStatus: React.Dispatch<
        React.SetStateAction<OpplastingsStatus>
    >;
}

const StyledRadioGroup = styled(RadioGroup)`
    &:not(:last-child) {
        padding-bottom: 24px;
    }
`;

function VedleggRadio({
    id,
    vedlegg,
    harOpplastetFil,
    valgtOpplastingStatus,
    setValgtOpplastingStatus,
}: VedleggRadioProp) {
    const { t } = useTranslation();
    const { showError } = useErrorMessage();
    const controller = useRef(new AbortController());

    const [harKjortFix, setHarKjortFix] = useState(false);

    const { soknad, oppdaterLokalOpplastingStatus } =
        useVedleggslisteContext();
    const { nyLagringsProsess } = useLagringsProsessContext();

    const oppdaterOpplastingStatus = useCallback(
        (nyOpplastingsStatus: OpplastingsStatus) => {
            nyLagringsProsess(
                axios.patch(
                    `${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${soknad.innsendingsId}/vedlegg/${id}`,
                    {
                        opplastingsStatus: nyOpplastingsStatus,
                    },
                    {
                        timeout: 10000,
                        signal: controller.current.signal,
                    },
                ),
            )
                .then((response: AxiosResponse<VedleggType>) => {
                    oppdaterLokalOpplastingStatus(
                        id,
                        response.data.opplastingsStatus,
                    );
                })
                .catch((error) => {
                    if (axios.isCancel(error)) {
                        // avbrutt
                        return;
                    }
                    setValgtOpplastingStatus(
                        vedlegg.opplastingsStatus,
                    );
                    showError(error);
                });
        },
        [
            soknad.innsendingsId,
            id,
            vedlegg.opplastingsStatus,
            setValgtOpplastingStatus,
            nyLagringsProsess,
            oppdaterLokalOpplastingStatus,
            showError,
        ],
    );

    const debounced = useDebouncedCallback(
        (debouncedLokalOpplastingsStatus) => {
            if (
                debouncedLokalOpplastingsStatus ===
                vedlegg.opplastingsStatus
            )
                return;

            oppdaterOpplastingStatus(debouncedLokalOpplastingsStatus);
        },
        500,
        { leading: true },
    );

    // TODO: useEffect kan fjernes etter 4. april
    // Fikser opp i problem som satt opplastingsStatus til IkkeValgt, etter opplasting av fil
    useEffect(() => {
        if (
            !harKjortFix &&
            vedlegg.opplastingsStatus === 'IkkeValgt' &&
            harOpplastetFil
        ) {
            oppdaterOpplastingStatus('LastetOpp');
            setHarKjortFix(true);
        }
    }, [
        harKjortFix,
        harOpplastetFil,
        vedlegg.opplastingsStatus,
        oppdaterOpplastingStatus,
    ]);

    const handleChange = (val: OpplastingsStatus) => {
        controller.current.abort();
        const newController = new AbortController();
        controller.current = newController;
        debounced(val);
        setValgtOpplastingStatus(val);
    };

    return (
        <StyledRadioGroup
            legend={
                <>
                    {t('soknad.vedlegg.radio.tittel')}
                    <ScreenReaderOnly>
                        {t('for')} {vedlegg.label}
                    </ScreenReaderOnly>
                </>
            }
            size="medium"
            onChange={(val: OpplastingsStatus) => handleChange(val)}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    // Trigger når radioGroup mister fokus
                    debounced.flush();
                }
            }}
            value={valgtOpplastingStatus}
        >
            {!harOpplastetFil && (
                <Radio value="IkkeValgt" data-cy="lasterOppNaaRadio">
                    {t('soknad.vedlegg.radio.lasterOppNaa')}
                </Radio>
            )}
            {harOpplastetFil && (
                <Radio value="LastetOpp" data-cy="lasterOppNaaRadio">
                    {t('soknad.vedlegg.radio.lasterOppNaa')}
                </Radio>
            )}
            <Radio value="SendSenere" data-cy="sendSenereRadio">
                {t('soknad.vedlegg.radio.sendSenere')}
            </Radio>
            <Radio value="SendesAvAndre" data-cy="sendesAvAndreRadio">
                {t('soknad.vedlegg.radio.sendesAvAndre')}
            </Radio>
        </StyledRadioGroup>
    );
}

export default VedleggRadio;
