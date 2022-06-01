import type { NextPage } from 'next';
import React from 'react';
import { Download } from '@navikt/ds-icons';
import { Files, FileError, FileSuccess } from '@navikt/ds-icons';

// React
import { Success, Attachment, FileContent } from '@navikt/ds-icons';
import {
    Alert,
    Heading,
    BodyLong,
    Button,
    Panel,
    Detail,
    Label,
} from '@navikt/ds-react';
import styled from 'styled-components';

// Takk bare fet og stor .. vi mottok h2 .. ul ikoner som bullet ... h2 for doks som skal ettersendes, ny ul med forskjellig bullet ... p ...

const VedleggPanel = styled(Panel)`
    /*background-color: red;     */
    background-color: var(--navds-semantic-color-canvas-background);
`;

// todo hvorfor får jeg ikke overskrevet styled components tingen her?
const FilePanel = styled(Panel)`
    border-width: 2px;
    border-radius: 8px;

    /*background-color: red;     
    
    ${(props) =>
        props.type === 'error'
            ? 'background-color: orange'
            : 'border: blue'};
    */
    /*
    .icon {
        
        background-color: red;
        grid-area: icon;

        
        width: 40px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-items: center;
        > * {
            background-color: blue;
            color: white;
        }
    } */
    // TODO legg inn sekundær og tertiær
    // TODO i mobilformat stretch to fit container
    .filename {
        grid-area: filename;
        color: gray;
        display: flex;
        justify-content: left;
        gap: 10px;
    }
    .fileinfo {
        grid-area: fileinfo;
    }
    .button {
        grid-area: button;
        display: flex;
        justify-content: right;
        gap: 10px;
    }

    display: grid;
    grid-template-areas:
        'icon filename button button'
        'icon fileinfo button button';

    ${(props) =>
        props.type === 'error' &&
        'border-color: var(--navds-semantic-color-interaction-danger)'};

    //    ${(props) => props.type === 'error' && 'border-width: 5px'};
`;

const StyledButton = styled.div`
    > * {
        border-radius: 8px;
    }
`;

const StyledSecondaryButton = styled(StyledButton)`
    > * {
        //border-radius: 8px;
        // border-color: var(--navds-semantic-color-feedback-info-background);
        --navds-button-color-secondary-border: var(
            --navds-semantic-color-feedback-info-background
        );
        background-color: var(
            --navds-semantic-color-feedback-info-background
        );
    }
`;

const StyledTertiaryButton = styled(StyledButton)``;

const StyledDiv = styled.div`
    background-color: var(
        --navds-semantic-color-feedback-danger-background
    );

    border-radius: 4px;
    width: 40px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-items: center;
    > * {
        color: var(
            --navds-semantic-color-interaction-danger-selected
        );
        margin-left: 10px;
    }
`;
const StyledUploadFilePanel = styled(Panel)``;

const StyledErrorFilePanel = styled(Panel)``;

const StyledPreviousFilePanel = styled(Panel)``;

const StyledSuccessFilePanel = styled(Panel)``;

const KompStyle = styled.div`
    /* background-color: red; */
    .bigtext {
        font-weight: bold;
        font-size: 30px;
    }

    .sjekkboksliste {
        list-style-type: none;
    }
`;

const Vedlegg: NextPage = () => {
    return (
        <KompStyle>
            <h1>1</h1>
            <VedleggPanel>
                <Heading spacing size="medium" level="2">
                    Vedleggsnavn
                </Heading>
                <Button as="label" variant="secondary">
                    <Download />
                    Velg dine filer
                </Button>
            </VedleggPanel>
            <hr />
            <h1>2</h1>
            <VedleggPanel>
                <Heading spacing size="medium" level="2">
                    Vedleggsnavn
                </Heading>
                <p>
                    Beskrivelse beskrivelse beskrivelse beskrivelse
                    beskrivelse beskrivelse beskrivelse beskrivelse
                    beskrivelse beskrivelse beskrivelse beskrivelse
                    beskrivelse beskrivelse beskrivelse beskrivelse
                    beskrivelse beskrivelse
                </p>
                <Button as="label" variant="secondary">
                    <Download />
                    Velg dine filer
                </Button>
            </VedleggPanel>
            <hr />

            <h1>3</h1>

            <VedleggPanel>
                <Heading spacing size="medium" level="2">
                    Vedleggsnavn
                </Heading>
                <p>
                    Beskrivelse beskrivelse beskrivelse beskrivelse
                    beskrivelse beskrivelse beskrivelse beskrivelse
                    beskrivelse beskrivelse beskrivelse beskrivelse
                    beskrivelse beskrivelse beskrivelse beskrivelse
                    beskrivelse beskrivelse
                </p>

                <Button as="label" variant="secondary">
                    Velg dine filer
                </Button>

                <FilePanel type="" border>
                    <StyledDiv>
                        <Files />
                    </StyledDiv>
                    <div className="filename">Filename.jpg</div>

                    <div className="button">
                        <StyledSecondaryButton>
                            <Button as="label" variant="secondary">
                                Prøv igjen
                            </Button>
                        </StyledSecondaryButton>

                        <StyledTertiaryButton>
                            <Button as="label" variant="tertiary">
                                Fjern
                            </Button>
                        </StyledTertiaryButton>
                    </div>
                </FilePanel>

                <Label size="medium">
                    Vedlegg du har lastet opp nå:
                </Label>
            </VedleggPanel>
            <hr />

            <h1>4 skipped for now</h1>
            <hr />

            <h1>5</h1>

            <VedleggPanel>
                <Heading spacing size="medium" level="2">
                    Vedleggsnavn
                </Heading>
                <p>
                    Beskrivelse beskrivelse beskrivelse beskrivelse
                    beskrivelse beskrivelse beskrivelse beskrivelse
                    beskrivelse beskrivelse beskrivelse beskrivelse
                    beskrivelse beskrivelse beskrivelse beskrivelse
                    beskrivelse beskrivelse
                </p>

                <Label size="medium">
                    Dokumentasjon du har sendt inn tidligere
                </Label>

                <StyledErrorFilePanel>
                    <Panel>
                        <Files />
                    </Panel>
                    Faktura for stolheis.jpg 8mb Motatt: 07.11.2021
                </StyledErrorFilePanel>

                <Button as="label" variant="secondary">
                    <Download />
                    Velg dine filer
                </Button>

                <Label size="medium">
                    Vedlegg du har lastet opp nå:
                </Label>

                <FilePanel>
                    <Panel>
                        <Files />
                    </Panel>
                    Filename.jpg 8mb
                    <Button as="label" variant="secondary">
                        Fjern
                    </Button>
                </FilePanel>
            </VedleggPanel>
        </KompStyle>
    );
};

export default Vedlegg;
