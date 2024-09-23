import axios from 'axios';
import { useEffect, useReducer, useState } from 'react';
import { useErrorMessage } from '../hooks/useErrorMessage';

import { BodyShort, Button, Heading, Link as NavLink, Panel } from '@navikt/ds-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { Filvelger } from './Filvelger';

import getConfig from 'next/config';
import { useValidation } from '../hooks/useValidation';
import { FIL_STATUS } from '../types/enums';
import { OpplastetFil, VedleggType, VisningsType } from '../types/types';
import { EndreVedlegg } from './EndreVedlegg';
import { Fil, FilePanel } from './Fil';
import { FilUploadIcon } from './FilUploadIcon';
import { ValideringsRamme } from './ValideringsRamme';

import parse from 'html-react-parser';
import sanitizeHtml from 'sanitize-html';
import { useVedleggslisteContext } from './VedleggsListe';
import VedleggsValg from './VedleggsValg';

const { publicRuntimeConfig } = getConfig();

export interface ExtendedVedleggType extends VedleggType {
  autoFocus?: boolean;
}

export interface VedleggProps {
  vedlegg: ExtendedVedleggType;
  innsendingsId: string;
  erAnnetVedlegg?: boolean;
  soknadVisningstype: VisningsType;
}

export interface FilData {
  komponentID?: string;
  lokalFil?: File;
  opplastetFil?: OpplastetFil;
}

export const ACTIONS = {
  NY_FIL: 'NY_FIL',
  SLETT_FIL: 'SLETT_FIL',
  ENDRE_FIL: 'ENDRE_FIL',
  RESET_LISTE: 'RESET_LISTE',
} as const;

export type ActionType =
  | {
      type: Exclude<(typeof ACTIONS)[keyof typeof ACTIONS], typeof ACTIONS.RESET_LISTE>;
      filData: FilData;
    }
  | { type: typeof ACTIONS.RESET_LISTE };

const filListeReducer = (filListe: FilData[], action: ActionType) => {
  switch (action.type) {
    case ACTIONS.NY_FIL: {
      return [...filListe, { komponentID: uuidv4(), ...action.filData }];
    }
    case ACTIONS.SLETT_FIL: {
      return filListe.filter((fil) => fil.komponentID !== action.filData.komponentID);
    }
    case ACTIONS.ENDRE_FIL: {
      return filListe.map((fil) => (fil.komponentID === action.filData.komponentID ? action.filData : fil));
    }
    case ACTIONS.RESET_LISTE: {
      return initialState;
    }
  }
};

const lasterOppStateReducer = (currentValue: number, change: number) => {
  return currentValue + change;
};

const initialState: FilData[] = [];

export const VedleggContainer = styled.section<{
  $extraMargin?: boolean;
}>`
  ${(props) => props.$extraMargin && 'margin-bottom: 60px'};
`;

export const VedleggPanel = styled(Panel)`
  background-color: var(--a-bg-subtle);
  border-radius: 8px;
  padding: 24px;
  @media only screen and (max-width: 600px) {
    padding: 12px;
  }
`;

const ListeGruppe = styled.div`
  padding-bottom: 1.5rem;
  @media only screen and (max-width: 600px) {
    ol {
      padding-left: 1.5rem;
    }
  }
`;
const VedleggBeskrivelse = styled(BodyShort)`
  margin-bottom: 24px;
`;

const VedleggButtons = styled.div`
  display: flex;
  gap: 20px;
  @media only screen and (max-width: 475px) {
    flex-direction: column;
    button,
    label {
      width: 100%;
    }
  }
`;

const SendtInnTidligereGruppe = styled.div`
  margin-bottom: 24px;
`;

const FilListeGruppe = styled.div`
  margin-top: 24px;
  li:not(:last-child) {
    margin-bottom: 8px;
  }
`;

export const FilMottattFelt = styled.div`
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: 600px) {
    flex-direction: row;
    p:first-child {
      padding-right: 0.5rem;
    }
  }
`;

