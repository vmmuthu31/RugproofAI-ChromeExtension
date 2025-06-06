import { useState } from "react";

const TokenLogo = ({
  src,
  alt,
  size = 40,
}: {
  src?: string;
  alt: string;
  size?: number;
}) => {
  const [error, setError] = useState(false);

  if (!src || src === "" || error) {
    const firstLetter =
      alt && typeof alt === "string" ? alt.charAt(0).toUpperCase() : "?";

    return (
      <div
        className="flex items-center justify-center bg-gradient-to-br from-black to-gray-900 border border-[#00ff00]/10 rounded-full overflow-hidden"
        style={{ width: size, height: size }}
      >
        <span className="text-base font-semibold text-[#00ff00]">
          {firstLetter}
        </span>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-full overflow-hidden"
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
};

export default TokenLogo;
