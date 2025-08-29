interface LogInProps {
  onClick: () => void;
}

const LogIn = ({ onClick }: LogInProps) => {
  return (
     <div 
     onClick={onClick}
     className="w-[525px] h-[68px] flex-shrink-0 bg-[var(--orange)] flex items-center justify-center">
      <span className="w-[67px] text-[var(--white)] text-right text-[24px] font-bold leading-none font-inter">
        로그인
      </span>
    </div>
  );
};

export default LogIn;