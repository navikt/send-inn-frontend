import React, { useContext, useEffect, useRef } from 'react';
import { RadioGroup, Radio } from '@navikt/ds-react';
import { OpplastingsStatus, VedleggType } from '../types/types';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { VedleggslisteContext } from './VedleggsListe';
import { useDebounce } from 'use-debounce';
import getConfig from 'next/config';
import axios, { AxiosResponse } from 'axios';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { LagringsProsessContext } from './LagringsProsessProvider';

const { publicRuntimeConfig } = getConfig();
interface VedleggRadioProp {
    id: number;
    vedlegg: VedleggType;
    valgtOpplastingStatus: OpplastingsStatus;
    setValgtOpplastingStatus: React.Dispatch<
        React.SetStateAction<OpplastingsStatus>
    >;
}

const SrOnly = styled.span`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
`;

const StyledRadioGroup = styled(RadioGroup)`
    :not(:last-child) {
        padding-bottom: 24px;
    }
`;

function VedleggRadio({
    id,
    vedlegg,
    valgtOpplastingStatus,
    setValgtOpplastingStatus,
}: VedleggRadioProp) {
    const { t } = useTranslation();
    const { showError } = useErrorMessage();
    const controller = useRef(new AbortController());

    const [debouncedLokalOpplastingsStatus] = useDebounce(
        valgtOpplastingStatus,
        500,
    );

    const { soknad, oppdaterLokalOpplastingStatus } = useContext(
        VedleggslisteContext,
    );
    const { nyLagringsProsess } = useContext(LagringsProsessContext);

    useEffect(() => {
        if (
            debouncedLokalOpplastingsStatus ===
            vedlegg.opplastingsStatus
        )
            return;

        controller.current.abort();
        const newController = new AbortController();
        controller.current = newController;
        nyLagringsProsess(
            axios.patch(
                `${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${soknad.innsendingsId}/vedlegg/${id}`,
                {
                    opplastingsStatus:
                        debouncedLokalOpplastingsStatus,
                },
                { timeout: 10000, signal: controller.current.signal },
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
                setValgtOpplastingStatus(vedlegg.opplastingsStatus);
                showError(error);
            });
    }, [
        id,
        debouncedLokalOpplastingsStatus,
        vedlegg.opplastingsStatus,
        setValgtOpplastingStatus,
        nyLagringsProsess,
        oppdaterLokalOpplastingStatus,
        soknad.innsendingsId,
        showError,
    ]);

    function handleChange(val) {
        setValgtOpplastingStatus(val);
    }

    return (
        <>
            <StyledRadioGroup
                legend={
                    <>
                        {t('soknad.vedlegg.radio.tittel')}
                        <SrOnly>
                            {t('for')} {vedlegg.label}
                        </SrOnly>
                    </>
                }
                size="medium"
                onChange={(val: string) => handleChange(val)}
                value={valgtOpplastingStatus}
            >
                {valgtOpplastingStatus !== 'LastetOpp' && (
                    <Radio
                        value="IkkeValgt"
                        data-cy="lasterOppNaaRadio"
                    >
                        {t('soknad.vedlegg.radio.lasterOppNaa')}
                    </Radio>
                )}
                {valgtOpplastingStatus === 'LastetOpp' && (
                    <Radio
                        value="LastetOpp"
                        data-cy="lasterOppNaaRadio"
                    >
                        {t('soknad.vedlegg.radio.lasterOppNaa')}
                    </Radio>
                )}
                <Radio value="SendSenere" data-cy="sendSenereRadio">
                    {t('soknad.vedlegg.radio.sendSenere')}
                </Radio>
                <Radio
                    value="SendesAvAndre"
                    data-cy="sendesAvAndreRadio"
                >
                    {t('soknad.vedlegg.radio.sendesAvAndre')}
                </Radio>
            </StyledRadioGroup>
        </>
    );
}

export default VedleggRadio;
