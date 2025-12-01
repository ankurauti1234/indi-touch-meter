// src/steps/Members.tsx
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

interface Member {
  id: string;
  age: number;
  gender: string;
  active: boolean;
}

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
  const [members, setMembers] = useState<Member[]>([]);
  const [status, setStatus] = useState("");

  const loadMembers = async () => {
    try {
      const data: string = await invoke("get_members");
      setMembers(JSON.parse(data));
      setStatus("");
    } catch (error: any) {
      setStatus(`Failed to load members: ${error}`);
    }
  };

  const toggleMember = async (id: string) => {
    try {
      setStatus("Sending...");
      await invoke("toggle_member", { memberId: id });
      await loadMembers();
      setStatus("Successfully sent!");
      setTimeout(() => setStatus(""), 2000);
    } catch (error: any) {
      setStatus(`Failed: ${error}`);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  return (
    <div className="w-full h-full pb-12">
      <div className="w-full h-full grid grid-cols-4 grid-rows-[1fr_1fr] gap-4 ">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            id={member.id}
            age={member.age}
            gender={member.gender}
            active={member.active}
            onToggle={() => toggleMember(member.id)}
          />
        ))}
      </div>

      {status && (
        <div
          className={`absolute top-2 left-2 size-2 rounded-full text-white font-medium shadow-2xl transition-all ${
            status.includes("Success") || status.includes("sent")
              ? "bg-green-600"
              : "bg-red-50 text-red-700"
          }`}
        >
          {/* {status} */}
        </div>
      )}
    </div>
  );
}