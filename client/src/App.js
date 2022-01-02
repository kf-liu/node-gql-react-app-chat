import { Container } from 'react-bootstrap';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ApolloProvider from './ApolloProvider';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import './App.scss';

function App() {

  return (
    <ApolloProvider>
      <BrowserRouter>
        <Container className="pt-5">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
