import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  className?: string;
}

export default function StatCard({ title, value, subtitle, className = '' }: StatCardProps) {
  return (
    <div className={`p-6 rounded-xl ${className}`}>
      <h3 className="text-sm font-medium mb-4">{title}</h3>
      <div className="flex flex-col">
        <span className="text-3xl font-bold mb-1">{value}</span>
        <span className="text-sm">{subtitle}</span>
      </div>
    </div>
  );
}