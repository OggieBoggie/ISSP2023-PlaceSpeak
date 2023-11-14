import Sidebar from '../../components/Sidebar';

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const UsersPage: React.FC = async () => {  
    const session = await getServerSession();
    if (session && session.user) {
        return (
            <div>
                <Sidebar />
            </div>
        )
    }
    return redirect("/");
};

export default UsersPage;