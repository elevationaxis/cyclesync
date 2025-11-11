import PartnerView from '@/components/PartnerView';

export default function PartnerViewPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PartnerView cycleDay={12} partnerName="Your Partner" />
    </div>
  );
}
