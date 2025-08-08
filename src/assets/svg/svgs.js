const LatestTxIcon = ({ className = "", stroke, size = "30px", ...props }) => {
  return (
    <svg
      style={{ width: size, height: size }}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect
        width="40"
        height="40"
        rx="8"
        fill={stroke || "white"}
        fillOpacity="0.2"
      />
      <path
        d="M21.6663 16.335H24.3329"
        stroke={stroke || "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.6663 20.335H24.3329"
        stroke={stroke || "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.6663 24.335H24.3329"
        stroke={stroke || "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28.333 27.0016V13.0016C28.333 11.5289 27.1391 10.335 25.6663 10.335H14.333C12.8602 10.335 11.6663 11.5289 11.6663 13.0016V27.0016C11.6663 28.4744 12.8602 29.6683 14.333 29.6683H25.6663C27.1391 29.6683 28.333 28.4744 28.333 27.0016Z"
        stroke={stroke || "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.6663 14.335H15.6663V16.335H17.6663V14.335Z"
        stroke={stroke || "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LatestTxIcon;
