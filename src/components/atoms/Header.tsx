import React from 'react';

type THeaderProps = {
  title: string;
};

const Header: React.FC<THeaderProps> = ({ title }) => {
  return <h1 className='mb-4 text-lg text-gray-700 font-medium'>{title}</h1>;
};

export default Header;
