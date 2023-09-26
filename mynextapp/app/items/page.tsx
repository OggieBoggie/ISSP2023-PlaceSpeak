"use client";
import React, { useEffect, useState } from "react";

interface Items {
  id: number;
  name: string;
  description: string;
}

const ItemsPage = () => {
  const [items, setItems] = useState<Items[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("http://127.0.0.1:8000/myapp/api/items");
      const data: Items[] = await res.json();
      setItems(data);
    })();
  }, []);

  return (
    <>
      <h1>Items</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - {item.description}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ItemsPage;
