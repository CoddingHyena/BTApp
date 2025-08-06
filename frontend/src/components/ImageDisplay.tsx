import React, { useState } from 'react';
import { Image, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { getImageUrl } from '../config/api';

interface ImageDisplayProps {
  imageUrl?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  showUploadButton?: boolean;
  onImageUploaded?: (imageUrl: string) => void;
  uploadFunction?: (formData: FormData) => Promise<{ success: boolean; filename: string; url: string; message: string }>;
  uploadType?: string;
  uploadLabel?: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imageUrl,
  alt = 'Image',
  className = 'img-thumbnail',
  style = { maxHeight: '200px', objectFit: 'contain' },
  showUploadButton = false,
  onImageUploaded,
  uploadFunction,
  uploadType = 'image',
  uploadLabel = 'Загрузить изображение'
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadFunction) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const result = await uploadFunction(formData);
      
      if (result.success && onImageUploaded) {
        onImageUploaded(result.url);
        setShowUploadModal(false);
        setSelectedFile(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки изображения');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    if (onImageUploaded) {
      onImageUploaded('');
    }
  };

  return (
    <div className="image-display-container">
      {imageUrl ? (
        <div className="position-relative">
          <Image
            src={getImageUrl(imageUrl)}
            alt={alt}
            className={className}
            style={style}
            onError={(e) => {
              console.error('Failed to load image:', imageUrl);
              e.currentTarget.style.display = 'none';
            }}
          />
          {showUploadButton && (
            <div className="position-absolute top-0 end-0 p-2">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShowUploadModal(true)}
                title="Изменить изображение"
              >
                <i className="bi bi-pencil"></i>
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-4 border rounded">
          <div className="text-muted mb-2">Нет изображения</div>
          {showUploadButton && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setShowUploadModal(true)}
            >
              {uploadLabel}
            </Button>
          )}
        </div>
      )}

      {/* Модальное окно для загрузки */}
      {showUploadButton && uploadFunction && (
        <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{uploadLabel}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form.Group className="mb-3">
              <Form.Label>Выберите файл</Form.Label>
              <Form.Control
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              <Form.Text className="text-muted">
                Поддерживаемые форматы: PNG, JPG, JPEG, SVG. Максимальный размер: 5MB.
              </Form.Text>
            </Form.Group>

            {selectedFile && (
              <div className="mb-3">
                <strong>Выбранный файл:</strong> {selectedFile.name}
                <br />
                <small className="text-muted">
                  Размер: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </small>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUploadModal(false)} disabled={isUploading}>
              Отмена
            </Button>
            <Button 
              variant="primary" 
              onClick={handleUpload} 
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Загрузка...
                </>
              ) : (
                'Загрузить'
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ImageDisplay; 