const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`;

function Vedlegg(props: VedleggProps) {
  const { innsendingsId, vedlegg, soknadVisningstype } = props;
  const { opplastingsStatus } = vedlegg;

  const { slettAnnetVedlegg } = useVedleggslisteContext();

  const { t } = useTranslation();

  const [filListe, dispatch] = useReducer(filListeReducer, initialState);
  const [lasterOppState, dispatchLasterOppState] = useReducer(lasterOppStateReducer, 0);

  const [hasFetched, setHasFetched] = useState(false);
  const [endrer, setEndrer] = useState(false);
  const [tittel, setTittel] = useState(vedlegg.label);
  const [valgtOpplastingStatus, setValgtOpplastingStatus] = useState(opplastingsStatus);
  const [prevOpplastingStatus, setPrevOpplastingStatus] = useState(opplastingsStatus);
  const [autoFocus, setAutoFocus] = useState(vedlegg.autoFocus);
  const { showError } = useErrorMessage();

  if (opplastingsStatus !== prevOpplastingStatus) {
    setPrevOpplastingStatus(opplastingsStatus);
    if (valgtOpplastingStatus !== opplastingsStatus) {
      setValgtOpplastingStatus(opplastingsStatus);
    }
  }

  const harOpplastetFil = opplastingsStatus === 'LastetOpp' || filListe.some((fil) => fil.opplastetFil);

  const erAnnetVedlegg = vedlegg.vedleggsnr?.toUpperCase() === 'N6' && !vedlegg.erPakrevd;
  const erSendtInnTidligere = !!vedlegg.innsendtdato;
  const visFiler =
    valgtOpplastingStatus === 'IkkeValgt' ||
    valgtOpplastingStatus === 'LastetOpp' ||
    valgtOpplastingStatus === 'Innsendt';

  const manglerFilTekst = () => {
    if (vedlegg.erHoveddokument && soknadVisningstype !== 'lospost')
      return t('soknad.hovedSkjema.feilmelding.manglerFil', {
        label: vedlegg.label,
      });
    if (erAnnetVedlegg)
      return t('soknad.vedlegg.annet.feilmelding.manglerFil', {
        label: vedlegg.label,
      });
    return t('soknad.vedlegg.feilmelding.manglerFil', {
      label: vedlegg.label,
    });
  };

  const feilId = `vedlegg-feil-${vedlegg.id}`;

  const [visFeil, valideringsMelding] = useValidation({
    komponentId: feilId,
    melding: manglerFilTekst(),
    harFeil: !filListe.length && valgtOpplastingStatus === 'IkkeValgt' && !endrer,
  });

  useEffect(() => {
    if (!hasFetched && innsendingsId && vedlegg.id) {
      setHasFetched(true);
      axios
        .get(`${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${innsendingsId}/vedlegg/${vedlegg.id}/fil`)
        .then((response) => {
          const responseJSON = response.data;
          for (const item of responseJSON) {
            const nyFil: FilData = {
              opplastetFil: {
                id: item.id,
                filnavn: item.filnavn,
                storrelse: item.storrelse,
              },
            };
            dispatch({
              type: ACTIONS.NY_FIL,
              filData: nyFil,
            });
          }
        })
        .catch((error) => {
          showError(error);
        });
    }

    return () =>
      dispatch({
        type: ACTIONS.RESET_LISTE,
      });
  }, [innsendingsId, vedlegg.id, showError, hasFetched]);

  const getFilvelgerButtonText = () => {
    if (vedlegg.erHoveddokument && soknadVisningstype !== 'lospost') {
      return t('soknad.hovedSkjema.filvelgerKnapp');
    }
    if (erSendtInnTidligere) {
      return t('soknad.vedlegg.ettersendingFilvelgerKnapp');
    }
    return null; // default text
  };

  return (
    <VedleggContainer
      data-cy="VedleggContainer"
      aria-labelledby={`heading-${vedlegg.id}`}
      $extraMargin={vedlegg.erHoveddokument}
    >
      <ValideringsRamme id={feilId} visFeil={visFeil} melding={valideringsMelding}>
        {endrer ? (
          <EndreVedlegg
            tittel={tittel}
            vedlegg={vedlegg}
            innsendingsId={innsendingsId}
            setEndrer={setEndrer}
            setTittel={setTittel}
          />
        ) : (
          <VedleggPanel>
            <div>
              {(vedlegg.erHoveddokument || !vedlegg.skjemaurl) && (
                <Heading id={`heading-${vedlegg.id}`} level={'3'} size="small" spacing>
                  {tittel}
                </Heading>
              )}
              {!vedlegg.erHoveddokument && vedlegg.skjemaurl && (
                <Heading id={`heading-${vedlegg.id}`} level={'3'} size="small" spacing>
                  <NavLink target="_blank" href={vedlegg.skjemaurl} rel="noopener noreferrer">
                    {t('link.nyFane', {
                      tekst: tittel,
                    })}
                  </NavLink>
                </Heading>
              )}

              {vedlegg.erHoveddokument && soknadVisningstype !== 'lospost' && (
                <ListeGruppe>
                  <BodyShort>{t('soknad.hovedSkjema.listeTittel')}</BodyShort>
                  <BodyShort as="ol">
                    {(
                      t('soknad.hovedSkjema.liste', {
                        returnObjects: true,
                      }) as string[]
                    ).map((element, key) => (
                      <li key={key}>{element}</li>
                    ))}
                  </BodyShort>
                </ListeGruppe>
              )}
              {/* beskrivelse ligger i mange søknader fra fyll ut, men finnes ikke for dokumentinnsending */}
              {vedlegg.beskrivelse && (
                <VedleggBeskrivelse size="small">{parse(sanitizeHtml(vedlegg.beskrivelse))}</VedleggBeskrivelse>
              )}
            </div>

            {vedlegg.erPakrevd && !vedlegg.erHoveddokument && !erSendtInnTidligere && (
              <VedleggsValg
                id={vedlegg.id}
                vedlegg={vedlegg}
                harOpplastetFil={harOpplastetFil}
                valgtOpplastingStatus={valgtOpplastingStatus}
                setValgtOpplastingStatus={setValgtOpplastingStatus}
              />
            )}

            {erSendtInnTidligere && (
              <SendtInnTidligereGruppe>
                <Heading level={'4'} size="xsmall" spacing>
                  {t('soknad.vedlegg.tidligereSendtInn')}
                </Heading>
                <FilePanel border>
                  <div className="icon">
                    <FilUploadIcon filstatus={FIL_STATUS.TIDLIGERE_LASTET_OPP} filnavn={vedlegg.label} />
                  </div>
                  <BodyShort className="filename">{vedlegg.label}</BodyShort>
                  <BodyShort className="documentarchive" size="small">
                    {t('soknad.vedlegg.lastNedFiler') + ' '}
                    <NavLink target="_blank" href={process.env.NEXT_PUBLIC_DOKUMENTARKIV_URL} rel="noopener noreferrer">
                      {t('link.nyFane', {
                        tekst: t('soknad.vedlegg.dokumentarkivet'),
                      })}
                    </NavLink>
                  </BodyShort>
                  <div className="hoyreHalvdel">
                    <FilMottattFelt>
                      <BodyShort>{t('soknad.vedlegg.mottatt')}</BodyShort>
                      <BodyShort>
                        {new Date(vedlegg.innsendtdato!).toLocaleString('no', {
                          dateStyle: 'short',
                        })}
                      </BodyShort>
                    </FilMottattFelt>
                  </div>
                </FilePanel>
              </SendtInnTidligereGruppe>
            )}

            {visFiler && (
              <VedleggButtons>
                <Filvelger
                  autoFocus={autoFocus}
                  buttonText={getFilvelgerButtonText()}
                  onFileSelected={(fil: File) =>
                    dispatch({
                      type: ACTIONS.NY_FIL,
                      filData: {
                        lokalFil: fil,
                      },
                    })
                  }
                />

                {erAnnetVedlegg && !erSendtInnTidligere && (
                  <>
                    <Button
                      onClick={() => {
                        setEndrer(true);
                        setAutoFocus(true);
                      }}
                      variant="secondary"
                    >
                      {t('soknad.vedlegg.annet.rediger')}
                    </Button>

                    <Button
                      onClick={() => {
                        slettAnnetVedlegg(lasterOppState != 0, vedlegg.id);
                      }}
                      variant="secondary"
                    >
                      {t('soknad.vedlegg.annet.slett')}
                    </Button>
                  </>
                )}
              </VedleggButtons>
            )}

            {visFiler && filListe.length > 0 && (
              <FilListeGruppe>
                <Heading id={`sendtInnNaa-${vedlegg.id}`} level={'4'} size="xsmall" spacing>
                  {t('soknad.vedlegg.sendtInnNaa')}
                </Heading>
                <List aria-labelledby={`sendtInnNaa-${vedlegg.id}`}>
                  {filListe.map((fil) => {
                    return (
                      <Fil
                        key={fil.komponentID}
                        komponentID={fil.komponentID!}
                        vedlegg={vedlegg}
                        innsendingsId={innsendingsId}
                        lokalFil={fil.lokalFil}
                        opplastetFil={fil.opplastetFil}
                        filListeDispatch={dispatch}
                        lasterOppStateDispatch={dispatchLasterOppState}
                      />
                    );
                  })}
                </List>
              </FilListeGruppe>
            )}
          </VedleggPanel>
        )}
      </ValideringsRamme>
    </VedleggContainer>
  );
}
export default Vedlegg;
