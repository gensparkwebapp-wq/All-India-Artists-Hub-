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
      <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${light ? 'text-white' : 'text-brand-textHeading'}`}>
        {title}
      </h2>
      {subtext && (
        <p className={`text-base leading-relaxed ${light ? 'text-gray-300' : 'text-brand-textSub'}`}>
          {subtext}
        </p>
      )}
      <div className={`h-1 w-20 bg-brand-primary mt-4 rounded-full ${centered ? 'mx-auto' : ''}`}></div>
    </div>
  );
};

export default SectionHeading;