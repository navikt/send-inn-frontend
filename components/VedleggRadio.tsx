import React, { useContext, useState, useEffect } from 'react';
import { RadioGroup, Radio } from '@navikt/ds-react';
import { VedleggType } from '../types/types';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { VedleggslisteContext } from './VedleggsListe';
import { useDebounce } from 'use-debounce';

interface VedleggRadioProp {
    id: number;
    vedlegg: VedleggType;
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

function VedleggRadio({ id, vedlegg }: VedleggRadioProp) {
    const { t } = useTranslation();
    const [localOpplastingStatus, setLocalOpplastingStatus] =
        useState(vedlegg.opplastingsStatus);
    const [debouncedLocalOpplastingsStatus] = useDebounce(
        localOpplastingStatus,
        200,
    );

    const { setOpplastingStatus } = useContext(VedleggslisteContext);

    useEffect(() => {
        setOpplastingStatus(id, debouncedLocalOpplastingsStatus);
    }, [setOpplastingStatus, debouncedLocalOpplastingsStatus, id]);

    function handleChange(val) {
        //
        setLocalOpplastingStatus(val);
    }

    return (
        <>
            {vedlegg.opplastingsStatus}
            <br />
            {localOpplastingStatus}
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
                value={localOpplastingStatus}
            >
                {
                    localOpplastingStatus !== 'LastetOpp' && (
                        <Radio
                            value="IkkeValgt"
                            data-cy="lasterOppNaaRadio"
                        >
                            {t('soknad.vedlegg.radio.lasterOppNaa')}
                        </Radio>
                    ) // jeg tror dette løser problemet med å vise disse i to situasjoner, både når noe er lastet opp og når noe ikke er lastet opp
                }
                {localOpplastingStatus === 'LastetOpp' && (
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
