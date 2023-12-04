const verificationBar = ({ level }: { level: number }) => {
  const getBackgroundColor = (levelValue: number) => {
    switch (levelValue) {
      case 1:
        return "from-red-500 to-red-700";
      case 2:
        return "from-green-500 to-green-700";
      case 3:
        return "from-blue-500 to-blue-700";
      default:
        return "from-gray-300 to-gray-500";
    }
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 shadow-md">
      <div className="flex h-2.5 rounded-full overflow-hidden transition-all duration-300 ease-in-out">
        <div
          data-testid="verification-bar"
          style={{ width: `${(level / 3) * 100}%` }}
          className={`h-full bg-gradient-to-r ${getBackgroundColor(level)} transition-all duration-300 ease-in-out`}
        ></div>
      </div>
    </div>
  );
};

export default verificationBar;
