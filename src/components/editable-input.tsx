'use client';

import { EditOutlined } from '@ant-design/icons';
import { Button, Input, InputRef } from 'antd';
import type React from 'react';

import { useState, useRef, useEffect } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function EditableText({
  value: initialValue,
  onChange,
  placeholder = 'Enter text...',
  className = '',
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<InputRef>(null);

  // Update internal value when prop changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== initialValue) {
      onChange(value);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isEditing ? (
        <Input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="flex-1"
        />
      ) : (
        <div>{value}</div>
      )}
      <Button icon={<EditOutlined />} onClick={handleEditClick}></Button>
    </div>
  );
}
