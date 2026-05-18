import { Chapa } from "chapa-nodejs";

const chapa = new Chapa({
  secretKey: process.env.CHAPA_SECRET_KEY as string,
});

export default chapa;
