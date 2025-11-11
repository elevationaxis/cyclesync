import PhaseCard from '../PhaseCard';

export default function PhaseCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <PhaseCard phase="menstrual" />
      <PhaseCard phase="follicular" />
      <PhaseCard phase="ovulatory" />
      <PhaseCard phase="luteal" />
    </div>
  );
}
