interface ButtonProps {
  text: string;
  btnType?: "submit" | "reset" | "button";
  color?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  customStyle?: string;
}

function Button({
  text,
  btnType = "button",
  color = "Blue",
  onClick,
  customStyle
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={btnType}
      style={{ backgroundColor: `${color}` }}
      className={`px-3 py-2 font-semibold ${customStyle}`}
    >
      {text}
    </button>
  );
}

export default Button;