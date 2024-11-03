export type Analytics = {
  clientId: string;
};

export const getClientIpAddress = ({ headers }: Request): Analytics => ({
  clientId: `\u0002${headers.get("Fly-Client-IP")}\u0003`,
});
