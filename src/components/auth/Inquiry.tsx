interface InquiryLabelProps {
  label: string;
  type?: 'text' | 'password';
  placeholder?: string;
}

function Inquiry({ label, type = 'text' }: InquiryLabelProps) {
  return (
    <div className="w-[525px] h-[68px] flex-shrink-0 bg-[var(--white)] flex items-center px-[20px] gap-4">
       <input
        type={type}
        placeholder={label} 
        className="w-full h-full bg-transparent border-none text-[24px] font-inter text-[var(--gray)] outline-none placeholder-[var(--gray)]"
      />
    </div>
  );
}

export default Inquiry;