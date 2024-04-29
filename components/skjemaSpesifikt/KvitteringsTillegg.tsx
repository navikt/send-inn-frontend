import UXSignals from './ux-signals/UXSignals';

interface KvitteringsTilleggProps {
  uxSignalsId?: string;
}

export const KvitteringsTillegg = ({ uxSignalsId }: KvitteringsTilleggProps) => {
  // FIXME: Add demo mode prop
  return <UXSignals id={uxSignalsId} demo={true} />;
};
