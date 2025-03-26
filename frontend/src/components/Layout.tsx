// // src/components/Layout.tsx
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Navbar, Container, Nav } from 'react-bootstrap';

// interface LayoutProps {
//   children: React.ReactNode;
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//   return (
//     <div className="d-flex flex-column min-vh-100">
//       {/* Навигационная панель */}
//       <Navbar bg="dark" variant="dark" expand="lg">
//         <Container>
//           <Navbar.Brand as={Link} to="/">BoardGame Helper</Navbar.Brand>
//           <Navbar.Toggle aria-controls="basic-navbar-nav" />
//           <Navbar.Collapse id="basic-navbar-nav">
//             <Nav className="ms-auto">
//               <Nav.Link as={Link} to="/">Главная</Nav.Link>
//               <Nav.Link as={Link} to="/import">Импорт данных</Nav.Link>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       {/* Основное содержимое */}
//       <main className="flex-grow-1">
//         {children}
//       </main>
      
//       {/* Подвал */}
//       <footer className="bg-dark text-white py-3 mt-auto">
//         <Container className="text-center">
//           <p className="mb-0">© 2025 BoardGame Helper | Classic Battletech</p>
//         </Container>
//       </footer>
//     </div>
//   );
// };

// export default Layout;

// src/components/Layout.tsx - обновленная версия
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Navbar, Container, Nav } from 'react-bootstrap';

// interface LayoutProps {
//   children: React.ReactNode;
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//   return (
//     <div className="d-flex flex-column min-vh-100">
//       {/* Навигационная панель */}
//       <Navbar bg="dark" variant="dark" expand="lg">
//         <Container fluid>
//           <Navbar.Brand as={Link} to="/">BoardGame Helper</Navbar.Brand>
//           <Navbar.Toggle aria-controls="basic-navbar-nav" />
//           <Navbar.Collapse id="basic-navbar-nav">
//             <Nav className="ms-auto">
//               <Nav.Link as={Link} to="/">Главная</Nav.Link>
//               <Nav.Link as={Link} to="/import">Импорт данных</Nav.Link>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       {/* Основное содержимое */}
//       <main className="flex-grow-1 w-100">
//         {children}
//       </main>
      
//       {/* Подвал */}
//       <footer className="bg-dark text-white py-3 mt-auto">
//         <Container fluid className="text-center">
//           <p className="mb-0">© 2025 BoardGame Helper | Classic Battletech</p>
//         </Container>
//       </footer>
//     </div>
//   );
// };

// export default Layout;/

// src/components/Layout.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100 w-100">
      {/* Навигационная панель */}
      <Navbar bg="dark" variant="dark" expand="lg" className="w-100">
        <Container fluid className="w-100">
          <Navbar.Brand as={Link} to="/">BTapp</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Главная</Nav.Link>
              <Nav.Link as={Link} to="/import">Импорт данных</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Основное содержимое */}
      <main className="flex-grow-1 w-100">
        {children}
      </main>
      
      {/* Подвал */}
      <footer className="bg-dark text-white py-3 mt-auto w-100">
        <Container fluid className="text-center w-100">
          <p className="mb-0">© 2025 BTapp| Classic Battletech</p>
        </Container>
      </footer>
    </div>
  );
};

export default Layout;