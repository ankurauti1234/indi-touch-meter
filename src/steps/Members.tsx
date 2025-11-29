import { useState } from "react";

const MemberCard = ({
  id,
  age,
  gender,
  active,
  onToggle,
}: {
  id: string;
  age: number;
  gender: string;
  active: boolean;
  onToggle: () => void;
}) => {
  // Normalize gender
  const g = gender.toLowerCase();

  // Determine age category
  let category = "";
  if (age <= 12) category = "kid";
  else if (age <= 19) category = "teen";
  else if (age <= 39) category = "middle";
  else if (age <= 59) category = "aged";
  else category = "elder";

  const imgSrc = `/members/${g}-${category}.png`;

  return (
    <div
      onClick={onToggle}
      className={`
        flex flex-col items-center justify-end p-4 text-center rounded-lg h-full w-full 
        bg-cover bg-no-repeat bg-center cursor-pointer border transition-all duration-300 
        ${active ? "border-green-500 bg-accent shadow-[0_0_15px_rgba(34,197,94,0.8)]" : "border-transparent shadow-inner brightness-50 grayscale-75"}
      `}
      style={{ backgroundImage: `url(${imgSrc})` }}
    >
      <p className="text-lg font-semibold bg-black/60 text-white px-3 py-1 rounded">
        {id}
      </p>
    </div>
  );
};

export default function Members() {
  const members = [
    { id: "M001", age: 10, gender: "Female" },
    { id: "M002", age: 35, gender: "Male" },
    { id: "M003", age: 65, gender: "Female" },
    { id: "M004", age: 10, gender: "Male" },
    { id: "M005", age: 29, gender: "Female" },
    { id: "M006", age: 19, gender: "Male" },
    { id: "M007", age: 15, gender: "Female" },
    { id: "M008", age: 80, gender: "Male" },
  ];

  // Track active states
  const [activeMap, setActiveMap] = useState<{ [key: string]: boolean }>({});

  const toggleActive = (id: string) => {
    setActiveMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="w-full h-[90vh] grid grid-cols-4 grid-rows-[1fr_1fr] gap-4">
      {members.map((m, i) => (
        <MemberCard
          key={i}
          {...m}
          active={!!activeMap[m.id]}
          onToggle={() => toggleActive(m.id)}
        />
      ))}
    </div>
  );
}
