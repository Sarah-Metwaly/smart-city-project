import CityModel from "../components/CityModel/CityModel.tsx";


const HomePage = () => {
  return (
      <div className="w-full pl-23 pr-23 flex flex-col gap-10 h-screen">
          <h1 className="font-bold text-[42px] leading-tight tracking-tight">City Twin</h1>
          <p className="text-aman-white text-[15px] font-inter">
              Explore the digital twin of our city, where real-time data meets immersive 3D visualization. Experience the future of urban planning and management with our interactive city model.
          </p>
          <div className="h-full">
              <CityModel />
          </div>
      </div>
  )
}

export default HomePage
