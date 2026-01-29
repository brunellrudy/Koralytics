import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import FormWizard from './pages/FormWizard';
import Consentement from './pages/Consentement';
import Gdpr from './pages/Gdpr';

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/form" element={<FormWizard />} />
      <Route path="/consentement" element={<Consentement />} />
      <Route path="/gdpr" element={<Gdpr />} />
    </Routes>
  </Layout>
);

export default App;
