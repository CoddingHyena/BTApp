import React, { useState, useRef } from 'react';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useImportCsvMutation } from '../store/api/apiSlice';
import { setMechs } from '../store/slices/mechSlice';
import { useAppDispatch } from '../hooks/reduxHooks';

// interface FileUploadProps {
//   onSuccess?: () => void;
// }

interface FileUploadProps {
  onSuccess?: () => void;
  onFileSelect?: (selectedFile: File) => void;
  accept?: string;
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  
  // RTK Query mutation hook
  const [importCsv, { isLoading }] = useImportCsvMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setErrorMessage('Please select a file first');
      return;
    }

    if (!file.name.endsWith('.csv')) {
      setErrorMessage('Only CSV files are supported');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await importCsv(formData).unwrap();
      
      // Update Redux store with imported mechs
      if (result.mechs) {
        dispatch(setMechs(result.mechs));
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
    } catch (error) {
      console.error('Failed to import CSV:', error);
      setErrorMessage(
        error instanceof Error 
          ? `Error: ${error.message}` 
          : 'Failed to import file. Please check the file format and try again.'
      );
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Select BattleMech CSV file</Form.Label>
        <Form.Control
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          ref={fileInputRef}
          disabled={isLoading}
        />
        <Form.Text className="text-muted">
          Upload a CSV file containing BattleMech data in the correct format.
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
          'Import CSV'
        )}
      </Button>
    </Form>
  );
};

export default FileUpload;