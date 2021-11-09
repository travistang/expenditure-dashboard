import os from "os";

export const getLocalIP = () => {
  const nets = os.networkInterfaces();
  const internalIPv4AddressKey = Object.values(nets)
    .flat()
    .find((info) => {
      return info.family === "IPv4" && !info.internal;
    });
  return internalIPv4AddressKey?.address ?? null;
};
