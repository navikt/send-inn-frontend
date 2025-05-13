import { AllowedSubmissionType } from '../types/fyllutForm';
import UXSignals from './ux-signals/UXSignals';

interface KvitteringsTilleggProps {
  uxSignalsId?: string;
  uxSignalsSubmissionTypes?: AllowedSubmissionType[];
}

export const KvitteringsTillegg = ({ uxSignalsId, uxSignalsSubmissionTypes }: KvitteringsTilleggProps) => {
  if (!uxSignalsId) return null;

  if (uxSignalsSubmissionTypes && !uxSignalsSubmissionTypes?.includes('DIGITAL')) return null;

  const shouldRenderDemo = process.env.NEXT_PUBLIC_NAIS_CLUSTER_NAME !== 'prod-gcp';

  return <UXSignals id={uxSignalsId} demo={shouldRenderDemo} />;
};
