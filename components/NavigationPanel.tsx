import {
  faList,
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
    <div className="vertical w-1/3 gap-2 md:w-1-1/4">
      <Logo />
      <nav className="flex-1 rounded-3xl bg-base-100 vertical gap-2">
        <UploadQRCodeModal
          opened={uploadQRCodeOpen}
          onClose={() => setUploadQRCodeOpen(false)}
        />
        <div className="vertical gap-2 flex-1 px-2 py-4">
          <NavigationItem
            onClick={console.log}
            text="Dashboard"
            icon={faTachometerAlt}
          />
          <NavigationItem
            onClick={console.log}
            text="All records"
            icon={faList}
          />
        </div>
        <button
          onClick={() => setUploadQRCodeOpen(true)}
          className="center px-4 gap-2 h-16 bg-accent rounded-b-3xl hover:bg-accent-focus"
        >
          <FontAwesomeIcon icon={faQrcode} className="w-4 flex-shrink-0" />
          <span className="pl-2 uppercase">upload data</span>
        </button>
      </nav>
    </div>
  );
}
