import Sidebar from '../../components/Sidebar';
import Account from '../../components/Account';

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function Settings() {
    const session = await getServerSession();
    if (session && session.user) {
      return (
        <div className="flex flex-col md:flex-row pt-16 min-h-screen">
          <div className="md:w-1/4">
            <Sidebar />
          </div>
          <div className="md:w-3/4">
            <Account />
          </div>
        </div>
      );
    }
    return redirect("/");
};