/**
 * Table Component - Modern Design System
 * Responsive table with striped rows and hover effects
 */

import React from 'react';
import './Table.css';

export const Table = React.forwardRef(({
  children,
  striped = true,
  hoverable = true,
  compact = false,
  className = '',
  ...props
}, ref) => {
  const tableClasses = [
    'table-wrapper',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={tableClasses} {...props}>
      <table className={[
        'table',
        striped && 'table-striped',
        hoverable && 'table-hoverable',
        compact && 'table-compact',
      ].filter(Boolean).join(' ')}>
        {children}
      </table>
    </div>
  );
});

Table.displayName = 'Table';

export const TableHead = ({ children, className = '', ...props }) => (
  <thead className={`table-head ${className}`} {...props}>
    {children}
  </thead>
);

export const TableBody = ({ children, className = '', ...props }) => (
  <tbody className={`table-body ${className}`} {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ children, className = '', ...props }) => (
  <tr className={`table-row ${className}`} {...props}>
    {children}
  </tr>
);

export const TableCell = ({ children, header = false, className = '', ...props }) => {
  const Tag = header ? 'th' : 'td';
  return (
    <Tag className={`table-cell ${header ? 'table-header-cell' : ''} ${className}`} {...props}>
      {children}
    </Tag>
  );
};

export default Table;
