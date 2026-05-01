import DonutChart from "../../../../shared/ui/molecules/DonutChart";

export default function CrimeStatus() {
  return (
    <>
      <DonutChart
        data={[
          { id: 0, value: 45, label: 'High', color: '#f06261' },
          { id: 1, value: 20, label: 'Medium', color: '#ffb338' },
          { id: 2, value: 10, label: 'Low', color: '#14B8A6' },
        ]}
        // totalLabel="CASES"
        width={240}
      />
    </>
  );
}