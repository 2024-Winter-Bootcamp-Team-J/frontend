import React from 'react';
import LocationIcon from '../../assets/LocationIcon.png';

const LocationButton: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-full shadow-md bg-customColor2/80 hover:bg-customColor2 background-blur-md">
      <img src={LocationIcon} alt="Location Icon" className="w-6 h-6" />
    </div>
  );
};

export default LocationButton;