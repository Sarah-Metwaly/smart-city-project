
export const HumidityIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M12 22C16.4183 22 20 18.4183 20 14C20 10.5 16 5 12 2C8 5 4 10.5 4 14C4 18.4183 7.58172 22 12 22Z" 
      fill="currentColor" 
      fillOpacity="0.2" 
    />
    <path 
      d="M12 22C16.4183 22 20 18.4183 20 14C20 10.5 16 5 12 2C8 5 4 10.5 4 14C4 18.4183 7.58172 22 12 22Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M15 14C15 15.6569 13.6569 17 12 17" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
  </svg>
);

export default HumidityIcon;