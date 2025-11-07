import { Heart, Users, BookOpen, GraduationCap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] mt-16">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl font-bold">
                <span style={{ color: 'var(--color-primary)' }}>Uni</span>
                <span style={{ color: 'var(--color-secondary)' }}>Shop</span>
              </div>
              <img
                src="/UCC-logo.svg"
                alt="Universidad Cooperativa de Colombia"
                className="w-8 h-8"
              />
            </div>
            <p className="text-[var(--color-text-secondary)] mb-6 max-w-md">
              De estudiantes para estudiantes. La plataforma universitaria donde comprar y vender es tan fácil como estudiar juntos.
            </p>
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <Heart className="h-4 w-4 text-[var(--color-error)]" />
              <span>Hecho con ❤️ por estudiantes de la UCC</span>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">Plataforma</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                  Cómo vender
                </a>
              </li>
              <li>
                <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                  Guía de compra
                </a>
              </li>
              <li>
                <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                  Centro de ayuda
                </a>
              </li>
              <li>
                <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Comunidad */}
          <div>
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">Comunidad</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                  Código de conducta
                </a>
              </li>
              <li>
                <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                  Reportar problema
                </a>
              </li>
              <li>
                <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                  Sugerencias
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Frase principal */}
        <div className="border-t border-[var(--color-border)] mt-8 pt-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="h-6 w-6 text-[var(--color-primary)]" />
            <Users className="h-6 w-6 text-[var(--color-secondary)]" />
            <BookOpen className="h-6 w-6 text-[var(--color-primary)]" />
          </div>
          <blockquote className="text-lg font-medium text-[var(--color-text-primary)] italic mb-2">
            "De estudiantes para estudiantes: donde el conocimiento se comparte y las oportunidades se multiplican"
          </blockquote>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Universidad Cooperativa de Colombia - Campus Pasto
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-[var(--color-border)] mt-8 pt-8 text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            © 2025 UniShop. Todos los derechos reservados. Desarrollado con pasión por la comunidad universitaria.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;