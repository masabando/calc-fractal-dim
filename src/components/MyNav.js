import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

// ナビゲーションバー。
// カッコいいかなと思って作ったけど、ナビゲーションはしていない。

export default function MyNav() {
  return (
    <Navbar className="bg-body-tertiary sticky-top">
      <Container fluid>
        <Navbar.Brand href="#home">フラクタル次元計算</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
          </Nav> */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
