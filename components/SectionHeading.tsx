import React from 'react';

interface Props {
  title: string;
  subtext?: string;
  centered?: boolean;
  light?: boolean;
}

const SectionHeading: React.FC<Props> = ({ title, subtext, centered = false, light = false }) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : 'text-left'} animate-fade-in`}>
      <h2 className={`text-2xl md:text-3xl font-extrabold mb-4 leading-tight ${light ? 'text-white' : 'text-brand-textMain'}`}>
        {title}
      </h2>
      {subtext && (
        <p className={`text-base md:text-lg leading-relaxed ${light ? 'text-gray-300' : 'text-brand-textBody'}`}>
          {subtext}
        </p>
      )}
      <div className={`h-1.5 w-24 bg-brand-primary mt-5 rounded-full ${centered ? 'mx-auto' : ''}`}></div>
    </div>
  );
};

export default SectionHeading;