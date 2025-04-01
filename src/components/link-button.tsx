import React from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  href: string;
  children: React.ReactNode;
};

const LinkButton = ({ href, children }: Props) => {
  const navigate = useNavigate();

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </a>
  );
};

export default LinkButton;
