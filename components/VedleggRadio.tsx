import React from 'react';
import { RadioGroup, Radio } from '@navikt/ds-react';
import { setOpplastingStatusType, VedleggType } from '../types/types';
import styled from 'styled-components';

interface VedleggRadioProp {
    id: number;
    vedlegg: VedleggType;
    setOpplastingStatus: setOpplastingStatusType;
}

const StyledRadioGroup = styled(RadioGroup)`
    padding-bottom: 24px;
`;

function VedleggRadio({
    id,
    vedlegg,
    setOpplastingStatus,
}: VedleggRadioProp) {
    function handleChange(val) {
        setOpplastingStatus(id, val);
    }

    return (
        <>
            <StyledRadioGroup
                legend="Velg din innsending."
                size="medium"
                onChange={(val: string) => handleChange(val)}
                value={vedlegg.opplastingsStatus}
            >
                {
                    vedlegg.opplastingsStatus !== 'LastetOpp' && (
                        <Radio value="IkkeValgt">
                            Jeg laster opp dette nå
                        </Radio>
                    ) // jeg tror dette løser problemet med å vise disse i to situasjoner, både når noe er lastet opp og når noe ikke er lastet opp
                }
                {vedlegg.opplastingsStatus === 'LastetOpp' && (
                    <Radio value="LastetOpp">
                        Jeg laster opp dette nå
                    </Radio>
                )}
                <Radio value="SendSenere">
                    Jeg laster opp dette senere
                </Radio>
                <Radio value="SendesAvAndre">
                    Sendes inn av andre (f.eks. lege, arbeidsgiver
                    osv.)
                </Radio>
            </StyledRadioGroup>
        </>
    );
}

export default VedleggRadio;
