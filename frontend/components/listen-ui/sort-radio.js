import React from 'react';

const notificationMethods = [
  { id: "desc", title: "Descend" },
  { id: "asc", title: "Ascend" },
];

function SortRadio({ sortOrder, onToggleSortOrder }) {
  function handleChange(event) {
    onToggleSortOrder(); // Update sortOrder and re-sort the list in the parent component
  }

  return (
    <div>
      <p className="text-sm">Sort by Heat</p>
      <fieldset className="">
        <legend className="sr-only">Sort By</legend>
        <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
          {notificationMethods.map((notificationMethod) => (
            <div key={notificationMethod.id} className="flex items-center">
              <input
                id={notificationMethod.id}
                name="notification-method"
                type="radio"
                checked={sortOrder === notificationMethod.id}
                onChange={handleChange}
                className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-600"
              />
              <label
                htmlFor={notificationMethod.id}
                className="ml-3 block text-sm font-medium leading-6"
              >
                {notificationMethod.title}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

export default SortRadio;
