const WindStatusIcon = () => {
  return (
    <svg 
      viewBox="0 0 262 65" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-65" 
    >
      <rect y="45" width="5" height="20" rx="2.5" fill="url(#paint0_linear_2109_491)"/>
      <rect x="15" y="40" width="5" height="25" rx="2.5" fill="url(#paint1_linear_2109_491)"/>
      <rect x="30" y="35" width="5" height="30" rx="2.5" fill="url(#paint2_linear_2109_491)"/>
      <rect x="44" y="30" width="5" height="35" rx="2.5" fill="url(#paint3_linear_2109_491)"/>
      <rect x="58" y="25" width="5" height="40" rx="2.5" fill="url(#paint4_linear_2109_491)"/>
      <rect x="73" y="20" width="5" height="45" rx="2.5" fill="url(#paint5_linear_2109_491)"/>
      <rect x="87" y="15" width="5" height="50" rx="2.5" fill="url(#paint6_linear_2109_491)"/>
      <rect x="102" y="10" width="5" height="55" rx="2.5" fill="url(#paint7_linear_2109_491)"/>
      <rect x="116" y="5" width="5" height="60" rx="2.5" fill="url(#paint8_linear_2109_491)"/>
      <rect x="131" width="5" height="65" rx="2.5" fill="url(#paint9_linear_2109_491)"/>
      <rect x="145" y="5" width="5" height="60" rx="2.5" fill="url(#paint10_linear_2109_491)"/>
      <rect x="159" y="10" width="5" height="55" rx="2.5" fill="url(#paint11_linear_2109_491)"/>
      <rect x="173" y="15" width="5" height="50" rx="2.5" fill="url(#paint12_linear_2109_491)"/>
      <rect x="187" y="20" width="5" height="45" rx="2.5" fill="url(#paint13_linear_2109_491)"/>
      <rect x="201" y="25" width="5" height="40" rx="2.5" fill="url(#paint14_linear_2109_491)"/>
      <rect x="215" y="30" width="5" height="35" rx="2.5" fill="url(#paint15_linear_2109_491)"/>
      <rect x="229" y="35" width="5" height="30" rx="2.5" fill="url(#paint16_linear_2109_491)"/>
      <rect x="243" y="40" width="5" height="25" rx="2.5" fill="url(#paint17_linear_2109_491)"/>
      <rect x="257" y="45" width="5" height="20" rx="2.5" fill="url(#paint18_linear_2109_491)"/>
      <defs>
        {Array.from({ length: 19 }).map((_, i) => (
          <linearGradient 
            key={i}
            id={`paint${i}_linear_2109_491`} 
            x1="0" y1="0" x2="0" y2="65" 
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5b717b" />
            <stop offset="1" stopColor="#D4E6F7" stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
    </svg>
  );
};

export default WindStatusIcon;