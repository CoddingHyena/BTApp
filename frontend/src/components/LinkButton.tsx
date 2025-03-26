// // src/components/LinkButton.tsx
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Button, ButtonProps } from 'react-bootstrap';

// interface LinkButtonProps extends ButtonProps {
//   to: string;
//   children: React.ReactNode;
// }

// const LinkButton: React.FC<LinkButtonProps> = ({ to, children, ...buttonProps }) => {
//   return (
//     <Link to={to} className="text-decoration-none">
//       <Button {...buttonProps}>
//         {children}
//       </Button>
//     </Link>
//   );
// };

// export default LinkButton;

// src/components/LinkButton.tsx
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { Button, ButtonProps } from 'react-bootstrap';

// Расширенный интерфейс для свойств компонента
interface LinkButtonProps extends ButtonProps {
  to: string;
  children: React.ReactNode;
  linkProps?: Omit<LinkProps, 'to'>; // Дополнительные свойства для компонента Link
}

const LinkButton: React.FC<LinkButtonProps> = ({ 
  to, 
  children, 
  linkProps,
  ...buttonProps 
}) => {
  return (
    <Link 
      to={to} 
      className="text-decoration-none" 
      {...linkProps}
    >
      <Button {...buttonProps}>
        {children}
      </Button>
    </Link>
  );
};

export default LinkButton;