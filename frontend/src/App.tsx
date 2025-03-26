

// // src/App.tsx
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import ImportPage from './pages/ImportPage';

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen">
//         {/* Навигационная панель */}
//         <nav className="bg-gray-800 text-white p-4">
//           <div className="max-w-7xl mx-auto flex justify-between items-center">
//             <div className="font-bold text-xl">BoardGame Helper</div>
//             <div className="space-x-4">
//               <Link to="/" className="hover:text-gray-300">Главная</Link>
//               <Link to="/import" className="hover:text-gray-300">Импорт данных</Link>
//             </div>
//           </div>
//         </nav>

//         {/* Основное содержимое */}
//         <main className="py-6">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/import" element={<ImportPage />} />
//           </Routes>
//         </main>
        
//         {/* Подвал */}
//         <footer className="bg-gray-800 text-white p-4 mt-auto">
//           <div className="max-w-7xl mx-auto text-center">
//             <p>© 2025 BoardGame Helper | Classic Battletech</p>
//           </div>
//         </footer>
//       </div>
//     </Router>
//   );
// }

// // Простой компонент домашней страницы
// function Home() {
//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Добро пожаловать в BoardGame Helper!</h1>
//       <p className="mb-4">
//         Это приложение поможет вам управлять данными мехов для игры Classic Battletech.
//       </p>
//       <div className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold mb-3">Возможности приложения:</h2>
//         <ul className="list-disc list-inside space-y-1">
//           <li>Импорт данных мехов из CSV-файлов</li>
//           <li>Управление ростерами мехов</li>
//           <li>Автоматизация расчетов в игре</li>
//           <li>Упрощение игрового процесса</li>
//         </ul>
//         <div className="mt-6">
//           <Link
//             to="/import"
//             className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
//           >
//             Начать импорт данных
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

// // src/App.tsx
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Layout from './components/Layout';
// import HomePage from './pages/HomePage';
// import ImportPage from './pages/ImportPage';

// function App() {
//   return (
//     <Router>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/import" element={<ImportPage />} />
//         </Routes>
//       </Layout>
//     </Router>
//   );
// }

// export default App;

// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ImportPage from './pages/ImportPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/import" element={<ImportPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;