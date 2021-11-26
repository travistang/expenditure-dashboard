import React from "react";

type ConfirmationModalValueType = {
  title?: string;
  description?: string;
  onConfirm: () => void;
};
type ConfirmationModalContextValueType = ConfirmationModalValueType & {
  opened: boolean;
  requestConfirmation: (payload: ConfirmationModalValueType) => void;
  onClose: () => void;
};

const DEFAULT_VALUE: ConfirmationModalContextValueType = {
  title: "Confirm this action",
  description: "Are you sure?",
  onConfirm: () => {},
  onClose: () => {},

  opened: false,
  requestConfirmation: () => {},
};

export const ConfirmationModalContext = React.createContext(DEFAULT_VALUE);
const ConfirmationModalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [payload, setPayload] =
    React.useState<ConfirmationModalValueType | null>(null);

  const requestConfirmation = (payload: ConfirmationModalContextValueType) => {
    const onConfirmWithClose = () => {
      payload.onConfirm();
      setPayload(null);
    };
    setPayload({
      ...DEFAULT_VALUE,
      ...payload,
      onConfirm: onConfirmWithClose,
    });
  };

  const contextValue: ConfirmationModalContextValueType = {
    ...payload,
    opened: !!payload,
    requestConfirmation,
    onClose: () => setPayload(null),
  };
  return (
    <ConfirmationModalContext.Provider value={contextValue}>
      {children}
    </ConfirmationModalContext.Provider>
  );
};

export default ConfirmationModalContextProvider;
