import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className={props.className}>
      <label className="block text-gray-500 mb-1">{label}</label>
      <input
        {...props}
        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-gray-500"
      />
    </div>
  );
}
