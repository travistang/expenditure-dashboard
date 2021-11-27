import {
  faList,
  faMoneyBill,
  faQrcode,
  faTachometerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Logo from "./Logo";
import NavigationItem from "./NavigationItem";
import UploadQRCodeModal from "./UploadQRCodeModal";

export default function NavigationPanel() {
  const [uploadQRCodeOpen, setUploadQRCodeOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-2 md:w-1/5 lg:w-1/4">
      <Logo />
      <nav className="flex-1 rounded-3xl items-center sm:items-start bg-base-100 flex flex-row sm:flex-col gap-2">
        <UploadQRCodeModal
          opened={uploadQRCodeOpen}
          onClose={() => setUploadQRCodeOpen(false)}
        />
        <div className="flex flex-row sm:flex-col gap-2 flex-1 w-full sm:py-4 pl-4 sm:pl-0">
          <NavigationItem link="/" text="Dashboard" icon={faTachometerAlt} />
          <NavigationItem link="/lists" text="All records" icon={faList} />
          <NavigationItem link="/budgets" text="Budgets" icon={faMoneyBill} />
        </div>
        <button
          onClick={() => setUploadQRCodeOpen(true)}
          className="center px-4 gap-2 h-full sm:h-16 sm:w-full bg-accent rounded-r-3xl sm:rounded-tr-none sm:rounded-b-3xl hover:bg-accent-focus"
        >
          <FontAwesomeIcon icon={faQrcode} className="w-4 flex-shrink-0" />
          <span className="pl-2 uppercase hidden md:block">upload data</span>
        </button>
      </nav>
    </div>
  );
}
