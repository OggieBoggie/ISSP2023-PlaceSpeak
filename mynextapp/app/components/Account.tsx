"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Account() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<User>({
    email: '',
    name: '',
    image: '',
    points: 0,
    level: 0,
    gender: 'select',
    description: '',
    birthday: '',
    facebook_url: '',
    twitter_x_url: '',
    linkedin_url: '',
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  }
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/myapp/api/users/profile/${session?.user?.email}/`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  }
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/myapp/api/users");
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const usersData = await response.json();
      const currentUserData = usersData.find(
        (user: User) => user.email === session?.user?.email
      );

      setForm(prevForm => ({
        ...prevForm,
        email: currentUserData?.email ?? '',
        name: currentUserData?.name ?? '',
        image: currentUserData?.image ?? null,
        points: currentUserData?.points ?? 0,
        level: currentUserData?.level ?? 0,
        gender: currentUserData?.gender ?? 'select',
        description: currentUserData?.description ?? '',
        birthday: currentUserData?.birthday ?? '',
        facebook_url: currentUserData?.facebook_url ?? '',
        twitter_x_url: currentUserData?.twitter_x_url ?? '',
        linkedin_url: currentUserData?.linkedin_url ?? '',
      }));
    }
    catch (error) {
      console.error("Error fetching all users:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchAllUsers();
  }, []);
  return (
    <div className="flex-1">
      <div className="flex items-center mb-6">
        {form.image && (
          <img
            src={form.image}
            alt="Profile"
            className="h-12 w-12 rounded-full mr-4"
          />
        )}
        <h1 className="text-2xl font-bold text-black">Account</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg text-black">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
              Preferred Name:
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="firstName"
              type="text"
              placeholder="Preferred Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="birthday">
              Birthday:
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="birthday"
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
              autoComplete="bday"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="facebook_url">
              Facebook URL:
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="facebook_url"
              type="text"
              placeholder="Share your Facebook URL"
              name="facebook_url"
              value={form.facebook_url}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="twitter_x_url">
              Twitter URL:
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="twitter_x_url"
              type="text"
              placeholder="Share your Twitter URL"
              name="twitter_x_url"
              value={form.twitter_x_url}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="linkedin_url">
              LinkedIn URL:
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="linkedin_url"
              type="text"
              placeholder="Share your LinkedIn URL"
              name="linkedin_url"
              value={form.linkedin_url}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
              Gender:
            </label>
            <select
              name="gender"
              id="gender"
              value={form.gender}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="select">-- Select your Gender --</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="about">
              About yourself
            </label>
            <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="about"
              placeholder="Tell us about yourself!"
              value={form.description}
              name="description"
              onChange={handleChange}
              autoComplete="off"
            ></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
