import React, { ReactNode } from 'react';

interface KpiCardProps {
  titulo: string;
  valor: string | number;
  subtitulo?: string;
  icon: ReactNode;
  variant?: 'granate' | 'ambar' | 'verde' | 'crema' | 'azul';
  badgeText?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  titulo,
  valor,
  subtitulo,
  icon,
  variant = 'crema',
  badgeText
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'granate':
        return {
          cardBg: 'bg-[#FAF8F5]',
          borderColor: 'border-[#EAD3CE]',
          iconBg: 'bg-[#F8ECE9] text-[#8C3B2E]',
          valueColor: 'text-[#8C3B2E]',
          badgeBg: 'bg-[#F8ECE9] text-[#8C3B2E]'
        };
      case 'ambar':
        return {
          cardBg: 'bg-[#FAF8F5]',
          borderColor: 'border-[#F3E2C8]',
          iconBg: 'bg-[#FDF5EA] text-[#C77B21]',
          valueColor: 'text-[#C77B21]',
          badgeBg: 'bg-[#FDF5EA] text-[#C77B21]'
        };
      case 'verde':
        return {
          cardBg: 'bg-[#FAF8F5]',
          borderColor: 'border-[#C6E9D0]',
          iconBg: 'bg-[#EDF7F0] text-[#2D7A46]',
          valueColor: 'text-[#2D7A46]',
          badgeBg: 'bg-[#EDF7F0] text-[#2D7A46]'
        };
      case 'azul':
        return {
          cardBg: 'bg-[#FAF8F5]',
          borderColor: 'border-[#BEE3F8]',
          iconBg: 'bg-[#EBF8FF] text-[#2B6CB0]',
          valueColor: 'text-[#2B6CB0]',
          badgeBg: 'bg-[#EBF8FF] text-[#2B6CB0]'
        };
      default:
        return {
          cardBg: 'bg-[#FAF8F5]',
          borderColor: 'border-[#E5DEC3]',
          iconBg: 'bg-[#F0EAE1] text-[#2C2421]',
          valueColor: 'text-[#2C2421]',
          badgeBg: 'bg-[#F0EAE1] text-[#2C2421]'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`p-4 rounded-xl border ${styles.cardBg} ${styles.borderColor} shadow-xs hover:shadow-md transition-all duration-200`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold tracking-wide uppercase text-[#6B635B]">
          {titulo}
        </span>
        <div className={`p-2 rounded-lg ${styles.iconBg}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <span className={`text-2xl lg:text-3xl font-bold font-serif ${styles.valueColor}`}>
          {valor}
        </span>
        {badgeText && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles.badgeBg}`}>
            {badgeText}
          </span>
        )}
      </div>

      {subtitulo && (
        <p className="text-xs text-[#7A7268] mt-2 font-normal flex items-center gap-1">
          {subtitulo}
        </p>
      )}
    </div>
  );
};
