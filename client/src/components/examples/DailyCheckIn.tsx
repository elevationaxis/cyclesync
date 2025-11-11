import DailyCheckIn from '../DailyCheckIn';

export default function DailyCheckInExample() {
  return (
    <div className="p-6">
      <DailyCheckIn onSubmit={(data) => console.log('Submitted:', data)} />
    </div>
  );
}
