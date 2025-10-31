import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const FileUpload = ({
  onFileSelect,
  onFileRemove,
  currentFile = null,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
  disabled = false,
  placeholder = "Clique para escolher ou arraste uma imagem aqui"
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentFile);
  const fileInputRef = useRef(null);

  const validateFile = useCallback((file) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Apenas arquivos de imagem são permitidos');
      return false;
    }

    // Check file size
    if (file.size > maxSize) {
      setError(`Arquivo muito grande. Máximo ${(maxSize / 1024 / 1024).toFixed(0)}MB permitido`);
      return false;
    }

    setError('');
    return true;
  }, [maxSize]);

  const handleFileSelect = useCallback((file) => {
    if (!validateFile(file)) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    onFileSelect(file);
  }, [validateFile, onFileSelect]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const handleInputChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleRemove = useCallback(() => {
    setPreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileRemove?.();
  }, [onFileRemove]);

  return (
    <div className={cn("space-y-2", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragOver && "border-[#c43c8b] bg-[#c43c8b]/5",
          !isDragOver && "border-gray-300 hover:border-gray-400",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-300 bg-red-50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {preview ? (
          // Preview Mode
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg border"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600">
              Clique para alterar a imagem
            </p>
          </div>
        ) : (
          // Upload Mode
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 text-gray-400">
              <Upload size={48} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {placeholder}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, JPEG até {(maxSize / 1024 / 1024).toFixed(0)}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Helper Text */}
      {!error && (
        <p className="text-xs text-gray-500">
          Recomendado: Imagens quadradas com pelo menos 200x200 pixels
        </p>
      )}
    </div>
  );
};

export default FileUpload;
