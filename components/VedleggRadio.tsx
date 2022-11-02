import React from 'react';
import { RadioGroup, Radio } from '@navikt/ds-react';
import { setOpplastingStatusType, VedleggType } from '../types/types';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface VedleggRadioProp {
    id: number;
    vedlegg: VedleggType;
    setOpplastingStatus: setOpplastingStatusType;
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
    setOpplastingStatus,
}: VedleggRadioProp) {
    const { t } = useTranslation();

    function handleChange(val) {
        setOpplastingStatus(id, val);
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
                value={vedlegg.opplastingsStatus}
            >
                {
                    vedlegg.opplastingsStatus !== 'LastetOpp' && (
                        <Radio
                            value="IkkeValgt"
                            data-cy="lasterOppNaaRadio"
                        >
                            {t('soknad.vedlegg.radio.lasterOppNaa')}
                        </Radio>
                    ) // jeg tror dette løser problemet med å vise disse i to situasjoner, både når noe er lastet opp og når noe ikke er lastet opp
                }
                {vedlegg.opplastingsStatus === 'LastetOpp' && (
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
