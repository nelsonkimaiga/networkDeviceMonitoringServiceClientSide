import { Dashboard } from './views/Dashboard';
import { Navbar, Container } from 'react-bootstrap';
import './App.css';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar bg="white" border="bottom" className="border-bottom mb-4">
        <Container>
          <Navbar.Brand href="#home" className="fw-black tracking-tighter text-dark">
            BCS MONITOR
          </Navbar.Brand>
        </Container>
      </Navbar>

      <main className="flex-grow-1">
        <Dashboard />
      </main>

      <footer className="mt-auto py-4 border-top bg-white">
        <Container className="d-flex justify-content-between align-items-center">
          <span className="small text-uppercase fw-bold text-muted" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>
            © 2026 BCS Group
          </span>
        </Container>
      </footer>
    </div>
  );
}

export default App;
