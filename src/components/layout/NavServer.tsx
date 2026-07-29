import React from "react";
import { Navbar } from "./navbar";
import getProfile from "@/helpers/next-fetch/getProfile";

export default async function NavServer() {
    const user = await getProfile();
  return <Navbar user={user} />;
}
