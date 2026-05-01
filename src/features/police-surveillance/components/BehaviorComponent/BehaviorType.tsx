import DonutChart from "../../../../shared/ui/molecules/DonutChart";

export default function BehaviorType() {
  return (
    <>
      <DonutChart
        data={[
          { id: 0, value: 45, label: 'Theft', color: '#f06261' },
          { id: 1, value: 20, label: 'Fainting', color: '#ffb338' },
          { id: 2, value: 10, label: 'Fight', color: '#14B8A6' },
        ]}
        // totalLabel="CASES"
        width={240}
      />
    </>
  );
}