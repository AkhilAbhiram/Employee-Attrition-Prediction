export default function DashboardCard({ title, value }) {
  return <div style={{ padding: '1rem', border: '1px solid #ddd', margin: '0.5rem 0' }}><strong>{title}</strong><div>{value}</div></div>;
}
