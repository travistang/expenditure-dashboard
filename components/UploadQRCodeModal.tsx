import { faRedo, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import QRCode from "react-qr-code";
import Modal, { ModalControlProps } from "./Modal";

type Props = ModalControlProps;
export default function UploadQRCodeModal({ opened, onClose }: Props) {
  const [code, setCode] = React.useState<string | null>(null);

  const requestUploadCode = async () => {
    setCode(null);
    const response = await fetch("/api/generateUpload");
    const responseJson = await response.json();
    console.log(responseJson);
    setCode(JSON.stringify(responseJson));
    return responseJson;
  };
  React.useEffect(() => {
    if (opened) {
      const interval = setInterval(() => {
        requestUploadCode();
      }, 30 * 1000);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [opened]);
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Upload local data"
      className="h-full p-4"
    >
      <div className="horizontal-center h-full gap-4">
        <div className="rounded-lg shadow bg-base-content center py-2 px-4 w-1/2 h-full">
          {code ? (
            <QRCode value={code} size={512} />
          ) : (
            <div className="text-base-300">
              <FontAwesomeIcon
                icon={faSpinner}
                className="animate-spin"
                width={16}
                height={16}
              />
            </div>
          )}
        </div>
        <div className="vertical flex-1 gap-4">
          <span className="text-md md:text-4xl">
            Scan the code on the left with the <br />
            <a
              className="text-accent hover:text-accent-focus"
              href={"https://github.com/travistang/expenditure-notebook"}
            >
              Expenditure notebook
            </a>{" "}
            <br />
            App to upload expenditure records to this dashboard.
          </span>
          <button
            onClick={requestUploadCode}
            className="btn btn-accent h-16 horizontal-center px-2 w-36 gap-2 rounded-lg bg-secondary-500"
          >
            <FontAwesomeIcon
              icon={faRedo}
              className="text-sm"
              height={16}
              width={16}
            />
            <span>Refresh Code</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
