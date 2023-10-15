import { redirect } from "next/navigation";
import Profile from "../components/profile";
import UserInfo from "../components/UserInfo";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";

const DynamicMapWithLocation = dynamic(
  () => import("../components/MapWithLocation"),
  {
    ssr: false, // This will load the component only on client side
    loading: () => (
      <p className="text-lg font-bold text-center text-blue-500">Loading...</p>
    ),
  }
);

export default async function Component() {
  interface PointProps {
    latitude: number;
    longitude: number;
  }

  async function get_nbhd({ latitude, longitude }: PointProps) {
    "use server";
    // Call API to get the neighborhood boundary
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/myapp/api/van_nbhd/?latitude=${latitude}&longitude=${longitude}`
      );
      const data = await response.json();

      if (data && data.geom && data.geom.coordinates) {
        const reversedCoords = data.geom.coordinates[0][0].map((coord: any) => [
          coord[1],
          coord[0],
        ]);
        return reversedCoords;
      }
    } catch (error) {
      console.error("Error fetching neighborhood data:", error);
    }
  }

  async function update_user_location({ latitude, longitude }: PointProps) {
    "use server";
    const session = await getServerSession();
    fetch(
      `http://127.0.0.1:8000/myapp/api/user_location/${session?.user?.email}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: latitude,
          longitude: longitude,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Location saved:", data);
      })
      .catch((error) => {
        console.error("Error saving location:", error);
      });
  }

  const session = await getServerSession();
  if (session && session.user) {
    return (
      <div
        className="bg-gray-100 flex flex-col min-h-screen"
        style={{ minHeight: "calc(100vh - 3.25rem)" }}
      >
        <div className="flex flex-col md:flex-row md:flex-grow">
          <div className="flex-1 p-4 md:max-w-md">
            <Profile />
          </div>

          <div className="w-full md:w-2/3 p-4 mt-4 md:mt-8">
            <UserInfo />
            <div className="flex-grow relative">
              <DynamicMapWithLocation
                getNbhdAction={get_nbhd}
                updateUsrLocAction={update_user_location}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return redirect("/");
}
