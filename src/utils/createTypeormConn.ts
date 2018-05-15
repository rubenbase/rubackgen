import { getConnectionOptions, createConnection } from "typeorm";

export const createTypeormConn = async () => {
  try {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    console.log("PROCESS ISS =>>>> ,", process.env.NODE_ENV);
    return createConnection({ ...connectionOptions, name: "default" });
  } catch {
    console.log("uppps");
    return "oops";
  }
};
