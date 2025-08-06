import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Alert, Spinner, Image } from 'react-bootstrap';
import { getImageUrl } from '../config/api';

interface UniversalImageUploadProps {
  onImageUploaded?: (imageUrl: string) => void;
  currentImageUrl?: string;
  label?: string;
  accept?: string;
  uploadFunction: (formData: FormData) => Promise<{ success: boolean; filename: string; url: string; message: string }>;
  uploadType: 'faction-logo' | 'faction-banner' | 'period-image' | 'period-banner' | 'game-icon' | 'game-banner' | 'mission-deployment';
}

const UniversalImageUpload: React.FC<UniversalImageUploadProps> = ({
  onImageUploaded,
  currentImageUrl,
  label = 'Загрузить изображение',
  accept = 'image/png,image/jpeg,image/jpg,image/svg+xml',
  uploadFunction,
  uploadType
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl ? getImageUrl(currentImageUrl) : null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Отслеживаем изменения currentImageUrl
  useEffect(() => {
    console.log('currentImageUrl changed:', currentImageUrl);
    if (currentImageUrl && !file) {
      const fullUrl = getImageUrl(currentImageUrl);
      console.log('Setting preview URL from currentImageUrl:', fullUrl);
      setPreviewUrl(fullUrl);
    } else if (!currentImageUrl && !file) {
      console.log('No currentImageUrl and no file, clearing preview');
      setPreviewUrl(null);
    }
  }, [currentImageUrl, file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setErrorMessage(null);

    console.log('File selected:', selectedFile);

    if (selectedFile) {
      // Создаем превью для изображения
      const reader = new FileReader();
      reader.onload = (event) => {
        const previewUrl = event.target?.result as string;
        console.log('Preview URL created:', previewUrl);
        setPreviewUrl(previewUrl);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      const fallbackUrl = currentImageUrl ? getImageUrl(currentImageUrl) : null;
      console.log('No file selected, using fallback URL:', fallbackUrl);
      setPreviewUrl(fallbackUrl);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('Пожалуйста, выберите файл для загрузки');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      console.log('Starting image upload:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadType
      });

      const formData = new FormData();
      formData.append('file', file);
      
      const result = await uploadFunction(formData);
      
      console.log('Upload result:', result);
      
      if (result.success) {
        // Обновляем превью с URL загруженного изображения
        const fullImageUrl = getImageUrl(result.url);
        console.log('Full image URL:', fullImageUrl);
        console.log('Setting preview URL to:', fullImageUrl);
        
        setPreviewUrl(fullImageUrl);
        
        // Вызываем callback с URL изображения
        if (onImageUploaded) {
          console.log('Calling onImageUploaded with URL:', result.url);
          console.log('Full image URL for callback:', fullImageUrl);
          onImageUploaded(result.url);
        } else {
          console.warn('onImageUploaded callback is not provided');
        }
        
        // Сбрасываем файл
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        console.log('Upload completed successfully');
      } else {
        console.error('Upload failed:', result.message);
        setErrorMessage('Upload failed: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      setErrorMessage(
        error instanceof Error 
          ? `Ошибка: ${error.message}` 
          : 'Не удалось загрузить изображение. Проверьте формат файла и попробуйте снова.'
      );
    } finally {
      setIsLoading(false);
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

  const getUploadTypeLabel = () => {
    switch (uploadType) {
      case 'faction-logo':
        return 'Логотип фракции';
      case 'faction-banner':
        return 'Баннер фракции';
      case 'period-image':
        return 'Изображение периода';
      case 'period-banner':
        return 'Баннер периода';
      case 'game-icon':
        return 'Иконка игры';
      case 'game-banner':
        return 'Баннер игры';
      case 'mission-deployment':
        return 'Схема расстановки миссии';
      default:
        return 'Изображение';
    }
  };

  return (
    <div>
      {errorMessage && <Alert variant="danger" className="mb-3">{errorMessage}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label>{label || getUploadTypeLabel()}</Form.Label>
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
                `Загрузить ${getUploadTypeLabel().toLowerCase()}`
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
              onLoad={() => {
                console.log('Preview image loaded successfully:', previewUrl);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalImageUpload; 