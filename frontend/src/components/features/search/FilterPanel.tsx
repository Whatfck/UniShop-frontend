import type { ProductFilters } from '../../../types';

interface FilterPanelProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
}

const FilterPanel = ({ filters, onFiltersChange }: FilterPanelProps) => {
  const categories = ['Libros', 'Tecnología', 'Ropa', 'Hogar', 'Deportes'];
  const conditions = ['Nuevo', 'Usado'] as const;
  const dateOptions = ['Hoy', 'Esta semana', 'Este mes'] as const;

  const handleCategoryChange = (category: string, checked: boolean) => {
    // For now, single category selection
    onFiltersChange({
      ...filters,
      category: checked ? category : undefined
    });
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    onFiltersChange({
      ...filters,
      condition: checked ? (condition === 'Nuevo' ? 'new' : 'used') : undefined
    });
  };

  const handleDateChange = (date: string, checked: boolean) => {
    let datePosted: 'today' | 'week' | 'month' | undefined;
    if (checked) {
      switch (date) {
        case 'Hoy': datePosted = 'today'; break;
        case 'Esta semana': datePosted = 'week'; break;
        case 'Este mes': datePosted = 'month'; break;
      }
    }
    onFiltersChange({
      ...filters,
      datePosted
    });
  };

  return (
    <div
      className="rounded-xl shadow-sm p-6"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: `1px solid var(--color-border)`
      }}
    >
      <h2
        className="text-lg font-semibold mb-6"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Filtros
      </h2>

      {/* Categories */}
      <div className="mb-6">
        <h3
          className="text-sm font-medium mb-3"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Categorías
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.category === category}
                onChange={(e) => handleCategoryChange(category, e.target.checked)}
                className="rounded"
                style={{
                  accentColor: 'var(--color-primary)',
                  borderColor: 'var(--color-border)'
                }}
              />
              <span
                className="ml-2 text-sm"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3
          className="text-sm font-medium mb-3"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Rango de Precios
        </h3>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Mín"
            value={filters.priceMin || ''}
            onChange={(e) => onFiltersChange({
              ...filters,
              priceMin: e.target.value ? Number(e.target.value) : undefined
            })}
            className="w-full px-3 py-2 rounded-md text-sm transition-colors focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)'
            }}
          />
          <input
            type="number"
            placeholder="Máx"
            value={filters.priceMax || ''}
            onChange={(e) => onFiltersChange({
              ...filters,
              priceMax: e.target.value ? Number(e.target.value) : undefined
            })}
            className="w-full px-3 py-2 rounded-md text-sm transition-colors focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)'
            }}
          />
        </div>
      </div>

      {/* Condition */}
      <div className="mb-6">
        <h3
          className="text-sm font-medium mb-3"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Condición
        </h3>
        <div className="space-y-2">
          {conditions.map((condition) => (
            <label key={condition} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.condition === (condition === 'Nuevo' ? 'new' : 'used')}
                onChange={(e) => handleConditionChange(condition, e.target.checked)}
                className="rounded"
                style={{
                  accentColor: 'var(--color-primary)',
                  borderColor: 'var(--color-border)'
                }}
              />
              <span
                className="ml-2 text-sm"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {condition}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Date Posted */}
      <div>
        <h3
          className="text-sm font-medium mb-3"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Fecha de Publicación
        </h3>
        <div className="space-y-2">
          {dateOptions.map((date) => {
            let value: 'today' | 'week' | 'month';
            switch (date) {
              case 'Hoy': value = 'today'; break;
              case 'Esta semana': value = 'week'; break;
              case 'Este mes': value = 'month'; break;
            }
            return (
              <label key={date} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.datePosted === value}
                  onChange={(e) => handleDateChange(date, e.target.checked)}
                  className="rounded"
                  style={{
                    accentColor: 'var(--color-primary)',
                    borderColor: 'var(--color-border)'
                  }}
                />
                <span
                  className="ml-2 text-sm"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {date}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;