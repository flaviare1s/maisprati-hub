import { Link } from "react-router-dom";

import logo from "../assets/images/logo+prati.png";


export const SelectAccountType = () => {
 
  return (
    <div className="flex flex-col items-center justify-center m-auto sm:shadow-2xl rounded-2xl">
      <div className="bg-soft p-[30px] flex flex-col items-center justify-center rounded-xs">
        <div className="flex items-center justify-center w-[180px]">
          <img className="w-full" src={logo} alt="Logo" />
        </div>
        <div  className="my-4 w-[250px]">
          <Link className="uppercase font-medium text-sm py-2 px-4 transition-colors duration-75 font-montserrat focus:outline-none focus:shadow-outline w-full cursor-pointer mt-5 bg-blue-logo text-light rounded-md shadow block text-center hover:bg-orange-logo" to="/register/donator">Quero ser doador</Link>
          <Link className="uppercase font-medium text-sm py-2 px-4 transition-colors duration-75 font-montserrat focus:outline-none focus:shadow-outline w-full cursor-pointer mt-5 bg-blue-logo text-light rounded-md shadow block text-center hover:bg-orange-logo" to="/register/institution">Sou instituição</Link>
        </div>
      </div>
    </div>
  );
};
