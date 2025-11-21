import { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, GripVertical, Trash2 } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated?: () => void;
}

interface UploadedImage {
  file: File;
  url: string;
  filename: string;
  order: number;
}

interface Category {
  id: number;
  name: string;
}

const CreateProductModal = ({ isOpen, onClose, onProductCreated }: CreateProductModalProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    condition: 'Nuevo'
  });

  // Load categories on mount
  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      const cats = await apiService.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback: usar categorías hardcodeadas si la API falla
      setCategories([
        { id: 1, name: 'Libros' },
        { id: 2, name: 'Tecnología' },
        { id: 3, name: 'Material de Laboratorio' },
        { id: 4, name: 'Arquitectura' },
        { id: 5, name: 'Útiles Escolares' },
        { id: 6, name: 'Otros' }
      ]);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      condition: 'Nuevo'
    });
    setUploadedImages([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      handleFilesSelected(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files).filter(file =>
        file.type.startsWith('image/')
      );
      handleFilesSelected(fileArray);
    }
  };

  const handleFilesSelected = async (files: File[]) => {
    if (uploadedImages.length + files.length > 10) {
      alert('Máximo 10 imágenes permitidas');
      return;
    }

    setIsLoading(true);
    try {
      const uploadResults = await apiService.uploadProductImages(files);

      const newImages: UploadedImage[] = uploadResults.map((result, index) => ({
        file: files[index],
        url: result.url,
        filename: result.filename,
        order: uploadedImages.length + index
      }));

      setUploadedImages(prev => [...prev, ...newImages]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error al subir las imágenes');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    setUploadedImages(prev => {
      const newImages = [...prev];
      const [moved] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, moved);

      // Update order indices
      return newImages.map((img, index) => ({ ...img, order: index }));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (uploadedImages.length === 0) {
      alert('Debes subir al menos una imagen');
      return;
    }

    if (!formData.name.trim() || !formData.description.trim() || !formData.price || !formData.categoryId) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsLoading(true);
    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId),
        condition: formData.condition,
        imageUrls: uploadedImages.map(img => img.url),
        imageOrder: uploadedImages.map(img => img.order)
      };

      await apiService.createProduct(productData);

      if (onProductCreated) {
        onProductCreated();
      }

      handleClose();
      alert('Producto creado exitosamente!');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error al crear el producto. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Publicar Nuevo Producto" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Nombre del producto *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}
              placeholder="Ej: Laptop Dell Inspiron"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Precio *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Descripción *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}
            placeholder="Describe tu producto detalladamente..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Categoría *
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}
              required
            >
              <option value="">Seleccionar categoría</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Condición *
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}
              required
            >
              <option value="Nuevo">Nuevo</option>
              <option value="Usado">Usado</option>
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Imágenes del producto * (máximo 10)
          </label>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-secondary)' }} />
            <p className="text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Arrastra y suelta tus imágenes aquí
            </p>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              o
            </p>
            <label className="inline-block">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
              <Button type="button" variant="outline" className="cursor-pointer">
                Seleccionar archivos
              </Button>
            </label>
          </div>

          {/* Image Preview */}
          {uploadedImages.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Imágenes ({uploadedImages.length}/10)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border border-[var(--color-border)]">
                      <img
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${image.url}`}
                        alt={image.filename}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Controls */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Drag handle */}
                    <div className="absolute top-2 left-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                      <GripVertical className="w-4 h-4" />
                    </div>

                    {/* Order indicator */}
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading || uploadedImages.length === 0}>
            {isLoading ? 'Creando...' : 'Publicar Producto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProductModal;