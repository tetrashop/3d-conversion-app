import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ProductFilters({ onFilterChange }) {
  const router = useRouter();
  const [filters, setFilters] = useState({
    category: 'همه',
    minPrice: '',
    maxPrice: '',
    sort: 'popular'
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = ['همه', 'ماشین', 'ساختمان', 'کاراکتر', 'مبلمان', 'وسایل نقلیه', 'جانوران'];
  const sortOptions = [
    { value: 'popular', label: 'محبوب‌ترین' },
    { value: 'rating', label: 'بالاترین امتیاز' },
    { value: 'price_asc', label: 'ارزان‌ترین' },
    { value: 'price_desc', label: 'گران‌ترین' },
    { value: 'newest', label: 'جدیدترین' }
  ];
  
  useEffect(() => {
    // اعمال فیلترها با تاخیر برای جلوگیری از درخواست‌های زیاد
    const timer = setTimeout(() => {
      if (onFilterChange) {
        onFilterChange({ ...filters, q: searchQuery });
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters, searchQuery]);
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (onFilterChange) {
      onFilterChange({ ...filters, q: searchQuery });
    }
  };
  
  const clearFilters = () => {
    setFilters({
      category: 'همه',
      minPrice: '',
      maxPrice: '',
      sort: 'popular'
    });
    setSearchQuery('');
  };
  
  return (
    <div style={{
      background: 'white',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '30px'
    }}>
      {/* جستجوی سریع */}
      <div style={{ marginBottom: '25px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی مدل 3D..."
            style={{
              flex: 1,
              padding: '12px 15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <button type="submit" style={{
            padding: '12px 25px',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            🔍 جستجو
          </button>
        </form>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {/* دسته‌بندی */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            دسته‌بندی
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              background: 'white'
            }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        {/* محدوده قیمت */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            محدوده قیمت (تومان)
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="number"
              placeholder="حداقل"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px'
              }}
            />
            <span>تا</span>
            <input
              type="number"
              placeholder="حداکثر"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px'
              }}
            />
          </div>
        </div>
        
        {/* مرتب‌سازی */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            مرتب‌سازی بر اساس
          </label>
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              background: 'white'
            }}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* دکمه‌ها */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
          <button
            onClick={clearFilters}
            style={{
              padding: '10px 20px',
              background: '#f8f9fa',
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🗑️ پاک کردن فیلترها
          </button>
        </div>
      </div>
      
      {/* نمایش فیلترهای فعال */}
      {(filters.category !== 'همه' || filters.minPrice || filters.maxPrice || searchQuery) && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#e8f4fd',
          borderRadius: '6px',
          fontSize: '14px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>فیلترهای فعال:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {filters.category !== 'همه' && (
              <span style={{
                background: '#3498db',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '15px',
                fontSize: '12px'
              }}>
                دسته: {filters.category}
              </span>
            )}
            {searchQuery && (
              <span style={{
                background: '#2ecc71',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '15px',
                fontSize: '12px'
              }}>
                جستجو: {searchQuery}
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span style={{
                background: '#f39c12',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '15px',
                fontSize: '12px'
              }}>
                قیمت: {filters.minPrice || '۰'} تا {filters.maxPrice || '∞'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
