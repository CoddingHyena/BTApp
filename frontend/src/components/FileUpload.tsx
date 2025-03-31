// import React, { useState, useRef } from 'react';
// import { Button, Form, Alert, Spinner } from 'react-bootstrap';
// import { useImportCsvMutation } from '../store/api/apiSlice';
// import { setMechs } from '../store/slices/mechSlice';
// import { useAppDispatch } from '../hooks/reduxHooks';

// // interface FileUploadProps {
// //   onSuccess?: () => void;
// // }

// interface FileUploadProps {
//   onSuccess?: () => void;
//   onFileSelect?: (selectedFile: File) => void;
//   accept?: string;
//   label?: string;
// }

// const FileUpload: React.FC<FileUploadProps> = ({ onSuccess }) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const dispatch = useAppDispatch();
  
//   // RTK Query mutation hook
//   const [importCsv, { isLoading }] = useImportCsvMutation();

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0] || null;
//     setFile(selectedFile);
//     setErrorMessage(null);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!file) {
//       setErrorMessage('Please select a file first');
//       return;
//     }

//     if (!file.name.endsWith('.csv')) {
//       setErrorMessage('Only CSV files are supported');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('file', file);
      
//       const result = await importCsv(formData).unwrap();
      
//       // Update Redux store with imported mechs
//       if (result.mechs) {
//         dispatch(setMechs(result.mechs));
//       }
      
//       // Reset form
//       setFile(null);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
      
//       // Call success callback if provided
//       if (onSuccess) {
//         onSuccess();
//       }
//     } catch (error) {
//       console.error('Failed to import CSV:', error);
//       setErrorMessage(
//         error instanceof Error 
//           ? `Error: ${error.message}` 
//           : 'Failed to import file. Please check the file format and try again.'
//       );
//     }
//   };

//   return (
//     <Form onSubmit={handleSubmit}>
//       {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      
//       <Form.Group controlId="formFile" className="mb-3">
//         <Form.Label>Select BattleMech CSV file</Form.Label>
//         <Form.Control
//           type="file"
//           accept=".csv"
//           onChange={handleFileChange}
//           ref={fileInputRef}
//           disabled={isLoading}
//         />
//         <Form.Text className="text-muted">
//           Upload a CSV file containing BattleMech data in the correct format.
//         </Form.Text>
//       </Form.Group>
      
//       <Button 
//         variant="primary" 
//         type="submit" 
//         disabled={!file || isLoading}
//       >
//         {isLoading ? (
//           <>
//             <Spinner
//               as="span"
//               animation="border"
//               size="sm"
//               role="status"
//               aria-hidden="true"
//               className="me-2"
//             />
//             Importing...
//           </>
//         ) : (
//           'Import CSV'
//         )}
//       </Button>
//     </Form>
//   );
// };

// export default FileUpload;

// import React, { useState, useRef, useEffect } from 'react';
// import { Button, Form, Alert, Spinner } from 'react-bootstrap';
// import { useImportCsvMutation } from '../store/api/apiSlice';
// import { setMechs } from '../store/slices/mechSlice';
// import { useAppDispatch } from '../hooks/reduxHooks';

// interface FileUploadProps {
//   onSuccess?: () => void;
//   onFileSelect?: (selectedFile: File) => void;
//   accept?: string;
//   label?: string;
// }

// const FileUpload: React.FC<FileUploadProps> = ({
//   onSuccess,
//   onFileSelect,
//   accept = '.csv',
//   label = 'Select BattleMech CSV file'
// }) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const dispatch = useAppDispatch();
  
//   // RTK Query mutation hook
//   const [importCsv, { isLoading, isError, error, isSuccess, data }] = useImportCsvMutation();

//   // Handle file selection
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0] || null;
//     setFile(selectedFile);
//     setErrorMessage(null);
    
//     // Call onFileSelect callback if provided
//     if (selectedFile && onFileSelect) {
//       onFileSelect(selectedFile);
//     }
//   };

//   // Reset form when import is successful
//   useEffect(() => {
//     if (isSuccess && data) {
//       // Update Redux store with imported mechs
//       if (data.mechs) {
//         dispatch(setMechs(data.mechs));
//       }
      
//       // Reset form
//       setFile(null);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
      
//       // Call success callback if provided
//       if (onSuccess) {
//         onSuccess();
//       }
//     }
//   }, [isSuccess, data, dispatch, onSuccess]);

//   // Show error message when import fails
//   useEffect(() => {
//     if (isError && error) {
//       console.error('Failed to import CSV:', error);
      
