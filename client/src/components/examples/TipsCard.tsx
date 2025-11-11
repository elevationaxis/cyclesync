import TipsCard from '../TipsCard';

export default function TipsCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <TipsCard
        category="Mind"
        tips={[
          'Journal your thoughts without judgment',
          'Practice gentle breathing exercises',
          'Allow yourself to feel what you feel',
        ]}
      />
      <TipsCard
        category="Body"
        tips={[
          'Take a warm bath or shower',
          'Gentle stretching or yoga',
          'Rest when your body asks for it',
        ]}
      />
      <TipsCard
        category="Food"
        tips={[
          'Warm, nourishing soups and stews',
          'Iron-rich foods like leafy greens',
          'Dark chocolate if you are craving it',
        ]}
      />
      <TipsCard
        category="Flow"
        tips={[
          'Keep your schedule light',
          'Say no to unnecessary commitments',
          'Create cozy spaces for yourself',
        ]}
      />
    </div>
  );
}
