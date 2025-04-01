interface TagLabelProps {
  name: string;
  color: string;
  description: string;
}

const TagLabel = ({ name, color, description }: TagLabelProps) => {
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  };

  return (
    <div className="flex items-center gap-[10px]">
      <div
        style={{
          backgroundColor: `rgba(${hexToRgb(color)}, 0.1)`,
          color: color,
          borderColor: `rgba(${hexToRgb(color)}, 0.5)`,
        }}
        className="py-1 text-[12px] leading-[18px] px-2 h-fit mhn-h-[26px] border rounded-[6px] w-auto"
      >
        {name}
      </div>

      <p className="m-0 text-[12px] leading-[18px] font-medium text-[#8B8FA3]">
        {description}
      </p>
    </div>
  );
};

export default TagLabel;
