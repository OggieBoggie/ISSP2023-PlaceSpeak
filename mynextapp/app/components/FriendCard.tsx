function MoreButton({ onClick }: { onClick: () => void }) {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        height="1em" 
        viewBox="0 0 128 512"
        onClick={onClick}
      >
        <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/>
      </svg>
    );
  }

export default function Friend_Card(props: any) {
    const { image, name, email, description, isMenuVisible, toggleMenu } = props;

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mx-4 relative">
            <div className="flex justify-between items-start">
            <div className="flex justify-center items-center w-full mb-4">
                    <img src={image} alt="Profile image" className="w-24 h-24 rounded-full"></img>
                </div>
                <MoreButton
                onClick={toggleMenu}
                />
            </div>
            {isMenuVisible && (
                <div className="absolute top-0 right-0 mt-8 bg-white border rounded shadow-lg z-10">
                    <button className="block px-4 py-2 text-gray-900 hover:bg-gray-200">Add as friend</button>
                    <button className="block px-4 py-2 text-gray-900 hover:bg-gray-200">View profile</button>
                    <button className="block px-4 py-2 text-gray-900 hover:bg-gray-200">Message</button>
                </div>
            )}
            <p className="text-gray-600 text-center">{name}</p>
            <p className="text-gray-600 text-center"><strong>Email: </strong> {email}</p>
            <p className="mt-2 text-gray-500 text-center">{description}</p>
        </div>
    );
}