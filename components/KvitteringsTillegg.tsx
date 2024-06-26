import { AllowedSubmissionType } from '../types/fyllutForm';
import UXSignals from './ux-signals/UXSignals';

interface KvitteringsTilleggProps {
  uxSignalsId?: string;
  uxSignalsInnsending?: AllowedSubmissionType;
}

export const KvitteringsTillegg = ({ uxSignalsId, uxSignalsInnsending }: KvitteringsTilleggProps) => {
  if (!uxSignalsId) return null;
  if (uxSignalsInnsending === 'INGEN' || uxSignalsInnsending === 'KUN_PAPIR') return null;

  const shouldRenderDemo = process.env.NEXT_PUBLIC_NAIS_CLUSTER_NAME !== 'prod-gcp';

  return <UXSignals id={uxSignalsId} demo={shouldRenderDemo} />;
};