//       // Display error message based on error type
//       if ('status' in error) {
//         setErrorMessage(
//           `Server error: ${error.status}. Please check if the CSV format is correct or try again later.`
//         );
//       } else if (error instanceof Error) {
//         setErrorMessage(`Error: ${error.message}`);
//       } else {
//         setErrorMessage('Failed to import file. Please check the file format and try again.');
//       }
//     }
//   }, [isError, error]);

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!file) {
//       setErrorMessage('Please select a file first');
//       return;
//     }

//     if (!file.name.endsWith('.csv') && accept === '.csv') {
//       setErrorMessage('Only CSV files are supported');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('file', file);
      
//       // Trigger the import mutation
//       await importCsv(formData);
//     } catch (err) {
//       // Additional error handling if needed
//       console.error('Unexpected error during import:', err);
//     }
//   };

//   return (
//     <Form onSubmit={handleSubmit}>
//       {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
//       {isSuccess && <Alert variant="success">File imported successfully!</Alert>}
      
//       <Form.Group controlId="formFile" className="mb-3">
//         <Form.Label>{label}</Form.Label>
//         <Form.Control
//           type="file"
//           accept={accept}
//           onChange={handleFileChange}
//           ref={fileInputRef}
//           disabled={isLoading}
//         />
//         <Form.Text className="text-muted">
//           Upload a file containing data in the correct format.
//         </Form.Text>
//       </Form.Group>
      
//       <Button 
//         variant="primary" 
//         type="submit" 
//         disabled={!file || isLoading}
//       >
//         {isLoading ? (
//           <>
//             <Spinner
//               as="span"
//               animation="border"
//               size="sm"
//               role="status"
//               aria-hidden="true"
//               className="me-2"
//             />
//             Importing...
//           </>
//         ) : (
//           'Import File'
//         )}
//       </Button>
//     </Form>
//   );
// };

// export default FileUpload;

// import React, { useState, useRef, useEffect } from 'react';
// import { Button, Form, Alert, Spinner } from 'react-bootstrap';
// import { useImportCsvMutation } from '../store/api/apiSlice';
// import { setMechs } from '../store/slices/mechSlice';
// import { RawMech, Mech } from '../types/mech';
// import { useAppDispatch } from '../hooks/reduxHooks';

// interface FileUploadProps {
//   onSuccess?: () => void;
//   onFileSelect?: (selectedFile: File) => void;
//   accept?: string;
//   label?: string;
// }

// const FileUpload: React.FC<FileUploadProps> = ({
//   onSuccess,
//   onFileSelect,
//   accept = '.csv',
//   label = 'Select BattleMech CSV file'
// }) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const dispatch = useAppDispatch();
  
//   // RTK Query mutation hook
//   const [importCsv, { isLoading, isError, error, isSuccess, data }] = useImportCsvMutation();

//   // Handle file selection
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0] || null;
//     setFile(selectedFile);
//     setErrorMessage(null);
    
//     // Call onFileSelect callback if provided
//     if (selectedFile && onFileSelect) {
//       onFileSelect(selectedFile);
//     }
//   };

//   // Reset form when import is successful
//   useEffect(() => {
//     if (isSuccess && data) {
//       // Update Redux store with imported mechs
//       if (data.mechs) {
//         // Преобразуем RawMech[] в Mech[], чтобы соответствовать ожиданиям setMechs
//         const convertedMechs: Mech[] = data.mechs.map(rawMech => ({
//           ...rawMech,
//           // Преобразуем числовой rulesLevel в строку, если это необходимо
//           rulesLevel: String(rawMech.rulesLevel),
//           // Добавляем отсутствующие поля, которые могут быть в Mech, но нет в RawMech
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString()
//         }));
        
//         dispatch(setMechs(convertedMechs));
//       }
      
//       // Reset form
//       setFile(null);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
      
//       // Call success callback if provided
//       if (onSuccess) {
//         onSuccess();
//       }
//     }
//   }, [isSuccess, data, dispatch, onSuccess]);

//   // Show error message when import fails
//   useEffect(() => {
//     if (isError && error) {
//       console.error('Failed to import CSV:', error);
      
