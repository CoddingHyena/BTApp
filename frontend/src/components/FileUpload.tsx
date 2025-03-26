// // src/components/FileUpload.tsx
// import React, { useState, useRef } from 'react';

// interface FileUploadProps {
//   onFileSelect: (file: File) => void;
//   accept?: string;
//   label?: string;
// }

// const FileUpload: React.FC<FileUploadProps> = ({
//   onFileSelect,
//   accept = '.csv',
//   label = 'Выберите файл или перетащите его сюда'
// }) => {
//   const [isDragging, setIsDragging] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!isDragging) {
//       setIsDragging(true);
//     }
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
    
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       const file = e.dataTransfer.files[0];
//       setSelectedFile(file);
//       onFileSelect(file);
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       setSelectedFile(file);
//       onFileSelect(file);
//     }
//   };

//   const handleButtonClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   return (
//     <div
//       className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
//         isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
//       }`}
//       onDragEnter={handleDragEnter}
//       onDragLeave={handleDragLeave}
//       onDragOver={handleDragOver}
//       onDrop={handleDrop}
//       onClick={handleButtonClick}
//     >
//       <input
//         ref={fileInputRef}
//         type="file"
//         className="hidden"
//         onChange={handleFileChange}
//         accept={accept}
//       />
      
//       <div className="mb-4">
//         <svg
//           className="mx-auto h-12 w-12 text-gray-400"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           aria-hidden="true"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//           />
//         </svg>
//       </div>
      
//       <p className="text-sm text-gray-600">{label}</p>
      
//       {selectedFile && (
//         <div className="mt-3">
//           <span className="text-sm font-medium text-blue-600">{selectedFile.name}</span>
//           <span className="ml-2 text-xs text-gray-500">
//             ({(selectedFile.size / 1024).toFixed(2)} KB)
//           </span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUpload;

// src/components/FileUpload.tsx
import React, { useState, useRef } from 'react';
import { Form, Card } from 'react-bootstrap';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = '.csv',
  label = 'Выберите файл или перетащите его сюда'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="d-flex justify-content-center"> {/* Центрируем компонент */}
      <Card 
        className={`text-center ${isDragging ? 'border-primary bg-light' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleButtonClick}
        style={{ 
          cursor: 'pointer',
          width: '50%', // Уменьшаем ширину до 50%
          maxWidth: '500px', // Максимальная ширина для контроля на больших экранах
          height: 'auto' // Высота будет пропорциональна содержимому
        }}
      >
        <Card.Body className="py-3"> {/* Уменьшаем вертикальные отступы */}
          <Form.Control
            ref={fileInputRef}
            type="file"
            className="d-none"
            onChange={handleFileChange}
            accept={accept}
          />
          
          <div className="mb-2"> {/* Уменьшаем отступ снизу */}
            <i className="bi bi-cloud-upload fs-4 text-secondary"></i> {/* Уменьшаем размер иконки */}
          </div>
          
          <p className="text-muted small mb-1">{label}</p> {/* Уменьшаем размер текста и отступ снизу */}
          
          {selectedFile && (
            <div className="mt-2"> {/* Уменьшаем отступ сверху */}
              <span className="text-primary fw-bold small">{selectedFile.name}</span>
              <span className="ms-2 text-muted small">
                ({(selectedFile.size / 1024).toFixed(2)} KB)
              </span>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default FileUpload;