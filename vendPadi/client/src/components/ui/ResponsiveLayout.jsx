const ResponsiveGrid = ({ 
  children, 
  columns = { 
    default: 4,
    sm: 2,
    md: 3,
    lg: 4 
  },
  gap = 4,
  className = '' 
}) => {
  const gridClass = `
    grid 
    grid-cols-${columns.default || 4}
    ${columns.sm ? `sm:grid-cols-${columns.sm}` : ''}
    ${columns.md ? `md:grid-cols-${columns.md}` : ''}
    ${columns.lg ? `lg:grid-cols-${columns.lg}` : ''}
    gap-${gap}
  `.replace(/\s+/g, ' ').trim();
  
  return (
    <div className={`${gridClass} ${className}`}>
      {children}
    </div>
  );
};

const ResponsiveFlex = ({ 
  children, 
  direction = 'row',
  align = 'center',
  justify = 'between',
  gap = 4,
  wrap = false,
  className = '' 
}) => {
  const flexClass = `
    flex 
    flex-${direction}
    items-${align}
    justify-${justify}
    gap-${gap}
    ${wrap ? 'flex-wrap' : ''}
  `.replace(/\s+/g, ' ').trim();
  
  return (
    <div className={flexClass}>
      {children}
    </div>
  );
};

export { ResponsiveGrid, ResponsiveFlex };
export default ResponsiveGrid;
