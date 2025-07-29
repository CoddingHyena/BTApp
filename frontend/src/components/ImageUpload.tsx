import React, { useState, useRef } from 'react';
import { Button, Form, Alert, Spinner, Image } from 'react-bootstrap';
import { useUploadMissionImageMutation } from '../store/api/apiSlice';
import { getImageUrl } from '../config/api';

interface ImageUploadProps {
  onImageUploaded?: (imageUrl: string) => void;
  currentImageUrl?: string;
  label?: string;
  accept?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  currentImageUrl,
  label = 'Загрузить изображение схемы расстановки',
  accept = 'image/png,image/jpeg,image/jpg,image/svg+xml'
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl ? getImageUrl(currentImageUrl) : null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadImage, { isLoading }] = useUploadMissionImageMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setErrorMessage(null);

    if (selectedFile) {
      // Создаем превью для изображения
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(currentImageUrl ? getImageUrl(currentImageUrl) : null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('Пожалуйста, выберите файл для загрузки');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await uploadImage(formData).unwrap();
      
      if (result.success) {
        // Обновляем превью с URL загруженного изображения
        setPreviewUrl(getImageUrl(result.url));
        
        // Вызываем callback с URL изображения
        if (onImageUploaded) {
          onImageUploaded(result.url);
        }
        
        // Сбрасываем файл
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      setErrorMessage(
        error instanceof Error 
          ? `Ошибка: ${error.message}` 
          : 'Не удалось загрузить изображение. Проверьте формат файла и попробуйте снова.'
      );
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageUploaded) {
      onImageUploaded('');
    }
  };

  const getFileSize = (file: File): string => {
    const sizeInMB = file.size / (1024 * 1024);
    return `${sizeInMB.toFixed(2)} MB`;
  };

  return (
    <div>
      {errorMessage && <Alert variant="danger" className="mb-3">{errorMessage}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type="file"
          accept={accept}
          onChange={handleFileChange}
          ref={fileInputRef}
          disabled={isLoading}
        />
        <Form.Text className="text-muted">
          Поддерживаемые форматы: PNG, JPG, JPEG, SVG. Максимальный размер: 5MB.
        </Form.Text>
      </Form.Group>

      {file && (
        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <strong>Выбранный файл:</strong>
            <span className="ms-2 text-muted">
              {file.name} ({getFileSize(file)})
            </span>
          </div>
          <div className="d-flex gap-2">
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleUpload}
              disabled={isLoading}
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
                  Загрузка...
                </>
              ) : (
                'Загрузить изображение'
              )}
            </Button>
            <Button 
              variant="outline-secondary" 
              size="sm"
                             onClick={() => {
                 setFile(null);
                 setPreviewUrl(currentImageUrl ? getImageUrl(currentImageUrl) : null);
                 if (fileInputRef.current) {
                   fileInputRef.current.value = '';
                 }
               }}
            >
              Отменить
            </Button>
          </div>
        </div>
      )}

      {previewUrl && (
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong>Предварительный просмотр:</strong>
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={handleRemoveImage}
            >
              Удалить
            </Button>
          </div>
          <div className="border rounded p-2" style={{ maxWidth: '400px' }}>
            <Image 
              src={previewUrl} 
              alt="Предварительный просмотр" 
              fluid 
              className="img-thumbnail"
              style={{ maxHeight: '300px', objectFit: 'contain' }}
              onError={(e) => {
                console.error('Failed to load preview image:', previewUrl);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 