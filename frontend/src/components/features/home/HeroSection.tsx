import { Button } from '../../ui';
import { ShoppingBag, Users, TrendingUp, Star } from 'lucide-react';

interface HeroSectionProps {
  onStartShopping?: () => void;
  onSellProduct?: () => void;
  isAuthenticated?: boolean;
}

const HeroSection = ({ onStartShopping, onSellProduct, isAuthenticated = false }: HeroSectionProps) => {
  return (
    <section
      className="relative py-16 md:py-24 lg:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Compra y vende en tu
              <br />
              <span className="text-yellow-300">comunidad universitaria</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Conecta con estudiantes de la UCC, encuentra productos únicos y ahorra dinero
              en un marketplace exclusivo para la comunidad universitaria.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {isAuthenticated ? (
              <>
                <Button
                  size="lg"
                  className="bg-white text-[var(--color-primary)] hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-lg"
                  onClick={onStartShopping}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Explorar productos
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-[var(--color-primary)] px-8 py-4 text-lg font-semibold"
                  onClick={onSellProduct}
                >
                  Vender producto
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  className="bg-white text-[var(--color-primary)] hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-lg"
                  onClick={onStartShopping}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Empezar a comprar
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-[var(--color-primary)] px-8 py-4 text-lg font-semibold"
                  onClick={onSellProduct}
                >
                  Vender producto
                </Button>
              </>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="pt-8">
            <p className="text-white/80 text-sm mb-6">Con la confianza de la comunidad UCC</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <ShoppingBag className="h-6 w-6 text-yellow-300" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-white/80 text-sm">Productos activos</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-yellow-300" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">1000+</div>
                <div className="text-white/80 text-sm">Estudiantes conectados</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-yellow-300" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-white/80 text-sm">Transacciones diarias</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-yellow-300" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">95%</div>
                <div className="text-white/80 text-sm">Satisfacción estudiantil</div>
              </div>
            </div>
          </div>

          {/* University Badge */}
          <div className="pt-8">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <img
                src="/UCC-logo.svg"
                alt="Universidad Cooperativa de Colombia"
                className="w-8 h-8"
              />
              <span className="text-white/90 text-sm font-medium">
                Exclusivo para estudiantes de la Universidad Cooperativa de Colombia
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-16 md:h-20 lg:h-24"
          preserveAspectRatio="none"
        >
          <path
            fill="var(--color-background)"
            d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;