//       // Display error message based on error type
//       if ('status' in error) {
//         setErrorMessage(
//           `Server error: ${error.status}. Please check if the CSV format is correct or try again later.`
//         );
//       } else if (error instanceof Error) {
//         setErrorMessage(`Error: ${error.message}`);
//       } else {
//         setErrorMessage('Failed to import file. Please check the file format and try again.');
//       }
//     }
//   }, [isError, error]);

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!file) {
//       setErrorMessage('Please select a file first');
//       return;
//     }

//     if (!file.name.endsWith('.csv') && accept === '.csv') {
//       setErrorMessage('Only CSV files are supported');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('file', file);
      
//       // Trigger the import mutation
//       await importCsv(formData);
//     } catch (err) {
//       // Additional error handling if needed
//       console.error('Unexpected error during import:', err);
//     }
//   };

//   return (
//     <Form onSubmit={handleSubmit}>
//       {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
//       {isSuccess && <Alert variant="success">File imported successfully!</Alert>}
      
//       <Form.Group controlId="formFile" className="mb-3">
//         <Form.Label>{label}</Form.Label>
//         <Form.Control
//           type="file"
//           accept={accept}
//           onChange={handleFileChange}
//           ref={fileInputRef}
//           disabled={isLoading}
//         />
//         <Form.Text className="text-muted">
//           Upload a file containing data in the correct format.
//         </Form.Text>
//       </Form.Group>
      
//       <Button 
//         variant="primary" 
//         type="submit" 
//         disabled={!file || isLoading}
//       >
//         {isLoading ? (
//           <>
//             <Spinner
//               as="span"
//               animation="border"
//               size="sm"
//               role="status"
//               aria-hidden="true"
//               className="me-2"
//             />
//             Importing...
//           </>
//         ) : (
//           'Import File'
//         )}
//       </Button>
//     </Form>
//   );
// };

// export default FileUpload;


// import React, { useState, useRef, useEffect } from 'react';
// import { Button, Form, Alert, Spinner } from 'react-bootstrap';
// import { useImportCsvMutation } from '../store/api/apiSlice';
// import { setMechs } from '../store/slices/mechSlice';
// import { RawMech, Mech } from '../types/mech';
// import { useAppDispatch } from '../hooks/reduxHooks';

// interface FileUploadProps {
//   onSuccess?: () => void;
//   onFileSelect?: (selectedFile: File) => void;
//   accept?: string;
//   label?: string;
// }

// const FileUpload: React.FC<FileUploadProps> = ({
//   onSuccess,
//   onFileSelect,
//   accept = '.csv',
//   label = 'Select BattleMech CSV file'
// }) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const dispatch = useAppDispatch();
  
//   // RTK Query mutation hook
//   const [importCsv, { isLoading, isError, error, isSuccess, data }] = useImportCsvMutation();

//   // Handle file selection
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0] || null;
//     setFile(selectedFile);
//     setErrorMessage(null);
    
//     // Call onFileSelect callback if provided
//     if (selectedFile && onFileSelect) {
//       onFileSelect(selectedFile);
//     }
//   };

//   // Reset form when import is successful
//   useEffect(() => {
//     if (isSuccess && data) {
//       // Update Redux store with imported mechs
//       if (data.mechs) {
//         // Преобразуем RawMech[] в Mech[], учитывая все различия типов
//         const convertedMechs: Mech[] = data.mechs.map(rawMech => ({
//           id: rawMech.id,
//           dbId: rawMech.dbId,
//           name: rawMech.name,
//           unitType: rawMech.unitType,
//           technology: rawMech.technology,
//           chassis: rawMech.chassis,
//           era: rawMech.era,
//           year: rawMech.year,
//           // Преобразуем числовой rulesLevel в строку
//           rulesLevel: String(rawMech.rulesLevel),
//           tonnage: rawMech.tonnage,
//           battleValue: rawMech.battleValue,
//           pointValue: rawMech.pointValue,
//           // Явно приводим типы для полей, которые отличаются
//           cost: rawMech.cost ?? null,
//           rating: rawMech.rating ?? null,
//           designer: rawMech.designer ?? null,
//           // Обрабатываем поля, которых нет в RawMech
//           alphaCard: undefined,
//           recSheet: undefined,
//           vid: undefined,
//           rawMechId: rawMech.id, // Используем id как rawMechId
//           createdAt: rawMech.createdAt ?? new Date().toISOString(),
//           updatedAt: rawMech.updatedAt ?? new Date().toISOString()
//         }));
        
//         dispatch(setMechs(convertedMechs));
//       }
      
//       // Reset form
//       setFile(null);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
      
//       // Call success callback if provided
//       if (onSuccess) {
//         onSuccess();
//       }
//     }
//   }, [isSuccess, data, dispatch, onSuccess]);

//   // Show error message when import fails
//   useEffect(() => {
//     if (isError && error) {
//       console.error('Failed to import CSV:', error);
      
//       // Display error message based on error type
//       if ('status' in error) {
//         setErrorMessage(
//           `Server error: ${error.status}. Please check if the CSV format is correct or try again later.`
//         );
//       } else if (error instanceof Error) {
//         setErrorMessage(`Error: ${error.message}`);
//       } else {
//         setErrorMessage('Failed to import file. Please check the file format and try again.');
//       }
//     }
//   }, [isError, error]);

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!file) {
//       setErrorMessage('Please select a file first');
//       return;
//     }

//     if (!file.name.endsWith('.csv') && accept === '.csv') {
//       setErrorMessage('Only CSV files are supported');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('file', file);
      
//       // Trigger the import mutation
//       await importCsv(formData);
//     } catch (err) {
//       // Additional error handling if needed
//       console.error('Unexpected error during import:', err);
//     }
//   };

//   return (
//     <Form onSubmit={handleSubmit}>
//       {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
//       {isSuccess && <Alert variant="success">File imported successfully!</Alert>}
      
//       <Form.Group controlId="formFile" className="mb-3">
//         <Form.Label>{label}</Form.Label>
//         <Form.Control
//           type="file"
//           accept={accept}
//           onChange={handleFileChange}
//           ref={fileInputRef}
//           disabled={isLoading}
//         />
//         <Form.Text className="text-muted">
//           Upload a file containing data in the correct format.
//         </Form.Text>
//       </Form.Group>
      
//       <Button 
//         variant="primary" 
//         type="submit" 
//         disabled={!file || isLoading}
//       >
//         {isLoading ? (
//           <>
//             <Spinner
//               as="span"
//               animation="border"
//               size="sm"
//               role="status"
//               aria-hidden="true"
//               className="me-2"
//             />
//             Importing...
//           </>
//         ) : (
//           'Import File'
//         )}
//       </Button>
//     </Form>
//   );
// };

// export default FileUpload;

import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useImportCsvMutation } from '../store/api/apiSlice';
import { setMechs } from '../store/slices/mechSlice';
import { RawMech, Mech } from '../types/mech';
import { useAppDispatch } from '../hooks/reduxHooks';

interface FileUploadProps {
  onSuccess?: () => void;
  onFileSelect?: (selectedFile: File) => void;
  accept?: string;
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onSuccess,
  onFileSelect,
  accept = '.csv',
  label = 'Select BattleMech CSV file'
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  
  // RTK Query mutation hook
  const [importCsv, { isLoading, isError, error, isSuccess, data }] = useImportCsvMutation();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setErrorMessage(null);
    
    // Call onFileSelect callback if provided
    if (selectedFile && onFileSelect) {
      onFileSelect(selectedFile);
    }
  };

  // Reset form when import is successful
  useEffect(() => {
    if (isSuccess && data) {
      // Update Redux store with imported mechs
      if (data.mechs) {
        // Явно указываем тип для данных, полученных от API
        const rawMechs: RawMech[] = data.mechs;
        
        // Преобразуем RawMech[] в Mech[]
        const convertedMechs: Mech[] = rawMechs.map(rawMech => ({
          id: rawMech.id,
          dbId: rawMech.dbId,
          name: rawMech.name,
          unitType: rawMech.unitType,
          technology: rawMech.technology,
          chassis: rawMech.chassis,
          era: rawMech.era,
          year: rawMech.year,
          rulesLevel: String(rawMech.rulesLevel),
          tonnage: rawMech.tonnage,
          battleValue: rawMech.battleValue,
          pointValue: rawMech.pointValue,
          cost: rawMech.cost ?? null,
          rating: rawMech.rating ?? null,
          designer: rawMech.designer ?? null,
          alphaCard: undefined,
          recSheet: undefined,
          vid: undefined,
          rawMechId: rawMech.id,
          createdAt: rawMech.createdAt ?? new Date().toISOString(),
          updatedAt: rawMech.updatedAt ?? new Date().toISOString()
        }));
        
        dispatch(setMechs(convertedMechs));
      }
      
      // Reset form
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [isSuccess, data, dispatch, onSuccess]);

  // Show error message when import fails
  useEffect(() => {
    if (isError && error) {
      console.error('Failed to import CSV:', error);
      
      // Display error message based on error type
      if ('status' in error) {
        setErrorMessage(
          `Server error: ${error.status}. Please check if the CSV format is correct or try again later.`
        );
      } else if (error instanceof Error) {
        setErrorMessage(`Error: ${error.message}`);
      } else {
        setErrorMessage('Failed to import file. Please check the file format and try again.');
      }
    }
  }, [isError, error]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setErrorMessage('Please select a file first');
      return;
    }

    if (!file.name.endsWith('.csv') && accept === '.csv') {
      setErrorMessage('Only CSV files are supported');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Trigger the import mutation
      await importCsv(formData);
    } catch (err) {
      // Additional error handling if needed
      console.error('Unexpected error during import:', err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {isSuccess && <Alert variant="success">File imported successfully!</Alert>}
      
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type="file"
          accept={accept}
          onChange={handleFileChange}
          ref={fileInputRef}
          disabled={isLoading}
        />
        <Form.Text className="text-muted">
          Upload a file containing data in the correct format.
        </Form.Text>
      </Form.Group>
      
      <Button 
        variant="primary" 
        type="submit" 
        disabled={!file || isLoading}
      >
        {isLoading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
            Importing...
          </>
        ) : (
          'Import File'
        )}
      </Button>
    </Form>
  );
};

export default FileUpload;