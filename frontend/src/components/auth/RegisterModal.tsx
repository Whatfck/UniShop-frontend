import { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, CheckCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    const uccEmailRegex = /^[a-zA-Z0-9._%+-]+@campusucc\.edu\.co$/;
    return uccEmailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Debe usar un correo institucional de la UCC (@campusucc.edu.co)';
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      onClose();
    } catch (error: any) {
      setErrors({ general: error.message || 'Error al crear la cuenta. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Cuenta" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        <Input
          type="text"
          label="Nombre completo"
          placeholder="Tu nombre completo"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          leftIcon={<User className="h-4 w-4" />}
          required
        />

        <Input
          type="email"
          label="Correo institucional"
          placeholder="tu.nombre@campusucc.edu.co"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          leftIcon={<Mail className="h-4 w-4" />}
          helperText="Solo se permiten correos de la Universidad Cooperativa de Colombia"
          required
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          label="Contraseña"
          placeholder="Mínimo 8 caracteres"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          error={errors.password}
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          required
        />

        <Input
          type={showConfirmPassword ? 'text' : 'password'}
          label="Confirmar contraseña"
          placeholder="Repite tu contraseña"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          leftIcon={<CheckCircle className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          required
        />

        <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          <p className="mb-2">
            Al registrarte, aceptas nuestros términos y condiciones y política de privacidad.
          </p>
          <p>
            Recibirás un código de verificación por WhatsApp para activar tu cuenta.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          disabled={!formData.name || !formData.email || !formData.password || !formData.confirmPassword}
        >
          {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </Button>

        <div className="text-center">
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToLogin();
              }}
              className="text-[var(--color-primary)] hover:underline focus:outline-none font-medium"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default RegisterModal;