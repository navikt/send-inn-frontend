import React, { useContext, useEffect, useState } from 'react';
import { RadioGroup, Radio } from '@navikt/ds-react';
import { OpplastingsStatus, VedleggType } from '../types/types';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { VedleggslisteContext } from './VedleggsListe';
import { useDebounce } from 'use-debounce';
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

    const [debouncedLokalOpplastingsStatus] = useDebounce(
        valgtOpplastingStatus,
        500,
    );

    const { setOpplastingStatus, nyLagringsProsess } = useContext(
        VedleggslisteContext,
    );

    useEffect(() => {
        if (
            debouncedLokalOpplastingsStatus ===
            vedlegg.opplastingsStatus
        )
            return;

        nyLagringsProsess(
            setOpplastingStatus(
                id,
                debouncedLokalOpplastingsStatus,
            ).catch(() => {
                setValgtOpplastingStatus(vedlegg.opplastingsStatus);
            }),
        );
    }, [
        setOpplastingStatus,
        id,
        debouncedLokalOpplastingsStatus,
        vedlegg.opplastingsStatus,
        setValgtOpplastingStatus,
        nyLagringsProsess,
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
