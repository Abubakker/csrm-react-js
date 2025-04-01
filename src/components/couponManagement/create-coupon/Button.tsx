// extract buttons and add prop type

interface ButtonProps {
  variant: "primary" | "secondary" | "danger";
  onClick: () => void;
  children: React.ReactNode;
}

const Button = ({ variant, onClick, children }: ButtonProps) => {
  const baseStyles =
    "px-6 py-3 rounded-[10px] tracking-[1px] text-[12px] font-bold";
  const variants = {
    primary: "bg-[#1677FF] text-white hover:bg-[#086dfc]",
    secondary: "bg-transparent text-black hover:bg-gray-200",
    danger: "bg-[#CC4429] text-white hover:bg-[#dd4324]",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
