import { AllowedSubmissionType, DeprecatedSubmissionType } from '../types/fyllutForm';
import UXSignals from './ux-signals/UXSignals';

interface KvitteringsTilleggProps {
  uxSignalsId?: string;
  uxSignalsInnsending?: DeprecatedSubmissionType;
  uxSignalsSubmissionTypes?: AllowedSubmissionType[];
}

export const KvitteringsTillegg = ({
  uxSignalsId,
  uxSignalsInnsending,
  uxSignalsSubmissionTypes,
}: KvitteringsTilleggProps) => {
  if (!uxSignalsId) return null;

  // TODO: uxSignalsInnsending erstattes av uxSignalsSubmissionTypes og skal fjernes
  if ((uxSignalsInnsending && uxSignalsInnsending === 'INGEN') || uxSignalsInnsending === 'KUN_PAPIR') return null;

  if (uxSignalsSubmissionTypes && !uxSignalsSubmissionTypes?.includes('DIGITAL')) return null;

  const shouldRenderDemo = process.env.NEXT_PUBLIC_NAIS_CLUSTER_NAME !== 'prod-gcp';

  return <UXSignals id={uxSignalsId} demo={shouldRenderDemo} />;
};
