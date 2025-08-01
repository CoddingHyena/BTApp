
// // src/pages/ImportPage.tsx
// import React, { useState } from 'react';
// import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
// import FileUpload from '../components/FileUpload';
// import { mechImportService } from '../services/api';
// import { ImportResult } from '../types/mech';

// const ImportPage: React.FC = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [skipDuplicates, setSkipDuplicates] = useState(false);
//   const [updateExisting, setUpdateExisting] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [importResult, setImportResult] = useState<ImportResult | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const handleFileSelect = (selectedFile: File) => {
//     setFile(selectedFile);
//     // Сбрасываем предыдущие результаты при выборе нового файла
//     setImportResult(null);
//     setError(null);
//   };

//   const handleImport = async () => {
//     if (!file) {
//       setError('Пожалуйста, выберите файл для импорта');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError(null);
      
//       const result = await mechImportService.importMechsFromCsv(
//         file,
//         skipDuplicates,
//         updateExisting
//       );
      
//       setImportResult(result);
//     } catch (err) {
//       console.error('Ошибка при импорте:', err);
//       setError(err instanceof Error ? err.message : 'Произошла ошибка при импорте данных');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Container fluid className="py-5">
//           <h1 className="mb-4">Импорт данных мехов</h1>
        
//         <Card className="mb-4 shadow">
//           <Card.Body>
//             <Card.Title className="mb-3">Загрузка CSV-файла</Card.Title>
            
//             <FileUpload 
//               onFileSelect={handleFileSelect}
//               accept=".csv"
//               label="Выберите CSV-файл или перетащите его сюда"
//             />
            
//             <Form className="mt-4">
//               <Form.Check 
//                 type="checkbox"
//                 id="skipDuplicates"
//                 label="Пропускать дубликаты"
//                 checked={skipDuplicates}
//                 onChange={(e) => setSkipDuplicates(e.target.checked)}
//                 className="mb-2"
//               />
              
//               <Form.Check 
//                 type="checkbox"
//                 id="updateExisting"
//                 label="Обновлять существующие записи"
//                 checked={updateExisting}
//                 onChange={(e) => setUpdateExisting(e.target.checked)}
//               />
//             </Form>
            
//             <Button
//               variant="primary"
//               onClick={handleImport}
//               disabled={!file || isLoading}
//               className="mt-4"
//             >
//               {isLoading ? 'Импорт...' : 'Импортировать данные'}
//             </Button>
//           </Card.Body>
//         </Card>
        
//         {error && (
//           <Alert variant="danger">
//             <Alert.Heading>Ошибка</Alert.Heading>
//             <p>{error}</p>
//           </Alert>
//         )}
        
//         {importResult && (
//           <Alert variant={importResult.success ? 'success' : 'warning'}>
//             <Alert.Heading>
//               {importResult.success ? 'Импорт успешно завершен' : 'Импорт завершен с предупреждениями'}
//             </Alert.Heading>
            
//             <Row className="mb-3 mt-3">
//               <Col md={3}>
//                 <p className="mb-1 text-muted">Всего записей:</p>
//                 <h4>{importResult.totalRecords}</h4>
//               </Col>
//               <Col md={3}>
//                 <p className="mb-1 text-muted">Импортировано:</p>
//                 <h4>{importResult.importedRecords}</h4>
//               </Col>
//               <Col md={3}>
//                 <p className="mb-1 text-muted">Пропущено:</p>
//                 <h4>{importResult.skippedRecords}</h4>
//               </Col>
//               <Col md={3}>
//                 <p className="mb-1 text-muted">Время выполнения:</p>
//                 <h4>{(importResult.elapsedTimeMs / 1000).toFixed(2)} сек</h4>
//               </Col>
//             </Row>
            
//             {importResult.errors.length > 0 && (
//               <div>
//                 <p className="fw-bold mb-1">Ошибки:</p>
//                 <ul className="ps-4">
//                   {importResult.errors.map((err, index) => (
//                     <li key={index}>{err}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </Alert>
//         )}
//        </Container>
//   );
// };

// export default ImportPage;

// src/pages/ImportPage.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import FileUpload from '../components/FileUpload';
import { useImportCsvMutation } from '../store/api/apiSlice';
import { ImportResult } from '../types/mech';

const ImportPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [skipDuplicates, setSkipDuplicates] = useState(false);
  const [updateExisting, setUpdateExisting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Используем RTK Query мутацию вместо сервиса API
  const [importCsv, { isLoading, isSuccess, isError, error: importError, data }] = useImportCsvMutation();

  // Обработчик результатов импорта
  useEffect(() => {
    if (isSuccess && data) {
      // Ожидаем, что API возвращает данные формата ImportResult
      // Если API возвращает другой формат, нужно преобразовать
      if ('success' in data && 'totalRecords' in data) {
        setImportResult(data as unknown as ImportResult);
      } else if (data.mechs) {
        // Если API возвращает только список механизмов, создаем ImportResult
        const result: ImportResult = {
          success: true,
          totalRecords: data.mechs.length,
          importedRecords: data.mechs.length,
          skippedRecords: 0,
          errors: [],
          elapsedTimeMs: 0
        };
        setImportResult(result);
      }
      setError(null);
    }
  }, [isSuccess, data]);

  // Обработка ошибок
  useEffect(() => {
    if (isError && importError) {
      console.error('Ошибка при импорте:', importError);
      if ('data' in importError && importError.data) {
        setError(String(importError.data));
      } else if ('message' in importError) {
        setError(importError.message as string);
      } else {
        setError('Произошла ошибка при импорте данных');
      }
    }
  }, [isError, importError]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    // Сбрасываем предыдущие результаты при выборе нового файла
    setImportResult(null);
    setError(null);
  };

  const handleImport = async () => {
    if (!file) {
      setError('Пожалуйста, выберите файл для импорта');
      return;
    }

    try {
      // Создаем FormData и добавляем файл и опции
      const formData = new FormData();
      formData.append('file', file);
      formData.append('skipDuplicates', String(skipDuplicates));
      formData.append('updateExisting', String(updateExisting));
      
      // Вызываем мутацию RTK Query
      await importCsv(formData);
    } catch (err) {
      console.error('Unexpected error during import:', err);
      setError(err instanceof Error ? err.message : 'Произошла неожиданная ошибка');
    }
  };

  return (
    <Container fluid className="py-5">
      <h1 className="mb-4">Импорт данных мехов</h1>
      
      <Card className="mb-4 shadow">
        <Card.Body>
          <Card.Title className="mb-3">Загрузка CSV-файла</Card.Title>
          
          <FileUpload 
            onFileSelect={handleFileSelect}
            accept=".csv"
            label="Выберите CSV-файл или перетащите его сюда"
            onSuccess={() => {
              // Этот коллбэк будет вызван, если FileUpload сам выполнил импорт
              // Если мы обрабатываем импорт здесь, этот коллбэк не понадобится
            }}
          />
          
          <Form className="mt-4">
            <Form.Check 
              type="checkbox"
              id="skipDuplicates"
              label="Пропускать дубликаты"
              checked={skipDuplicates}
              onChange={(e) => setSkipDuplicates(e.target.checked)}
              className="mb-2"
            />
            
            <Form.Check 
              type="checkbox"
              id="updateExisting"
              label="Обновлять существующие записи"
              checked={updateExisting}
              onChange={(e) => setUpdateExisting(e.target.checked)}
            />
          </Form>
          
          <Button
            variant="primary"
            onClick={handleImport}
            disabled={!file || isLoading}
            className="mt-4"
          >
            {isLoading ? 'Импорт...' : 'Настраиваемый импорт'}
          </Button>
        </Card.Body>
      </Card>
      
      {error && (
        <Alert variant="danger">
          <Alert.Heading>Ошибка</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}
      
      {importResult && (
        <Alert variant={importResult.success ? 'success' : 'warning'}>
          <Alert.Heading>
            {importResult.success ? 'Импорт успешно завершен' : 'Импорт завершен с предупреждениями'}
          </Alert.Heading>
          
          <Row className="mb-3 mt-3">
            <Col md={3}>
              <p className="mb-1 text-muted">Всего записей:</p>
              <h4>{importResult.totalRecords}</h4>
            </Col>
            <Col md={3}>
              <p className="mb-1 text-muted">Импортировано:</p>
              <h4>{importResult.importedRecords}</h4>
            </Col>
            <Col md={3}>
              <p className="mb-1 text-muted">Пропущено:</p>
              <h4>{importResult.skippedRecords}</h4>
            </Col>
            <Col md={3}>
              <p className="mb-1 text-muted">Время выполнения:</p>
              <h4>{(importResult.elapsedTimeMs / 1000).toFixed(2)} сек</h4>
            </Col>
          </Row>
          
          {importResult.errors.length > 0 && (
            <div>
              <p className="fw-bold mb-1">Ошибки:</p>
              <ul className="ps-4">
                {importResult.errors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </Alert>
      )}
     </Container>
  );
};

export default ImportPage;