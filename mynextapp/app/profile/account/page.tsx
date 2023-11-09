import Sidebar from '../../components/Sidebar';
import Account from '../../components/Account';

export default function Settings() {
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
};