import { Link } from "react-router-dom";

import logo from "../assets/images/logo_conectavida_name.png";


export const SelectAccountType = () => {
 
  return (
    <div className="flex flex-col items-center justify-center">

      <div className="bg-soft p-[30px] flex flex-col items-center justify-center w-[90%] sm:w-[500px] rounded-xs">
        <div className="flex items-center justify-center w-[310px]">
          <img className="w-full" src={logo} alt="Logo" />
        </div>
        <div  className="my-4 w-full">
          <Link className="uppercase bg-red-logo text-light block text-center font-bold py-2 px-4 hover:bg-red-secondary rounded-md mb-5" to="/register/donator">Quero ser doador</Link>
          <Link className="uppercase block text-center font-bold py-2 px-4 bg-bg-input text-text-secondary rounded-md shadow" to="/register/institution">Sou instituição</Link>
        </div>
      </div>
    </div>
  );
};
