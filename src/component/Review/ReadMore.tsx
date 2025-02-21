import React, { useState, useEffect } from "react";

type ReadMoreProps = {
  text: string;
  maxLengthDesktop: number;
  maxLengthMobile: number;
};

const ReadMore: React.FC<ReadMoreProps> = ({
  text,
  maxLengthDesktop,
  maxLengthMobile,
}) => {
  const [isReadMore, setIsReadMore] = useState(true);
  const [maxLength, setMaxLength] = useState(maxLengthDesktop);
  const [shouldShowReadMore, setShouldShowReadMore] = useState(false);

  useEffect(() => {
    const updateMaxLength = () => {
      if (window.innerWidth <= 768) {
        setMaxLength(maxLengthMobile);
      } else {
        setMaxLength(maxLengthDesktop);
      }
    };

    updateMaxLength(); // Set initial maxLength based on screen size
    setShouldShowReadMore(text.length > maxLength); // Check if "Read More" is needed

    window.addEventListener("resize", updateMaxLength);
    return () => window.removeEventListener("resize", updateMaxLength);
  }, [maxLengthDesktop, maxLengthMobile, text]);

  const toggleReadMore = () => setIsReadMore(!isReadMore);

  const truncateText = (text: string, maxLength: number): string =>
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

  return (
    <p>
      {isReadMore ? truncateText(text, maxLength) : text}
      {shouldShowReadMore && (
        <span
          onClick={toggleReadMore}
          style={{ color: "grey", cursor: "pointer", marginLeft: "5px" }}
        >
          {isReadMore ? "Read More" : "Read Less"}
        </span>
      )}
    </p>
  );
};

export default ReadMore;
