import Navbar from '../components/Navbar';
import PredictionForm from '../components/PredictionForm';

export default function Home() {
  return (
    <div>
      <Navbar />
      <h1>Employee Attrition Prediction</h1>
      <PredictionForm />
    </div>
  );
}
