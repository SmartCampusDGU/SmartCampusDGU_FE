interface InquiryLabelProps {
  label: string;
  type?: 'text' | 'password';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

function Inquiry({ label, type = 'text', value, onChange }: InquiryLabelProps) {
  return (
    <div className="w-[525px] h-[68px] flex-shrink-0 bg-[var(--white)] flex items-center px-[20px] gap-4">
       <input
        type={type}
        placeholder={label} 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full bg-transparent border-none text-[24px] font-inter text-[var(--gray)] outline-none placeholder-[var(--gray)]"
      />
    </div>
  );
}

export default Inquiry;