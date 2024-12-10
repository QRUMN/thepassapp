import React, { useState, useEffect } from 'react';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  isEditing: boolean;
  type?: 'text' | 'email' | 'tel' | 'number';
  className?: string;
}

export default function EditableField({
  value,
  onChange,
  label,
  isEditing,
  type = 'text',
  className = '',
}: EditableFieldProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    onChange(e.target.value);
  };

  if (!isEditing) {
    return (
      <div className={`${className}`}>
        <span className="text-sm text-gray-500">{label}</span>
        <p className="mt-1">{value}</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={localValue}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      />
    </div>
  );
}
