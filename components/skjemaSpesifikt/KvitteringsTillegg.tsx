import { AllowedSubmissionType } from '../../types/form';
import UXSignals from './ux-signals/UXSignals';

interface KvitteringsTilleggProps {
  uxSignalsId?: string;
  uxSignalsInnsending?: AllowedSubmissionType;
}

export const KvitteringsTillegg = ({ uxSignalsId, uxSignalsInnsending }: KvitteringsTilleggProps) => {
  if (!uxSignalsId) return null;
  if (uxSignalsInnsending === 'INGEN' || uxSignalsInnsending === 'KUN_PAPIR') return null;

  const shouldRenderDemo = process.env.NEXT_PUBLIC_NAIS_CLUSTER_NAME !== 'prod-gcp';

  // FIXME: Add demo mode prop
  return <UXSignals id={uxSignalsId} demo={shouldRenderDemo} />;
};
